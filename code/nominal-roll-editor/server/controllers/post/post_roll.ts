const pdf = require('html-pdf');
const configPDF = require('../helpers/configure_pdf');
import validations = require('../../validators/validations');
import NominalRollModels = require('../../models/nominal-roll-models');

module.exports = (req, res, next) => {
  req.check(validations.rollSchema);
  req.getValidationResult().then(function (result) {
    if (result.isEmpty()) {
      let err = null;
      let roll = req.body;
      // allow batching if set
      let skip = 0;
      let batchSize = 0;
      // build query
      const query = buildQuery(req.query.type, roll);
      // run query
      if (query) {
        NominalRollModels.SoldierRecords.find(query, null, {
          sort: {
            soldier_surname: 1
          },
          skip: skip,
          limit: batchSize,
        }, (err, records) => !err && records ? createPDF(res, roll, records, req.query.type) : createResponse(res, err, []));
      } else {
        return createResponse(res, 'No roll ID or type present!', [])
      }
    } else {
      return createResponse(res, result.array()[0].msg, null);
    }
  }).catch((err) => {
    console.log(err)
    createResponse(res, err, null)
  });

  function buildQuery(type, roll) {
    if (roll._id !== undefined && type) {
      /* query for records with that unit id, between those date constrains, either ROH or NOM depending on type
       */
      let query = {
        'soldier_units': {
          '$elemMatch': {
            'unit._id': roll._id,
            'unit_period.1': {
              "$gte": new Date(roll.periodFrom)
            },
            'unit_period.0': {
              "$lte": new Date(roll.periodTo)
            },
          }
        },
        'kia': type === 'ROH' ? 'YES' : {
          $in: ['YES', 'NO', 'UNKNOWN']
        },
        'kiaDate': {}
      };
      if (type === 'ROH') {
        // if ROH, only return soliders whose KIA date falls within the specified unit period for the specified unit.
        query.kiaDate = {
          "$gte": new Date(roll.periodFrom),
          "$lte": new Date(roll.periodTo)
        }
      }
      return query;
    }
    return false;
  }

  function createPDF(res, rollRequest, records, type) {
    // configure pdf
    const configuredPDF = configPDF(rollRequest, records, type); // ROH or NOM
    // write the header
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      // change 'inline' to 'attachment' for file download rather than display in browser
      'Content-disposition': 'inline; filename=' + configuredPDF.filename,
    });
    // create & stream the pdf
    pdf.create(configuredPDF.html, configuredPDF.options).toStream((err, stream) => {
      if (!err) {
        //return createResponse(stream.pipe(res), err, []);
        return stream.pipe(res);
      } else {
        return createResponse(res, err, []);
      }
    });
  }

  function formatData(data) {
    // return formatted data
    return Array.isArray(data) ? data.map((d) =>
      doFormatting(d)) : doFormatting(data);

    function doFormatting(data) {
      // CREATE PDF WILL GO HERE ...
      return data;
    }
  }

  function createResponse(res, err, roll) {
    let jsonToReturn = {
      success: !err,
      error: err.toString() || null,
      data: roll ? formatData(roll) : [],
    };
    return respond(res, jsonToReturn);
  }

  function respond(res, jsonToReturn) {
    return res.status(jsonToReturn.error === null ? 200 : 422).json(jsonToReturn);
  }
};

