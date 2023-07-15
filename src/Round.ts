import { Human } from "./Human";
import { FightReport } from "./FightReport";
import { Action } from "./Action";

//每一轮

export class Round {
    constructor(private _index: number, private _me: Human, private _he: Human) {
    }
    effect(fr: FightReport) {
        fr.meUseCard.push([]);
        fr.heUseCard.push([]);
        var meAct = new Action(this._me, this._he);
        var heAct = new Action(this._he, this._me);
        this._me.connectReport(fr, {
            heCardUse: false, meCardUse: true, hpChg: true, buffChg: true, cardUseLog: true
        });
        this._he.connectReport(fr, {
            heCardUse: true, meCardUse: false, hpChg: true, buffChg: true, cardUseLog: true
        });
        if (this._me.speed > this._he.speed) {
            meAct.effect();
            fr.apeendLog(`--- --- ---`);
            heAct.effect();
        } else {
            heAct.effect();
            fr.apeendLog(`--- --- ---`);
            meAct.effect();
        }
        this._me.disconnectReport();
        this._he.disconnectReport();
    }
}
