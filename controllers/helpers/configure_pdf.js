module.exports = function(unitList, data, type) {
  // construct html
  let rollHtml = {};
  unitList.forEach(function(unit) {
    rollHtml[unit] = `<ul class="unit-record">`;
    data.forEach(function(record) {
      record.soldier_units.forEach(function(u) {
        // if iterated soldier_unit contains text of iterated selected unit (which may have had date removed)
        if (u.includes(unit)) {
          rollHtml[unit] += `<ul>`;
          let kia = record.kia === 'K' ? 'Yes' : 'No';
          let serial = record.soldier_serial_number ? record.soldier_serial_number : '';
          let middlenames = record.soldier_middlenames.join(', ');
          rollHtml[unit] += `<li>Serial Number: ${serial}</li>`;
          rollHtml[unit] += `<li>Surname: ${record.soldier_surname}</li>`;
          rollHtml[unit] += `<li>First Name: ${record.soldier_firstname}</li>`;
          rollHtml[unit] += `<li>Middle Names: ${middlenames}</li>`;
          rollHtml[unit] += `<li>Killed In Action: ${kia}</li>`;
          rollHtml[unit] += '</ul><hr>';
        }
      });
    });
    rollHtml[unit] += `</ul><hr>`;
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
    html += `<div style="${styles.body}">
                            <h1 style="${styles.h1}">${unit}</h1>
                            ${rollHtml[unit]}
                            </div>`;
  });
  return {
    filename: filename,
    html: html,
    options: options,
  };
};
