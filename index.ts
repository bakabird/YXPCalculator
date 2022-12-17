import { BES, BuffFactory, BuffId } from "./Buff";
import { CardListFactory, CardName as C } from "./Card"
import { Human } from "./Human";

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
        
        console.log(`【行动开始】${me.name}`)
        me.EffectBuff(BES.RoundStart);
        me.EffectCard(he);
        if (me.CheckBuff(BuffId.MoveAgain, 1)) {
            me.EffectCard(he);
        }
        me.RemoveBuff(BuffId.MoveAgain);
        console.log(`【行动结束】----- ----- ----- -----`)
        console.log("")
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

//每场战斗
class Fight {
    constructor(private _me: Human, private _he: Human) {

    }
    Play() {
        var index = 0;
        while (index < 64 && this._me.hp > 0 && this._he.hp > 0) {
            var round = new Round(index, this._me, this._he);
            console.log("=== ==== ==== ==== ==== ==== ==== ===");
            console.log(`==== ==== 【【【回合${index + 1}】】】 ==== ====`);
            console.log("=== ==== ==== ==== ==== ==== ==== ===");
            console.log("");
            round.effect();
            index++;
        }
        console.log("--- OVER ---")
        console.log("--- OVER ---")
        console.log("--- OVER ---")
    }
}

function Play(
    meName, meMaxHp, meSpeed, meCCode,
    heName, heMaxHp, heSpeed, heCCode, 
) {
    var cardFactory = new CardListFactory();
    var heCard = cardFactory.Pipe(...heCCode);
    var meCard = cardFactory.Pipe(...meCCode);
    var me = new Human(meName, meMaxHp, meSpeed);
    var he = new Human(heName, heMaxHp, heSpeed);
    var fight = new Fight(me, he);
    me.SetCardList(meCard);
    he.SetCardList(heCard);
    fight.Play();
}


var heCardCode = [];
var meCardCode = [
    C.DCTune, 2, C.BeiGong, 1, C.FeiTa, 2, C.TongXin, 2, 
    C.MeiKai, 2, C.BeiGong, 2, C.HuangQue, 1];
//断肠2 杯弓1 飞踏2 同心2 梅开2 杯弓2 黄雀1 普攻
Play("大熊", 110, 50, meCardCode,
    "胖虎", 110, 0, heCardCode);

// Play("大熊", 110, 50, meCardCode,
//     "小助", 110, 100, heCardCode);

