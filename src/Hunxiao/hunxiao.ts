const relativePath = '..'
const exitFile = [
    'node_modules', 'Hunxiao', "Lib", "Cfgs", 
    "BrowerLibs", "out", ".git",  "src", "img", "img1", "less", "css", "sprite", "tmp", "ui",
    'geneCardPinyin.js', 'gulpfile.js', "jquery.js"]

const fs = require('fs');
import process from 'child_process'
const readDir = fs.readdirSync(relativePath);
const czFile = [];
const filePath = relativePath;
const arr = [];
const concurrency = 5; // 控制同时执行的命令数量

readFile(readDir, filePath);

async function readFile(readDir, filePath) {
    if (readDir.length > 0) {
        for (let i = 0; i < readDir.length; i++) {
            await scannerFile(readDir[i], filePath);
        }
    }
    await executeObfuscator(arr);
    console.log("over");
}

async function scannerFile(file, filePath) {
    if (exitFile.indexOf(file) < 0) {
        const readdirpath = filePath === './' ? filePath + file : filePath + "/" + file;
        const data = await fs.promises.stat(readdirpath);
        if (data.isDirectory()) {
            const readChildDir = fs.readdirSync(readdirpath);
            readFile(readChildDir, readdirpath);
        } else {
            if (file.indexOf('.js') >= 0 && file.indexOf('.json') < 0) {
                arr.push(readdirpath);
                if (arr.length >= concurrency) {
                    await executeObfuscator(arr.splice(0, concurrency));
                }
            } else {
                console.log('Non-folder - Non-js code :' + file);
            }
        }
    } else {
        console.log('-->skip------------');
    }
}

function executeObfuscator(filesToObfuscate) {
    console.log('Executing obfuscator for files:');
    console.log(filesToObfuscate);
    const obfuscationPromises = filesToObfuscate.map((file) => {
        console.log('-->Start confusing code:' + file);
        const cmd = 'javascript-obfuscator ' + file + ' --config hunxiao.json --output ' + file;
        return new Promise<void>((resolve, reject) => {
            process.exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    console.log("error:" + error);
                    reject(error);
                }
                if (stderr !== "") {
                    console.log("stderr:" + stderr);
                }
                console.log("stdout:" + stdout);
                resolve();
            });
        });
    });
    return Promise.all(obfuscationPromises);
}
