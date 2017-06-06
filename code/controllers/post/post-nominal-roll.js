const NominalRollModels = require('../../models/nominal-roll-models');
const pdf = require('html-pdf');
const configPDF = require('../helpers/configure_pdf');
const validations = require('../../validators/validations');

const Response = function(req, res, next) {
  // handle checkboxes - switch values to boolean
  req.body.nodate = req.body.nodate === undefined || req.body.nodate === 'false' ? false : true;
  // do validations
  req.checkBody(validations.defaultValidation);
  req.getValidationResult().then(function(result) {
    let buildQ = null;
    let q = null;
    if (result.isEmpty()) {
      // validated (validation returns no 'result')
      // SANITIZE (note req.sanitize for ALL, or req.sanitizeBody, for separate)
      req.sanitize('soldier_surname').upperCase(); // to upper case
      req.sanitize('soldier_firstname').capitalize(); // capitalize
      req.sanitize('soldier_middlenames').createNamesArray(); // capitalize array values
      req.sanitize('soldier_serial_number').createNumArray(); // create array from CSV string
      if (req.body.action === 'Add Record' || req.body.action === 'Update Record') {
        // in addition to default validations (already checked above), also ensure names were submitted
        req.checkBody(validations.ensureNameValidation);
        req.getValidationResult().then(function(ensureNameResult) {
          if (ensureNameResult.isEmpty()) {
            // if the name field was submitted
            let newRecord = req.body;
            let record_id = newRecord.record_id.trim();
            NominalRollModels.SoldierRecords.findById(record_id, function(err, data) {
              let dupeSerial = false;
              // check serial numbers are unique
              NominalRollModels.SoldierRecords.find({}, 'soldier_serial_number', function(e, d) {
                if (newRecord.soldier_serial_number) {
                  newRecord.soldier_serial_number.forEach(function(serial) {
                    d.forEach(function(r) {
                      if (err && (r.soldier_serial_number && r.soldier_serial_number.indexOf(serial) !== -1)) {
                        // if a new record is being created (ie findById returned err) and dupes were found
                        dupeSerial = true; // mark duplicate serial as true
                      } else if (!err && (r.soldier_serial_number && r.soldier_serial_number.indexOf(serial) !== -1)) {
                        // if updating a record (ie findById returned existing data) but dupes were found
                        if (data.soldier_serial_number.indexOf(serial) == -1) {
                          // if existing record does not have the duped serial as it's own
                          dupeSerial = true;
                        }
                      }
                    });
                  });
                }
                if (!dupeSerial && err) {
                  // if no soldier serial numbers submitted that are duplicates of existing
                  // CREATE NEW RECORD - err returned from initinal findById means ID of existing was not found)
                  NominalRollModels.SoldierRecords.create(newRecord).then(function(createdRecord) {
                    // return posted data as response if successfully added to db
                    return res.status(201).send(createdRecord);
                  }).catch(err => createOrUpdateRecordFail(res, err)); // pass database error to middleware to handle
                } else if (!dupeSerial && !err) {
                  // UPDATE EXISTING RECORD (note: {new: true} simply returns the updated record_id)
                  NominalRollModels.SoldierRecords.findByIdAndUpdate(record_id,
                    newRecord, {
                      new: true,
                      runValidators: true,
                      context: 'query',
                    }).then(function(updatedRecord) {
                    // return updated data as response if successfully updated db
                    let updatedRecordObj = updatedRecord.toObject();
                    updatedRecordObj.action = 'Update Record'; // re-add this field to return data)
                    return res.status(201).send(updatedRecordObj);
                  }).catch(err => createOrUpdateRecordFail(res, err));
                } else {
                  // duplicate serial numbers were submitted, so return error
                  return createOrUpdateRecordFail(res, 'soldier_serial_number');
                }
              });
            });
          } else {
            // the name field was not submitted, so return an error
            res.status(422).json({
              error: {
                param: ensureNameResult.array()[0].param, // return only first error in array
                msg: ensureNameResult.array()[0].msg
              }
            });
          }
        }).catch(next);
      } else if (req.body.action === 'Generate Roll PDF') {
        // // // GENERATE PDF
        if (req.body.nodate) {
          // if nodate was checked, sanitize unit names to remove date element
          req.sanitize('soldier_units').remove_unit_dates_formatter();
        }
        buildQ = buildQuery(req.body, 'UNITS');
        q = buildQ[0];
        q.exec(function(err, data) {
          if (data && !err && !!data.length) {
            // configure pdf
            var configuredPDF = configPDF(buildQ[1], data,
              req.body.kia === 'K' ? 'ROH' : 'NOM');
            // write the header
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              // change 'inline' to 'attachment' for file download rather than display in browser
              'Content-disposition': 'inline; filename=' + configuredPDF.filename,
            });
            // create & stream the pdf
            pdf.create(configuredPDF.html, configuredPDF.options).toStream(function(err, stream) {
              if (!err) {
                stream.pipe(res);
              } else {
                res.status(422).render('pdf-no-records');
              }
            });
          } else {
            res.status(422).render('pdf-no-records');
          }
        });
      } else if (req.body.action === 'Retrieve Records') {
        // // // RETRIEVE RECORDS
        buildQ = buildQuery(req.body, 'ALL');
        q = buildQ[0];
        q.exec(function(err, data) {
          if (data && !err && !!data.length) {
            res.status(200).json(data);
          } else {
            res.status(422).json({
              error: {
                param: 'record',
                msg: 'No records returned!'
              }
            });
          }
        });
      }
    } else {
      // did not validate (non validation returns a 'result')
      res.status(422).json({
        error: {
          param: result.array()[0].param, // return only first error in array
          msg: result.array()[0].msg
        }
      });
    }
  }).catch(next);

  function buildQuery(postData, rollType) {
    // BUILD QUERY TO RETRIEVE DATA FROM MONGO
    let unitsToPresent = [];
    let Query = {};
    if (rollType === 'ALL') {
      if (postData.soldier_firstname) Query.soldier_firstname = postData.soldier_firstname;
      if (postData.soldier_surname) Query.soldier_surname = postData.soldier_surname;
      if (postData.soldier_serial_number) {
        Query.soldier_serial_number = {
          $in: postData.soldier_serial_number
        };
      }
      if (postData.soldier_units.indexOf('Unspecified') === -1) {
        // if 'Unspecified' not in soldier_units, limit query to selected soldier_units
        Query.soldier_units = {
          $in: postData.soldier_units
        };
      }
      if (postData.kia === 'K' || postData.kia === 'S') {
        Query.kia = postData.kia; // if kia 'yes', only return kia; if 'no' return only no, if unspec return all
      }
    } else if (rollType === 'UNITS') { // for PDF
      // remove 'Unspecified' from the Nominal roll (pointless without a unit & don't want PDF of entire db!)
      unitsToPresent = postData.soldier_units.filter(u => u !== 'Unspecified');
      // define rest of query
      if (postData.nodate) {
        let regex = ``;
        unitsToPresent.forEach(function(u) {
          regex += `^.*${u}.*$|`;
        });
        regex = regex.charAt(regex.length - 1) == '|' ? regex.substr(0, regex.length - 1) : regex;
        // define query
        Query.soldier_units = {
          $regex: regex,
          $options: 'i'
        };
      } else {
        // define query
        Query.soldier_units = {
          $in: unitsToPresent
        };
      }
      if (postData.kia === 'K') {
        Query.kia = 'K'; //if kia, produce Roll of Honour. Else, ALL kia status for nominal roll
      }
    }
    return [
      NominalRollModels.SoldierRecords.find(
        Query, null, {
          sort: {
            soldier_surname: 1,
            solider_serial_number: 1,
          }
        }),
      unitsToPresent
    ];
  }
};

function createOrUpdateRecordFail(res, err) {
  let errorMessage = '';
  if (err === 'soldier_serial_number') {
    errorMessage = 'There is already a solider in the database with this serial number!';
  } else {
    errorMessage = 'There was an error adding the record to the database. Please contact an administrator.';
    console.log(err);
  }
  return res.status(422).json({
    error: {
      param: 'record',
      msg: errorMessage
    }
  });
}
module.exports = Response;
