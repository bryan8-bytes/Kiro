const https = require('https');
const queries = ['4morant', 'in the h3art', 'join me in death him', 'nope your too late i already died', 'i want things to be beautiful'];

function getYoutubeId(query) {
    return new Promise((resolve) => {
        https.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/"videoId":"(.*?)"/);
                resolve(`${query}: ${match ? match[1] : 'None'}`);
            });
        });
    });
}

Promise.all(queries.map(getYoutubeId)).then(results => results.forEach(r => console.log(r)));
