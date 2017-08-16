const fs = require('fs');
const { get } = require('request');

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
