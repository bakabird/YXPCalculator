import { Human } from "./Human";
import { FightReport } from "./FightReport";
import { Round } from "./Round";
import { CardInfo } from "./Card";
import { CardListFactory } from "./CardListFactory";

export type CutCheck = (fr: FightReport)=>boolean

//每场战斗
export class Fight {
    constructor(private _me: Human, private _he: Human) {
    }
    Play(cutCheck: CutCheck): FightReport {
        var index = 0;
        var fightReport = new FightReport();
        var meRoundHp = [this._me.hp];
        var meRoundMaxHp = [this._me.maxHp];
        var heRoundHp = [this._he.hp];
        var heRoundMaxHp = [this._he.maxHp];

        fightReport.meCards = this._me.CardList.cardInfos;
        fightReport.heCards = this._he.CardList.cardInfos;
        fightReport.meRoundHp = meRoundHp;
        fightReport.meRoundMaxHp = meRoundMaxHp;
        fightReport.heRoundHp = heRoundHp;
        fightReport.heRoundMaxHp = heRoundMaxHp;
        fightReport.meUseCard.push([]);

        while (index < 64 && this._me.hp > 0 && this._he.hp > 0) {
            fightReport.apeendLog(`\n：：：第${index + 1}轮：：：`);
            var round = new Round(index, this._me, this._he);
            round.effect(fightReport);
            index++;
            meRoundHp.push(this._me.hp);
            meRoundMaxHp.push(this._me.maxHp);
            heRoundHp.push(this._he.hp);
            heRoundMaxHp.push(this._he.maxHp);
            if (cutCheck(fightReport)) {
                return null;
            }
        }
        return fightReport;
    }

    public static BuildRun(
        me: Human, meCard: Array<CardInfo>,
        he: Human, heCard: Array<CardInfo>,
        cutCheck: CutCheck = ()=>false,
    ): FightReport {
        var meCardList = CardListFactory.me.FormList(meCard)
        var heCardList = CardListFactory.me.FormList(heCard)
        me.Reset();
        he.Reset();
        me.SetCardList(meCardList);
        he.SetCardList(heCardList);
        var fight = new Fight(me, he);
        return fight.Play(cutCheck);
    }

    public static BuildRun2(
        meArg: Array<any>, meCard: Array<CardInfo>,
        heArg: Array<any>, heCard: Array<CardInfo>,
        cutCheck: CutCheck = ()=>false,
    ): FightReport {
        const [meName, meMaxHp, meSpeed] = meArg;
        const [heName, heMaxHp, heSpeed] = heArg;
        return this.BuildRun(
            new Human(meName, meMaxHp, meSpeed), meCard,
            new Human(heName, heMaxHp, heSpeed), heCard,
            cutCheck
        );
    }
}