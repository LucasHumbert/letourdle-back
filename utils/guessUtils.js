const { Duration } = require("luxon");

function findRiderInDatas(datas, riderRank) {
    return datas.find((rider) => rider.rank === riderRank)
}

function ridersComparison(riderGuessed, riderToFind) {
    const rank = riderGuessed.rank === riderToFind.rank
        ? 'exact'
        :  riderGuessed.rank > riderToFind.rank
            ? 'higher'
            : 'lower'
    const age = riderGuessed.age === riderToFind.age
        ? 'exact'
        :  riderGuessed.age > riderToFind.age
            ? 'lower'
            : 'higher'
    const flag = riderGuessed.flag === riderToFind.flag ? 'exact' : 'wrong'
    const team = riderGuessed.team === riderToFind.team ? 'exact' : 'wrong'

    const guessedDiff = Duration.fromISOTime(riderGuessed.time_diff).toMillis()
    const toFindDiff = Duration.fromISOTime(riderToFind.time_diff).toMillis()
    const time_diff = guessedDiff === toFindDiff
        ? 'exact'
        :  guessedDiff > toFindDiff
            ? 'lower'
            : 'higher'


    return {
        rank: rank,
        age: age,
        flag: flag,
        team: team,
        time_diff: time_diff
    }
}

module.exports = {
    findRiderInDatas,
    ridersComparison
}