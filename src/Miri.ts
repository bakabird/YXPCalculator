import { BES, BuffId } from "./Buff";
import { CardInfo, CardName as C } from "./Card"
import { Human } from "./Human";
import { BestDmgAI } from "./BestDmgAI"
import { CardListFactory } from "./CardListFactory";
import { FightReport } from "./FightReport";
import { Sumamry } from "./Sumamry";


//每次行动
class Action {
    constructor(private _actor: Human, private _target: Human) {

    }

    public effect() {
        var me = this._actor;
        var he = this._target;
        
        if(me.hp <= 0) return;
        me.EffectBuff(BES.RoundStart);
        me.EffectCard(he);
        if (me.CheckBuff(BuffId.MoveAgain, 1)) {
            me.EffectCard(he);
        }
        me.RemoveBuff(BuffId.MoveAgain, "再动结束");
    }
}

//每一轮
class Round {
    constructor(private _index: number, private _me: Human, private _he: Human) {
    }
    effect(fr: FightReport) {
        fr.meUseCard.push([]);
        var meAct = new Action(this._me, this._he);
        var heAct = new Action(this._he, this._me);
        this._me.connectReport(fr, { 
            cardUse: true, hpChg: true, buffChg: true, cardUseLog: true});
        this._he.connectReport(fr, { 
            cardUse: false, hpChg: true, buffChg: true, cardUseLog: true });
        if (this._me.speed > this._he.speed) {
            meAct.effect();
            fr.apeendLog(`--- --- ---`)
            heAct.effect();
        } else {
            heAct.effect();
            fr.apeendLog(`--- --- ---`)
            meAct.effect();
        }
        this._me.disconnectReport();
        this._he.disconnectReport();
    }
}


//每场战斗
class Fight {
    constructor(private _me: Human, private _he: Human) {

    }
    Play(): FightReport {
        var index = 0;
        var fightReport = new FightReport();
        var meRoundHp = [this._me.hp];
        var meRoundMaxHp = [this._me.maxHp];
        var heRoundHp = [this._he.hp];
        var heRoundMaxHp = [this._he.maxHp];
        fightReport.meUseCard.push([]);
        while (index < 64 && this._me.hp > 0 && this._he.hp > 0) {
            fightReport.apeendLog(`\n：：：第${index+1}轮：：：`)
            var round = new Round(index, this._me, this._he);
            round.effect(fightReport);
            index++;
            meRoundHp.push(this._me.hp);
            meRoundMaxHp.push(this._me.maxHp);
            heRoundHp.push(this._he.hp);
            heRoundMaxHp.push(this._he.maxHp);
        }
        fightReport.meRoundHp = meRoundHp;
        fightReport.meRoundMaxHp = meRoundMaxHp;
        fightReport.heRoundHp = heRoundHp;
        fightReport.heRoundMaxHp = heRoundMaxHp;
        return fightReport;
    }
}

export class Miri {
    private _onMsg: (msgType: string, msgData: any)=>void;
    constructor(public cardCode: string) {
        
    }

    private _play(
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

    public onmessage(onMsg: (msgType: string, msgData: any)=>void) {
        this._onMsg = onMsg;
    }

    public Go() {
        var heCardInfos = CardListFactory.me.SplitCode("");
        var sum: Sumamry = new Sumamry();
        var he: Human = new Human("胖虎", 110, 0);
        var me: Human = new Human("大雄", 110, 50);
        var meCardInfos = CardListFactory.me.SplitCode(this.cardCode);
        var dmgAI = new BestDmgAI(this.cardCode);
        sum.cur = {
            fr: this._play(me, meCardInfos, he, heCardInfos),
            card: meCardInfos
        };
        meCardInfos = dmgAI.Fetch()
        while (meCardInfos) {
            var fr = this._play(me, meCardInfos, he, heCardInfos);
            dmgAI.RecordThenMoveNext(fr);
            meCardInfos = dmgAI.Fetch();
        }
        dmgAI.reportSumamry(sum)
        this._onMsg("process-over", sum);
    }
}



