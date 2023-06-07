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
const browerTsPath = "src/Brower/*.ts";
const shareCodePath = "src/_share_code_.ts";
const shareCodeInjecterTargets = [
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
};
function lessWatch(cb) {
    gulp_1.default.src(lessPath)
        .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
    }))
        .pipe(gulp_1.default.dest('./ptest'))
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
        .pipe(gulp_1.default.dest('./'))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("TS END");
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
function shareCodeWatch(cb) {
    gulp_1.default.src(shareCodePath)
        .pipe(through2_1.default.obj(function (file, encode, cb1) {
        const shareContentLines = file.contents.toString().split("\n");
        gulp_1.default.src(shareCodeInjecterTargets)
            .pipe(through2_1.default.obj(function (_file, _encode, cb2) {
            const targetContent = _file.contents.toString();
            const targetContentLines = targetContent.split("\n");
            const shareCodeStartIndex = targetContentLines.findIndex((line) => {
                return line.includes("SHARE CODE START");
            }) + 2;
            const shareCodeEndIndex = targetContentLines.findIndex((line) => {
                return line.includes("SHARE CODE END");
            }) - 1;
            // console.log(shareCodeStartIndex, shareCodeEndIndex)
            // console.log(...shareContentLines)
            targetContentLines.splice(shareCodeStartIndex, shareCodeEndIndex - shareCodeStartIndex, ...shareContentLines);
            // console.log(targetContentLines.join("\n"))
            _file.contents = Buffer.from(targetContentLines.join("\n"));
            cb2(null, _file);
        }))
            .pipe(gulp_1.default.dest('./Brower/'))
            .on('error', (e) => {
            console.error(e);
            /* Ignore compiler errors */
        })
            .on("end", () => {
            console.log("SHARE_CODE END");
            cb1();
        });
    }))
        .on('error', (e) => {
        console.error(e);
        /* Ignore compiler errors */
    })
        .on("end", () => {
        console.log("SHARE_CODE END");
        cb();
    });
}
exports.default = function () {
    // You can use a single task
    gulp_1.default.watch(lessPath, lessWatch);
    gulp_1.default.watch(tsPath, tsWatch);
    gulp_1.default.watch(browerTsPath, browerTsWatch);
    gulp_1.default.watch(shareCodePath, shareCodeWatch);
    // TODO: 增加 SHARE_CODE 相关执行
};
