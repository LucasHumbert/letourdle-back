const express = require('express')
const { getRidersCount, getAllRidersNames, getAllDatas} = require("./utils/requests");
const {encode, decode} = require("./utils/hideNumber");
const {findRiderInDatas, ridersComparison} = require("./utils/guessUtils");
require('dotenv').config();

const app = express()
const port = 3000

app.get('/start', async (req, res) => {
    const riderCount = await getRidersCount(req.query.year, req.query.stage)
    const riderToSearch = encode(Math.floor(Math.random() * riderCount) + 1)

    res.json({ success: true, rider_to_search: riderToSearch })
})

app.get('/guess', async (req, res) => {
    let datas = await getAllDatas(req.query.year, req.query.stage)
    let riderToFind = decode(req.query.data)
    let riderGuessed = parseInt(req.query.guess)
    let isCorrect;
    let comparisons = {}

    if (riderGuessed === riderToFind) {
        riderGuessed = findRiderInDatas(datas, riderGuessed)
        isCorrect = true
    } else {
        riderGuessed = findRiderInDatas(datas, riderGuessed)
        riderToFind = findRiderInDatas(datas, riderToFind)

        comparisons = ridersComparison(riderGuessed, riderToFind)

        isCorrect = false
    }

    res.json({
        success: true,
        is_correct: isCorrect,
        rider: riderGuessed,
        comparisons: comparisons,
    })
})

app.get('/autocomplete', async (req, res) => {
    let riders = await getAllRidersNames(req.query.year, req.query.stage)
    let results = riders.filter((rider) =>
        rider.name
            .toLowerCase()
            .includes(req.query.search.trim())
    )

    res.json({ success: true, results: results })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
