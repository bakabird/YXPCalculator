import { BES, BuffId } from "./Buff";
import { CardInfo, CardName as C } from "./Card"
import { Human } from "./Human";
import { BestDmgAI, Sumamry } from "./BestDmgAI"
import { Debug } from "./Debug";
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { CardListFactory } from "./CardListFactory";


//每次行动
class Action {
    constructor(private _actor: Human, private _target: Human) {

    }

    public effect() {
        var me = this._actor;
        var he = this._target;

        Debug.debug(`【行动开始】${me.name} ---- ---- ----`)
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
    constructor() {
    }
}

//每场战斗
class Fight {
    constructor(private _me: Human, private _he: Human) {

    }
    Play(): FightReport {
        var index = 0;
        var meRoundHp = [this._me.hp];
        var heRoundHp = [this._he.hp];
        while (index < 64 && this._me.hp > 0 && this._he.hp > 0) {
            var round = new Round(index, this._me, this._he);
            Debug.debug("=== ==== ==== ==== ==== ==== ==== ===");
            Debug.debug(`==== ==== 【【【回合${index + 1}】】】 ==== ====`);
            Debug.debug("=== ==== ==== ==== ==== ==== ==== ===");
            Debug.debug("");
            round.effect();
            index++;
            meRoundHp.push(this._me.hp);
            heRoundHp.push(this._he.hp);
        }
        Debug.debug("--- OVER ---")
        this._me.reportStatu();
        this._he.reportStatu();
        Debug.debug(" meHpLog " + meRoundHp.reduce((p, cur, index, arr) => {
            return p + `[${index}]${cur}` + (index > 0 ? `(${cur - arr[index - 1]}) ` : " ")
        }, ""));
        Debug.debug(" heHpLog " + heRoundHp.reduce((p, cur, index, arr) => {
            return p + `[${index}]${cur}` + (index > 0 ? `(${cur - arr[index - 1]}) ` : " ")
        }, ""));
        Debug.debug("--- OVER ---")

        var fightReport = new FightReport();
        fightReport.meRoundHp = meRoundHp;
        fightReport.heRoundHp = heRoundHp;
        return fightReport;
    }
}

async function ViewSumamry(sumamry: Sumamry) {
    const rl = readline.createInterface({ input, output });
    
    const answer = await new Promise<string>((rso,rje)=> {
        rl.question("要了解第几套卡组?(输入X退出)", (answer)=>{
            rso(answer);
        });
    }) 
    rl.close();
    if (answer == "X") {
        process.exit();
    } else {
        var index = parseInt(answer);
        var item = sumamry[index];
        Play(me, item.cards, he, heCardInfos);
        ViewSumamry(sumamry);
    }
}

function Play(
    me: Human, meCard: Array<CardInfo>,
    he: Human, heCard: Array<CardInfo>,
) {
    var meCardList = CardListFactory.me.FormList(meCard)
    var heCardList = CardListFactory.me.FormList(heCard)
    me.Reset();
    he.Reset();
    me.SetCardList(meCardList);
    he.SetCardList(heCardList);
    var fight = new Fight(me, he);
    return fight.Play();
}


var heCardInfos = CardListFactory.me.SplitCode("");
var meCardCode = "断肠 2 杯弓 1 飞踏 1 同心 1 杯弓 1 杯弓 1 黄雀 1";
var ai = new BestDmgAI(meCardCode);
var meCardInfos = ai.Fetch()
var me: Human = new Human("大雄", 110, 50);
var he: Human = new Human("胖虎", 110, 0);
Debug.debugLevel = 1;
while (meCardInfos) {
    var fr = Play(me, meCardInfos, he, heCardInfos);
    ai.RecordThenMoveNext(fr);
    meCardInfos = ai.Fetch();
}
Debug.debugLevel = 0;
ViewSumamry(ai.reportSumamry());


