import { BES, BuffId } from "./Buff";
import { CardListFactory, CardName as C } from "./Card"
import { Human } from "./Human";
import { BestDmgAI } from "./BestDmgAI"

var fs = require('fs')
var util = require('util')
 
var logPath = 'fight.log'
var logFile = fs.createWriteStream(logPath, { flags: 'w' })
 
console.log = function() {
  logFile.write(util.format.apply(null, arguments) + '\n')
  process.stdout.write(util.format.apply(null, arguments) + '\n')
}
 
console.error = function() {
  logFile.write(util.format.apply(null, arguments) + '\n')
  process.stderr.write(util.format.apply(null, arguments) + '\n')
}



//每次行动
class Action {
    constructor(private _actor: Human, private _target: Human) {

    }

    public effect() {
        var me = this._actor;
        var he = this._target;
        
        // console.log(`【行动开始】${me.name} ---- ---- ----`)
        me.EffectBuff(BES.RoundStart);
        me.EffectCard(he);
        if (me.CheckBuff(BuffId.MoveAgain, 1)) {
            me.EffectCard(he);
        }
        me.RemoveBuff(BuffId.MoveAgain);
    }
}

//每一轮
class Round {
    constructor(private _index: number, private _me: Human, private _he: Human) {
    }
    effect() {
        var meAct = new Action(this._me, this._he);
        var heAct = new Action(this._he, this._me);
        if (this._me.speed > this._he.speed) {
            this.reportHumanStatu();
            meAct.effect();
            this.reportHumanStatu();
            heAct.effect();
        } else {
            this.reportHumanStatu();
            heAct.effect();
            this.reportHumanStatu();
            meAct.effect();
        }
    }
    reportHumanStatu() {
        this._me.reportStatu();
        this._he.reportStatu();
    }
}

export class FightReport {
    public meRoundHp: number[];
    public heRoundHp: number[];
    constructor(){
    }
}

//每场战斗
class Fight {
    constructor(private _me: Human, private _he: Human) {

    }
    Play() : FightReport {
        var index = 0;
        var meRoundHp = [this._me.hp];
        var heRoundHp = [this._he.hp];
        while (index < 64 && this._me.hp > 0 && this._he.hp > 0) {
            var round = new Round(index, this._me, this._he);
            // console.log("=== ==== ==== ==== ==== ==== ==== ===");
            // console.log(`==== ==== 【【【回合${index + 1}】】】 ==== ====`);
            // console.log("=== ==== ==== ==== ==== ==== ==== ===");
            // console.log("");
            round.effect();
            index++;
            meRoundHp.push(this._me.hp);
            heRoundHp.push(this._he.hp);
        }
        // console.log("--- OVER ---")
        this._me.reportStatu();
        this._he.reportStatu();
        // console.log(" meHpLog " + meRoundHp.reduce((p,cur, index, arr) => {
        //     return p + `[${index}]${cur}` + (index > 0 ? `(${cur - arr[index - 1]}) `: " ")
        // },""));
        // console.log(" heHpLog " + heRoundHp.reduce((p,cur, index, arr) => {
        //     return p + `[${index}]${cur}` + (index > 0 ? `(${cur - arr[index - 1]}) `: " ")
        // },""));
        // console.log("--- OVER ---")
        
        var fightReport = new FightReport();
        fightReport.meRoundHp = meRoundHp;
        fightReport.heRoundHp = heRoundHp;
        return fightReport;
    }
}

function Play(
    meName, meMaxHp, meSpeed, meCCode,
    heName, heMaxHp, heSpeed, heCCode, 
) {
    var meCard = CardListFactory.me.FormList(meCCode)
    var me = new Human(meName, meMaxHp, meSpeed);
    var heCard = CardListFactory.me.FormList(heCCode)
    var he = new Human(heName, heMaxHp, heSpeed);
    var fight = new Fight(me, he);
    me.SetCardList(meCard);
    he.SetCardList(heCard);
    return fight.Play();
}

var heCardInfos = CardListFactory.me.SplitCode("");
var meCardCode = "断肠 2 杯弓 1 飞踏 2 同心 2 梅开 2 杯弓 2 黄雀 1";
var ai = new BestDmgAI(meCardCode);
var meCardInfos = ai.Fetch()
while(meCardInfos){
    var fr = Play("大熊", 110, 50, meCardInfos,
    "胖虎", 110, 0, heCardInfos);
    ai.Record(fr);
    meCardInfos = ai.Fetch();
    ai.reportOnHolding();
}
ai.reportSumamry();




// Play("大熊", 110, 50, meCardCode,
//     "小助", 110, 100, heCardCode);

