const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const url = `${process.env.DATA_URL}/2025/stage-16`;

axios.get(url).then((response) => {
    const $ = cheerio.load(response.data);
    const rows = [];

    $('div#resultsCont div.resTab:eq(1) table.results tbody tr').each((i, row) => {
        let timeDiff = '+' + (i === 0 ? '00:00' : $(row).find('td').eq(11).find('font').text().trim())

        let col = {
            rank: $(row).find('td').eq(0).text().trim(),
            age: $(row).find('td').eq(6).text().trim(),
            name: $(row).find('td').eq(7).find('a').text().trim(),
            flag: $(row).find('td').eq(7).find('span').attr('class').split(' ')[1],
            team: $(row).find('td').eq(8).text().trim(),
            time_diff: timeDiff
        }

        rows.push(col);
    });

    console.log(rows[0], rows[5]);
}).catch(console.error);
