require = require("esm")(module);
const { enumValues } = require("gnfun");
// @ts-ignore
import { CardName } from "./Main/Card";
import http from "http";
import fs from "fs-extra";

const overwrite = {
    // [CardName.WuXing_tiansuijue]: "wxtsj",
} 

function Pinyin(name: String) {
    return new Promise<string>((rso, rje)=>{
        http.get("http://127.0.0.1:48888/" + name,(res)=>{
            res.setEncoding("utf-8");
            let data = ""
            res.on("data",(chunk)=>{
                data += chunk;
            })
            res.on("end",()=>{
                console.log(data);
                rso(data);
            })
        }).on("error",(e)=>{
            console.error(`Error: ${e.message}`);
            rje(e.message);
        })
    })
}


async function Main() {
    const result = {};
    const names = enumValues(CardName, "string");
    for (let index = 0; index < names.length; index++) {
        let name: string = names[index];
        console.log(name);
        if(overwrite[name]) { 
            result[name] = overwrite[name];
        } else {
            const pinyin = await Pinyin(name.replace("五行", "五兴"));
            result[name] = pinyin;
        }
    }
    const resultStr = JSON.stringify(result, undefined, 4);
    fs.writeFileSync("./Lib/CardPinyin.json", resultStr);
    return true;
}

Main();