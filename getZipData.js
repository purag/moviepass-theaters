const fs = require('fs');
const { get } = require('request');

fs.readFile('zips', 'utf-8', (err, data) => {
  const zips = data.trim().split('\n');
  const total = zips.length;
  let done = 0;

  for (let zip of zips) {
    (function (zip) {
      get({
        url: `https://www.moviepass.com/theaters/zip/${zip}`,
        json: true,
      }, (err, res, data) => {
        const file = `data/${zip}.theaters.json`;
        fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
          if (err) throw err;
          done++;
          console.log(`${done}/${total}\tfetched theaters for ${zip} => ${file}`);
        });
      });
    })(zip);
  }
});
