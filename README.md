# RandomSilphOpponent

These scripts can output a random opponent you fought in any Silph tournament.

## How to use
1. Make sure you have node installed as well as a stable internet connection
2. Clone this repository
3. run `node loadAllOpponents <PlayerName>` where  PlayerName is your player name in Silph. This script will list every opponent you fought into a new file "opponentMap.json".
4. Run `node testRun` to get a random opponent of the list. The more often you fought someone, the liklier they are picked. If you want the picked opponent to be instantly removed, run `node getRandom`.
