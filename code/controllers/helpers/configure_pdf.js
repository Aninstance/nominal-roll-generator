const helpers = require('./aninstance-helpers');
module.exports = function(unitList, data, type) {
  // if multiple identical unit names selected (albeit with different date parts of string), combine
  unitList = combineIdenticalUnits(unitList);
  // construct html
  let rollHtml = {};
  unitList.forEach(function(unit) {
    rollHtml[unit[2]] = `<ul class="unit-record">`;
    data.forEach(function(record) {
      let recordSeen = [];
      record.soldier_units.forEach(function(u) {
        // ensure iterated soldier isn't presented multiple times due to being present in multiple years for same unit
        if (!recordSeen.includes(record._id)) {
          recordSeen.push(record._id);
          // if iterated soldier_unit contains text of iterated selected unit (which may have had date removed)
          if (u.includes(unit[2])) {
            rollHtml[unit[2]] += `<ul>`;
            let kia = record.kia === 'K' ? 'Yes' : 'No';
            let serial = record.soldier_serial_number ? record.soldier_serial_number : '';
            let middlenames = record.soldier_middlenames.join(', ');
            rollHtml[unit[2]] += `<li>Serial Number: ${serial}</li>`;
            rollHtml[unit[2]] += `<li>Surname: ${record.soldier_surname}</li>`;
            rollHtml[unit[2]] += `<li>First Name: ${record.soldier_firstname}</li>`;
            rollHtml[unit[2]] += `<li>Middle Names: ${middlenames}</li>`;
            rollHtml[unit[2]] += `<li>Killed In Action: ${kia}</li>`;
            rollHtml[unit[2]] += '</ul><hr>';
          }
        }
      });
    });
    rollHtml[unit[2]] += `</ul><hr>`;
  });
  let html = ``,
    rollTitle = `sasoriginals-nominal-roll`,
    headerTitle = type === 'ROH' ? 'Roll of Honour' : 'Nominal Roll';
  let styles = {
    header: 'text-align:center;font-size:28px;font-weight:bold;font-family:monospace;',
    body: 'font-size:18px;font-family:monospace;',
    h1: 'font-size:20px;text-align:center;margin:7px07px0;font-family:monospace;'
  };
  let options = {
    format: 'A4',
    border: {
      top: '12px',
      right: '7px',
      bottom: '7px',
      left: '7px'
    },
    header: {
      height: '48px',
      contents: `<div style="${styles.header}">${headerTitle}</div>`,
    },
    footer: {
      height: '48px',
      contents: {
        default: `<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>`,
      }
    }

  };
  let filename = encodeURIComponent(rollTitle) + '.pdf';
  unitList.forEach(function(unit) {
    let yearSpan = unit[0] && unit[1] ? unit[0] !== unit[1] ? `(${unit[0]} - ${unit[1]})` : `${unit[0]}` : '';
    html += `<div style="${styles.body}">
                            <h1 style="${styles.h1}">${unit[2]} ${yearSpan}</h1>
                            ${rollHtml[unit[2]]}
                            </div>`;
  });
  return {
    filename: filename,
    html: html,
    options: options,
  };
};

function combineIdenticalUnits(unitList) {
  // function to combine identical selected unit names by removing the date part of string
  let dateUnitList;
  let unitsToDisplay;
  if (unitList instanceof Array) {
    // switch [ 'date | unit_name', 'date | unit_name' ] to [ [Date, String], [Date, String] ]
    if (unitList.length > 0) {
      dateUnitList = helpers.formatToDateAndString(unitList);
    }
    // get a array of unique names with date range [[earliest Date selected, latest Date selected, unique unit name]]
    unitsToDisplay = helpers.getUniqueNamesWithDateRange(dateUnitList);
  }
  // convert the dates from the unitsToDisplay list to year
  unitsToDisplay.forEach(function(u) {
    u[0] = u[0] !== undefined ? u[0].getFullYear() : null;
    u[1] = u[1] !== undefined ? u[1].getFullYear() : null;
  });

  return unitsToDisplay;
}
