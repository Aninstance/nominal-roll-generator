$(document).ready(function($) {

  /* Note: form submission disabled on buttons for adding and retrieving records
   These buttons (input elements) also have class of 'ajax'. When clicked, they fire the
   method below, which posts the form via AJAX. However, when pdf button clicked, the
   form is posted in default post request (but to new tab (target='_blank')). The hidden
   field is used to pass the required 'action' field/value that's required by the form
   processing. The value of this hidden field is overridden with a different appropriate value
   when form submitted using AJAX.
   */

  /* do we need to jump to docs? Test query string*/
  var urlQueries = getURLQueries();
  if (urlQueries.docs && urlQueries.docs !== 'false') {
    showDocs(); // if ?docs=true, show them!
  }

  /* back to top link listener */
  $('a#back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: $('div#main-body').offset().top
    }, 1000);
  });

  // listen for button clicks
  $('form input.ajax[type=submit]').click(function() {
    const buttonValue = $(this).val();
    $('div#record-data ul.record-list').remove(); // clear previously displayed records
    hideDocs();
    // pass value of clicked submit button
    postAjax(buttonValue);
  });
  const postAjax = function(formAction) {
    const formData = {
      soldier_surname: $('form input[name=soldier_surname]').val(),
      soldier_firstname: $('form input[name=soldier_firstname]').val(),
      soldier_middlenames: $('form input[name=soldier_middlenames]').val(),
      soldier_serial_number: $('form input[name=soldier_serial_number]').val(),
      soldier_units: $('form select#soldier_units_select').val(),
      kia: $('form select#kia').val(),
      nodate: $('form input[name=nodate]').is(":checked"),
      action: formAction,
      record_id: $('form input[name=record_id]').val(),
    };

    // clear any errors from last time
    $('div.error').empty();

    // make ajax request
    $.ajax({
      type: 'POST',
      url: '/nominal-roll',
      data: formData,
      success: function(data, textStatus, request) {
        if (!Array.isArray(data)) {
          // set title
          if (data.action === 'Add Record') {
            $('h2.display-title').text('Record Added');
          } else if (data.action === 'Update Record') {
            $('h2.display-title').text('Record Updated');
          } else {
            $('h2.display-title').text('Record Retrieved');
          }
          showNewRecordData(function() {
            // populate data
            populateRecord(data);
          });
        } else {
          // set title (must be records retrieved rather than just added, because it's an array)
          $('h2.display-title').text('Records Retrieved');
          showNewRecordData(function() {
            // populate data
            data.forEach(function(item) {
              populateRecord(item);
            });
          });
        }
      },
      error: function(err) {
        if (err.responseJSON) {
          showNewRecordData(function() {
            $('div#record-data div.error:first-of-type').html(err.responseJSON.error.msg);
          });
        } else {
          console.log('An error occurred: ' + err.message);
        }
      }
    });
    return false;
  };
  const populateRecord = function(data) {
    // populate record div with data returned back from form
    var units = '',
      middlenames = '',
      soldier_serial_nums = '';
    data.soldier_units.forEach(function(item) {
      units += '<li class="record_soldier_unit" data-unit="' + item + '">' + item + '</li>';
    });
    if (data.soldier_middlenames.filter(function(e) {
        return e;
      }).length) {
      data.soldier_middlenames.forEach(function(item) {
        middlenames += item + ' ';
      });
    }
    if (data.soldier_serial_number) {
      data.soldier_serial_number.forEach(function(item) {
        soldier_serial_nums += item + ' ';
      });
    }
    let kia = '';
    if (data.kia === 'U') {
      kia = 'Unspecified';
    } else {
      kia = data.kia === 'K' ? 'Yes' : 'No';
    }
    $('div#record-data').append('<div class="error" data-id="' + data._id + '"></div>' +
      '<div class="error unit-update-error" data-id="' + data._id + '"></div><ul class="record-list">' +
      '<li class="soldier_serial_number" data-id="' + data._id + '"> Soldier Serial Number: ' +
      soldier_serial_nums + '</li>' +
      '<li class="record_soldier_name" data-id="' + data._id + '">' +
      'Soldier name: ' + data.soldier_surname + ', ' + data.soldier_firstname + ' ' + middlenames +
      '</li><li class="record_units">Soldier units:<ul data-id="' + data._id + '">' + units +
      '</ul></li><li class="record_kia">Killed in Action? ' + kia + '</li>' +
      '<li class="edit_record" data-id="' + data._id + '">Edit Record</li>' +
      '</ul>');

    $('li.edit_record').off('click').on('click', function() {
      window.location.href = '/nominal-roll/' + $(this).data('id') + '/?docs=false';
    });

    // allow deletion of the displayed record by clicking on the name
    $('li.record_soldier_name').off('click').on('click', function() {
      if (confirm('Are you sure you want to delete this record?')) {
        var recordID = $(this).data('id');
        $.ajax({
          type: 'DELETE',
          url: '/nominal-roll/' + recordID,
          success: function(deleted) {
            $('li.record_soldier_name[data-id=' + recordID + ']').parent().remove();
          },
          error: function(err) {
            if (err.responseJSON) {
              $('div#record-data div.error[data-id=' + recordID + ']').html(err.responseJSON.error.msg);
            } else {
              console.log('An error occurred: ' + err);
            }
          }
        });
      }
    });
    // allow deletion of a unit
    $('li.record_units li.record_soldier_unit').off('click').on('click', function() {
      if (confirm('Are you sure you want to delete this unit from the record?')) {
        var unitToRemove = ($(this).data('unit'));
        var recordID = $(this).parent().data('id');
        $.ajax({
          type: 'PUT',
          url: '/nominal-roll/' + recordID + '?unit=' + unitToRemove,
          success: function(updated) {
            $('ul[data-id=' + recordID + '] ' +
              'li.record_soldier_unit[data-unit="' + unitToRemove + '"]').remove();
          },
          error: function(err) {
            if (err.responseJSON) {
              $('div.unit-update-error[data-id=' + recordID + ']')
                .html(err.responseJSON.error.msg);
            } else {
              console.log('An error occurred: ' + err);
            }
          }
        });
      }
    });
  };
});

