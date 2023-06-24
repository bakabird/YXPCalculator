// 检索的相对文件夹
const relativePath = '../'
// 不需要混淆的js或文件夹
const exitFile = ['node_modules', 'Hunxiao', 'hunxiao.js', 'gulpfile.js', "jquery.js"]


var fs = require('fs')
import process from 'child_process'
var readDir = fs.readdirSync(relativePath);


// 需要存在的js
const czFile = []

var filePath = relativePath
var arr = new Array()
readFile(readDir, filePath)
// 读取相对路径下的所有文件
function readFile(readDir, filePath) {
    if (readDir.length > 0) {
        for (var i = 0; i < readDir.length; i++) {
            scannerFile(readDir[i], filePath)
        }
    }
}
// 扫描文件进行检索出js文件进行混淆
function scannerFile(file, filePath) {
    console.log("file-----" + file);
    var readdirpath = ""
    if (filePath == './') {
        readdirpath = filePath + file
    } else {
        readdirpath = filePath + "/" + file
    }
    if (exitFile.indexOf(file) < 0) {
        console.log('-->Start entering FS');
        fs.stat(readdirpath, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (data.isDirectory()) {
                    console.log('-->isDirectory:' + file);
                    var readChildDir = fs.readdirSync(readdirpath);
                    console.log(readChildDir);
                    readFile(readChildDir, readdirpath)
                } else {
                    console.log('-->isNotDirectory:' + file);
                    if (file.indexOf('.js') >= 0 && file.indexOf('.json') < 0) {
                        // 开始混淆代码 
                        console.log('-->Start confusing code:' + file);
                        var cmd = ' javascript-obfuscator ' + readdirpath + ' --config hunxiao.json --output ' + readdirpath;
                        process.exec(cmd, function (error, stdout, stderr) {
                            console.log("error:" + error);
                            console.log("stdout:" + stdout);
                            console.log("stderr:" + stderr);
                        });
                        arr.push(readdirpath)
                    } else {
                        console.log('Non-folder - Non-js code :' + file);
                    }
                }
            }
        })

    } else {
        console.log('-->skip------------');
    }
}