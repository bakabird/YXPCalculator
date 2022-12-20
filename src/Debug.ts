var fs = require('fs')
var util = require('util')


// var nowDate = new Date();
// var logPath = `fight-${nowDate.getMonth()}_${nowDate.getDate()}.log`
// var logFile = fs.createWriteStream(logPath, { flags: 'a' })

// console.log = function() {
//   logFile.write(util.format.apply(null, arguments) + '\n')
//   process.stdout.write(util.format.apply(null, arguments) + '\n')
// }
 
// console.error = function() {
//   logFile.write(util.format.apply(null, arguments) + '\n')
//   process.stderr.write(util.format.apply(null, arguments) + '\n')
// }

export class Debug {
    public static debugLevel = 0;
    static debug(...arg) {
        if(Debug.debugLevel < 1) {
            console.log(...arg);
        }
    }
    static log(...arg) {
        if (Debug.debugLevel < 2){
            console.log(...arg);
        }
    }
}