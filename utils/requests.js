const axios = require("axios");
const cheerio = require("cheerio");

function getRidersCount(year, stage) {
    const url = `${process.env.DATA_URL}/${year}/${stage}`;

    return axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);

            return $('div#resultsCont div.resTab:eq(1) table.results tbody tr').length;
        })
        .catch((error) => {
            console.error(error);

            return 0;
        });
}
function getAllDatas(year, stage) {
    const url = `${process.env.DATA_URL}/${year}/${stage}`;

    return axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const rows = [];
            let lastValidTime = '00:00';

            $('div#resultsCont div.resTab:eq(1) table.results tbody tr').each((i, row) => {
                const $row = $(row);
                const getTdText = (index) => $row.find('td').eq(index).text().trim();
                const getTdAttr = (index, selector, attr) => $row.find('td').eq(index).find(selector).attr(attr);

                let rawTime = i === 0
                    ? '00:00'
                    : $row.find('td').eq(11).find('font').text().trim();

                let timeDiff = (rawTime && rawTime !== ',,') ? rawTime : lastValidTime;
                if (rawTime && rawTime !== ',,') lastValidTime = rawTime;

                if (timeDiff.split(':').length === 2) {
                    if (timeDiff.split(':')[0].length === 1) {
                        timeDiff = '0' + timeDiff
                    }
                    timeDiff = '00:' + timeDiff
                } else if (timeDiff.split(':').length === 3 && timeDiff.split(':')[0].length === 1) {
                    timeDiff = '0' + timeDiff
                }

                const col = {
                    rank: parseInt(getTdText(0)),
                    age: parseInt(getTdText(6)),
                    name: $row.find('td').eq(7).find('a').text().trim(),
                    flag: (() => {
                        const classes = getTdAttr(7, 'span', 'class')?.split(' ') || [];
                        return classes[1] || null;
                    })(),
                    team: getTdText(8),
                    time_diff: `${timeDiff}`
                };

                rows.push(col);
            });

            return rows
        })
        .catch((error) => {
            console.error(error);

            return [];
        });
}

function getAllRidersNames(year, stage) {
    const url = `${process.env.DATA_URL}/${year}/${stage}`;
    return axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const names = [];

            $('div#resultsCont div.resTab:eq(1) table.results tbody tr').each((i, row) => {
                const rank = $(row).find('td').eq(0).text().trim();
                const name = $(row).find('td').eq(7).find('a').text().trim();

                names.push({ rank: rank, name: name });
            });

            return names
        }).catch((error) => {
            console.error(error);

            return [];
        });
}

module.exports = {
    getRidersCount,
    getAllDatas,
    getAllRidersNames
};