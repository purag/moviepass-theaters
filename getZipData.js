const fs = require('fs');
const { get } = require('request');

if (process.argv.indexOf('--help') > -1) {
  console.log('usage: node getZipData.js [<zip> [<zip>...]]');
  console.log('If no <zip> is provided, fetch the data for the zips in the `zips` file.');
  process.exit();
}

let total;
let done = 0;

function fetchZipData (zip) {
  if (!zip.match(/^[0-9]{5}$/)) throw new Error(`Invalid Zip Code: ${zip}`)

  get({
    url: `https://www.moviepass.com/theaters/zip/${zip}`,
    json: true,
  }, (err, res, data) => {
    const file = `data/${zip}.theaters.json`;
    fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
      if (err) throw err;
      console.log(`${++done}/${total}\tfetched theaters for ${zip} => ${file}`);
    });
  });
}

let zips;

if (process.argv.length > 2) {
  zips = process.argv.slice(2);
} else {
  const data = fs.readFileSync('zips', 'utf-8');
  zips = data.trim().split('\n');
}

total = zips.length;
for (let zip of zips) {
  fetchZipData(zip);
}
