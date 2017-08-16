const fs = require('fs');
const { get } = require('https');

fs.readFile('zips', 'utf-8', (err, data) => {
  const zips = data.trim().split('\n');
  const total = zips.length;
  let done = 0;

  for (let zip of zips) {
    (function (zip) {
      get(`https://www.moviepass.com/theaters/zip/${zip}`, (res) => {
        res.on('data', (data) => {
          data = JSON.stringify(JSON.parse(data), null, 2);
          fs.writeFile(`data/${zip}.theaters.json`, data, (err) => {
            if (err) throw err;
            done++;
            console.log(`${done}/${total}\tfetched theaters for ${zip} => data/${zip}.theaters.json`);
          });
        });
      });
    })(zip);
  }
});