function getURLQueries() {
  var queryString = window.location.search.slice(1);
  var QueryObject = {};
  if (queryString) {
    queryString = queryString.split('#')[0]; // e.g. example1=value1&example2=value2
    qsArr = queryString.split('&'); //e.g. ['example1=value1', 'example2=value2']
    qsArr.forEach(function(q) {
      var a = q.split('='); // e.g. ['example1', 'value1']
      // handle possible arrays (e.g. example2[2]=value2)
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*]/, function(v) {
        // record param number (e.g. example2[2] would record 2) & delete the [2] (i.e. return '')
        paramNum = v.slice(1, -1);
        return '';
      });
      // set param value to 'true' if no value was assigned to the param, otherwise assign the value
      var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];
      // all to lowercase
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();
      // remove dupes
      if (QueryObject[paramName]) {
        // if paramName already exists in QueryObject obj
        if (typeof QueryObject[paramName] === 'string') {
          // if paramName is a string, convert param name into array
          QueryObject[paramName] = [paramName];
        }
        if (typeof paramNum === 'undefined') {
          // push paramValue to pramName array if had no index number (i.e. NOT example[1]=value1)
          QueryObject[paramName].push(paramValue);
        } else {
          // if it DID have an index number, put the value at that index number in the paramName array
          QueryObject[paramName][paramNum] = paramValue;
        }
      } else {
        // if paramName DOES NOT yet exist, set it
        QueryObject[paramName] = paramValue;
      }
    });
  }
  return QueryObject;
}

function showNewRecordData(populateData) {
  $('div#docs').hide('slow', function() {
    $('div#record-data').hide('slow', function() {
      populateData(); // call the passed in function
      $(this).show('slow', function() {
        $('html, body').animate({ // scroll to top of view pane
          scrollTop: $('div#record-display').offset().top
        }, 1000);
      });
    });
  });
}

function hideDocs() {
  $('div#docs').hide('slow', function() {
    $('html, body').animate({ // scroll to top of view pane
      scrollTop: $('div#record-display').offset().top
    }, 1000);
  });
}

function showDocs() {
  $('div#record-data').hide('slow', function() {
    $('div#docs').show('slow', function() {
      $('html, body').animate({ // scroll to top of view pane
        scrollTop: $('div#record-display').offset().top
      }, 1000);
    });
  });
}
