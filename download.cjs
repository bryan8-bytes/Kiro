const https = require('https');
const fs = require('fs');

const download = (url, path) => {
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(res.headers.location, path);
    }
    const file = fs.createWriteStream(path);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded', path);
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
};

download('https://media.tenor.com/2Xy3l558Hq4AAAAC/cinnamoroll-sanrio.gif', 'src/assets/error1.gif');
download('https://media.tenor.com/n14G03D5fukAAAAC/cinnamoroll-sad.gif', 'src/assets/error2.gif');
download('https://media.tenor.com/XqT7h4_3B2gAAAAC/cinnamoroll-crying.gif', 'src/assets/error3.gif');
download('https://media.tenor.com/ot_dHd215YEAAAAC/cinnamoroll-skate-board.gif', 'src/assets/success.gif');
