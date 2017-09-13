const helpers = require('./aninstance-helpers');
const moment = require('moment');

module.exports = (rollRequest, records, type) => {
  // construct html
  let unitName = rollRequest.unit_name;
  let rollHtml = {};
  rollHtml = `<ul class="unit-record" style="list-style:none"><li>`;
  records.forEach(r => {
    let newRollHtml = `
    <ul style="page-break-inside:avoid;list-style:none;">
    <li>Surname: ${r.soldier_surname}</li>
    <li>First name: ${r.soldier_firstname}</li>
    <li>Middlename(s): ${r.soldier_middlenames ? r.soldier_middlenames.join(', ') : ''}</li>
    <li>Service number(s): ${r.soldier_serial_number ? r.soldier_serial_number.join(', ') : ''}</li>
    <li>Killed in Action: ${r.kia}</li>
    `;
    if ('kiaDate' in r && !isNaN(Date.parse(r.kiaDate))) {
      newRollHtml += `<li>Date KIA: ${moment(r.kiaDate).format("DD MMMM YYYY")}</li>`
    }
    newRollHtml += '</ul><br>';
    return rollHtml += newRollHtml;
  });
  rollHtml += `</li></ul>`;

  let html = ``,
    rollTitle = `Aninstance-Nominal-Roll-Generator`,
    headerTitle = type === 'ROH' ? `Roll of Honour` : `Nominal Roll`;

  const styles = {
    header: 'text-align:center;font-size:18px;font-weight:bold;font-family:monospace;',
    body: 'font-size:12px;font-family:monospace;margin-top:1.5em;',
    h1: 'font-size:16px;text-align:center;font-family:monospace;',
    h2: 'font-size:14px;text-align:center;font-family:monospace;',
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

  const filename = encodeURIComponent(rollTitle) + '.pdf';
  const yearSpan = `${moment(rollRequest.periodFrom).format("DD MMMM YYYY")} - ${moment(rollRequest.periodTo).format("DD MMMM YYYY")}`;
  html += `
<div style="${styles.body}">
<h1 style="${styles.h1}">${unitName}</h1>
<h2 style="${styles.h2}">${yearSpan}</h2>
${rollHtml}
</div>`;
  return {
    filename: filename,
    html: html,
    options: options,
  };
};
