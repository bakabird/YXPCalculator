var less = require('gulp-less');
var path = require('path');
import gulp from "gulp"
import through from "through2"
const ts = require('gulp-typescript');
const lessPath = "less/*.less";
const tsPath = 'src/*.ts'
const tsHomePath = 'src/Home/*.ts'
const browerTsPath = "src/Brower/*.ts"
const hunxiaoTsPath = "src/Hunxiao/*.ts"
const shareCodePath = "src/_share_code_.ts"
const shareCode2Path = "src/_share_code2_.ts"
const _shareCodeInjecterTargets = [
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
    experimentalDecorators: true,
    resolveJsonModule: true
}


function lessWatch(cb) {
    gulp.src(lessPath)
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./css'))
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
        .pipe(gulp.dest('./Main/'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("TS END")
            cb();
        })
}

function tsHomeWatch(cb) {
    gulp.src(tsHomePath)
        .pipe(ts(tsConfig))
        .pipe(gulp.dest('./'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("HOME-TS END")
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

function hunxiaoTsWatch(cb) {
    gulp.src(hunxiaoTsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp.dest('./Hunxiao/'))
        .on('error', (e) => {
            console.error(e)
            /* Ignore compiler errors */
        })
        .on("end", () => {
            console.log("HTS END")
            cb();
        })
}

function produceShareCodeWatchFunc(shareCodePath: string, shareCodeInjecterTargets: string[], startMark: string, endMark: string) {
    return (cb) => {
        shareCodeWatch(cb, shareCodePath, shareCodeInjecterTargets, startMark, endMark)
    }
}

function shareCodeWatch(cb, shareCodePath: string, shareCodeInjecterTargets: string[], startMark: string, endMark: string) {
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
                        return line.includes(startMark)
                    }) + 2;
                    const shareCodeEndIndex = targetContentLines.findIndex((line: string) => {
                        return line.includes(endMark)
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

exports.default = function (done) {
    const theShareCodeWatch = produceShareCodeWatchFunc(shareCodePath, _shareCodeInjecterTargets, "SHARE CODE START", "SHARE CODE END");
    const theShareCode2Watch = produceShareCodeWatchFunc(shareCode2Path, _shareCodeInjecterTargets, "SHARE CODE2 START", "SHARE CODE2 END");
    // You can use a single task
    gulp.watch(lessPath, lessWatch)
    gulp.watch(tsPath, tsWatch)
    gulp.watch(tsHomePath, tsHomeWatch)
    gulp.watch(browerTsPath, browerTsWatch)
    gulp.watch(hunxiaoTsPath, hunxiaoTsWatch)
    gulp.watch(shareCodePath, theShareCodeWatch)
    gulp.watch(shareCode2Path, theShareCode2Watch)
    done()
};

exports.build = function (done) {
    const theShareCodeWatch = produceShareCodeWatchFunc(shareCodePath, _shareCodeInjecterTargets, "SHARE CODE START", "SHARE CODE END");
    const theShareCode2Watch = produceShareCodeWatchFunc(shareCode2Path, _shareCodeInjecterTargets, "SHARE CODE2 START", "SHARE CODE2 END");
    console.log("--- INIT JOB START");
    lessWatch(()=>{
        theShareCodeWatch(()=>{
            theShareCode2Watch(()=>{
                hunxiaoTsWatch(()=>{
                    tsHomeWatch(()=>{
                        tsWatch(()=>{
                            browerTsWatch(()=>{
                                console.log("--- INIT JOB FINISHED");
                                done();
                            })
                        })
                    })
                })
            })
        })
    })
}

