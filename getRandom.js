let fs = require("fs")

if(!fs.existsSync("./opponentMap.json")) {
    console.error("You first have to load the opponentMap by running loadAllOpponents")
}

let opponentMap = JSON.parse(fs.readFileSync("./opponentMap.json"));

let lotteryPool = [];
for(let opponent of Object.keys(opponentMap)) {
    let numberOfFights = opponentMap[opponent];
    for(let i = 0; i < numberOfFights; i++) {
        lotteryPool.push(opponent)
    }
}

let result = lotteryPool[Math.floor(Math.random() * lotteryPool.length)]
console.log(result)

delete opponentMap[result];
fs.writeFileSync("./opponentMap.json", JSON.stringify(opponentMap))