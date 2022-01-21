let fs = require("fs")
let https = require("https")

var args = process.argv.slice(2);
let player = args[0];
if(!player) {
    console.error("No player arg")
    process.exit(1);
}

let loadTournaments = (callback) => {
    let playerLink = "https://sil.ph/" + player
    https.get(playerLink, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
            data += chunk
        })

        resp.on("end", () => {
            let allTournaments = [];
            while (true) {
                let newIndex = data.indexOf("https://silph.gg/tournaments/results");
                if (newIndex === -1) {
                    break;
                }
                allTournaments.push(data.slice(newIndex, newIndex + "https://silph.gg/tournaments/results".length + 5));
                data = data.slice(newIndex + 1);
            }

            // Remove duplicates
            allTournaments = allTournaments.filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            })

            // Finished. Time to call back
            console.log("You have fought in " + allTournaments.length + " tournaments");
            callback(allTournaments);
        });
    })
}

let loadAllOpponents = (allTournaments) => {
    let tournamentsLeft = allTournaments.length;
    let opponentsMap = {};
    for (let tournamentLink of allTournaments) {
        https.get(tournamentLink, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk
            })

            resp.on("end", () => {
                let haystack = data;
                while (true) {
                    // Search matchup of player
                    let matchupIndex = haystack.search("data-participant=\"[0-9a-z ]*" + player.toLowerCase() + "[0-9a-z ]*\" data-matchup-id");
                    if (matchupIndex === -1) {
                        break;
                    }

                    // Get opponent's name
                    let spaceIndex = haystack.indexOf(" ", matchupIndex);
                    let player1 = haystack.slice(matchupIndex + "data-participant=\"".length, spaceIndex);
                    let player2 = haystack.slice(spaceIndex + 1, haystack.indexOf("\"", spaceIndex));
                    let opponentLowerCase = player1 === player.toLowerCase() ? player2 : player1;

                    // Get correct case for opponent. This is usually in the last occurrence of the player name
                    let lastIndexOfOpponent = data.toLowerCase().lastIndexOf(opponentLowerCase);
                    let opponent = data.slice(lastIndexOfOpponent, lastIndexOfOpponent + opponentLowerCase.length)

                    if (!opponentsMap[opponent]) {
                        opponentsMap[opponent] = 0
                    }
                    opponentsMap[opponent] += 1;

                    // Move on to next matchup
                    haystack = haystack.slice(matchupIndex + 1);
                }

                // Count down tournaments. Write at the end
                tournamentsLeft--;
                if (tournamentsLeft == 0) {
                    console.log("You fought " + Object.keys(opponentsMap).length + " different opponents.")
                    fs.writeFileSync("./opponentMap.json", JSON.stringify(opponentsMap))
                }
            });
        })
    }
}

loadTournaments(loadAllOpponents)