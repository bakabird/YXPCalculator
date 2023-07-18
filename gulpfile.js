"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var less = require('gulp-less');
var path = require('path');
const gulp_1 = __importDefault(require("gulp"));
const through2_1 = __importDefault(require("through2"));
const ts = require('gulp-typescript');
const lessPath = "less/*.less";
const tsPath = 'src/*.ts';
const tsHomePath = 'src/Home/*.ts';
const browerTsPath = "src/Brower/*.ts";
const hunxiaoTsPath = "src/Hunxiao/*.ts";
const shareCodePath = "src/_share_code_.ts";
const shareCode2Path = "src/_share_code2_.ts";
const _shareCodeInjecterTargets = [
    "src/Brower/renderer.ts",
    "src/Brower/reportRenderer.ts",
];
const tsConfig = {
    lib: [
        "ES6",
        "DOM",
    ],
    target: "es2017",
    module: "commonjs",
    esModuleInterop: true,
    experimentalDecorators: true,
};
function lessWatch(cb) {
    gulp_1.default.src(lessPath)
        .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
    }))
        .pipe(gulp_1.default.dest('./css'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("LESS END");
        cb();
    });
}
function tsWatch(cb) {
    gulp_1.default.src(tsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp_1.default.dest('./Main/'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("TS END");
        cb();
    });
}
function tsHomeWatch(cb) {
    gulp_1.default.src(tsHomePath)
        .pipe(ts(tsConfig))
        .pipe(gulp_1.default.dest('./'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("HOME-TS END");
        cb();
    });
}
function browerTsWatch(cb) {
    gulp_1.default.src(browerTsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp_1.default.dest('./Brower/'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("BTS END");
        cb();
    });
}
function hunxiaoTsWatch(cb) {
    gulp_1.default.src(hunxiaoTsPath)
        .pipe(ts(tsConfig))
        .pipe(gulp_1.default.dest('./Hunxiao/'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("HTS END");
        cb();
    });
}
function produceShareCodeWatchFunc(shareCodePath, shareCodeInjecterTargets, startMark, endMark) {
    return (cb) => {
        shareCodeWatch(cb, shareCodePath, shareCodeInjecterTargets, startMark, endMark);
    };
}
function shareCodeWatch(cb, shareCodePath, shareCodeInjecterTargets, startMark, endMark) {
    gulp_1.default.src(shareCodePath)
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        // console.log("SHARE_CODE STEP2 END")
        console.log("SHARE_CODE END");
        cb();
    })
        .pipe(through2_1.default.obj(function (file, encode, cb1) {
        const shareContentLines = file.contents.toString().split("\n");
        gulp_1.default.src(shareCodeInjecterTargets)
            .pipe(through2_1.default.obj(function (_file, _encode, cb2) {
            const targetContent = _file.contents.toString();
            const targetContentLines = targetContent.split("\n");
            const shareCodeStartIndex = targetContentLines.findIndex((line) => {
                return line.includes(startMark);
            }) + 2;
            const shareCodeEndIndex = targetContentLines.findIndex((line) => {
                return line.includes(endMark);
            }) - 1;
            // console.log(shareCodeStartIndex, shareCodeEndIndex)
            // console.log(...shareContentLines)
            targetContentLines.splice(shareCodeStartIndex, shareCodeEndIndex - shareCodeStartIndex, ...shareContentLines);
            // console.log(targetContentLines.join("\n"))
            _file.contents = Buffer.from(targetContentLines.join("\n"));
            this.push(_file);
            cb2();
        }))
            .on("end", () => {
            // console.log("SHARE_CODE STEP1 END")
            cb1();
        })
            .pipe(gulp_1.default.dest('src/Brower/'));
    }));
}
exports.default = function (done) {
    // You can use a single task
    gulp_1.default.watch(lessPath, lessWatch);
    gulp_1.default.watch(tsPath, tsWatch);
    gulp_1.default.watch(tsHomePath, tsHomeWatch);
    gulp_1.default.watch(browerTsPath, browerTsWatch);
    gulp_1.default.watch(hunxiaoTsPath, hunxiaoTsWatch);
    gulp_1.default.watch(shareCodePath, produceShareCodeWatchFunc(shareCodePath, _shareCodeInjecterTargets, "SHARE CODE START", "SHARE CODE END"));
    gulp_1.default.watch(shareCode2Path, produceShareCodeWatchFunc(shareCode2Path, _shareCodeInjecterTargets, "SHARE CODE2 START", "SHARE CODE2 END"));
    done();
};
