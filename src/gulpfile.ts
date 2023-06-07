var less = require('gulp-less');
var path = require('path');
import gulp from "gulp"
import through from "through2"
const ts = require('gulp-typescript');
const lessPath = "less/*.less";
const tsPath = 'src/*.ts'
const browerTsPath = "src/Brower/*.ts"
const shareCodePath = "src/_share_code_.ts"
const shareCodeInjecterTargets = [
    "src/Brower/renderer.ts",
    "src/Brower/reportRenderer.ts",
]
const tsConfig = {
    lib: [
        "ES6",
        "DOM",
    ],
    target: "es2017",
    module: "commonjs",
    esModuleInterop: true,
}


function lessWatch(cb) {
    gulp.src(lessPath)
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./ptest'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("LESS END")
            cb();
        })
}

function tsWatch(cb) {
    gulp.src(tsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp.dest('./'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("TS END")
            cb();
        })
}

function browerTsWatch(cb) {
    gulp.src(browerTsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp.dest('./Brower/'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("BTS END")
            cb();
        })
}

function shareCodeWatch(cb) {
    gulp.src(shareCodePath)
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            // console.log("SHARE_CODE STEP2 END")
            console.log("SHARE_CODE END")
            cb();
        })
        .pipe(through.obj(function (file, encode, cb1) {
            const shareContentLines: Array<string> = file.contents.toString().split("\n")
            gulp.src(shareCodeInjecterTargets)
                .pipe(through.obj(function (_file, _encode, cb2) {
                    const targetContent: string = _file.contents.toString()
                    const targetContentLines = targetContent.split("\n")
                    const shareCodeStartIndex = targetContentLines.findIndex((line: string) => {
                        return line.includes("SHARE CODE START")
                    }) + 2;
                    const shareCodeEndIndex = targetContentLines.findIndex((line: string) => {
                        return line.includes("SHARE CODE END")
                    }) - 1;
                    // console.log(shareCodeStartIndex, shareCodeEndIndex)
                    // console.log(...shareContentLines)
                    targetContentLines.splice(shareCodeStartIndex, shareCodeEndIndex - shareCodeStartIndex, ...shareContentLines)
                    // console.log(targetContentLines.join("\n"))
                    _file.contents = Buffer.from(targetContentLines.join("\n"));
                    this.push(_file)
                    cb2()
                }))
                .on("end", () => {
                    // console.log("SHARE_CODE STEP1 END")
                    cb1()
                })
                .pipe(gulp.dest('src/Brower/'))
        }))

}

exports.default = function () {
    // You can use a single task
    gulp.watch(lessPath, lessWatch)
    gulp.watch(tsPath, tsWatch)
    gulp.watch(browerTsPath, browerTsWatch)
    gulp.watch(shareCodePath, shareCodeWatch)
    // TODO: 增加 SHARE_CODE 相关执行
};

