import { Human } from "./Human";
import { FightReport } from "./FightReport";
import { Round } from "./Round";
import { CardInfo } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { FightConst } from "./FightConst";
require = require("esm")(module);
const gnfun = require("gnfun")
import { Role } from "./_share_code_";

export type CutCheck = (fr: FightReport) => boolean

//每场战斗
export class Fight {
    constructor(private _me: Human, private _he: Human) {
        _me.SetFight(this);
        _he.SetFight(this);
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


        fightReport.apeendLog(`${this._me.name}|${gnfun.getEnumName(Role, this._me.role)} VS ${this._he.name}|${gnfun.getEnumName(Role, this._he.role)}`);
        while (index < FightConst.MAX_ROUND && !this._me.isDead && !this._he.isDead) {
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

    public GetAnother(me: Human): Human {
        if (me == this._me) return this._he
        else return this._me;
    }

    public static BuildRun(
        me: Human, meCard: Array<CardInfo>,
        he: Human, heCard: Array<CardInfo>,
        cutCheck: CutCheck = () => false,
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
        cutCheck: CutCheck = () => false,
    ): FightReport {
        const [meName, meMaxHp, meSpeed, meRole] = meArg;
        const [heName, heMaxHp, heSpeed, heRole] = heArg;
        return this.BuildRun(
            new Human(meName, meMaxHp, meSpeed, meRole), meCard,
            new Human(heName, heMaxHp, heSpeed, heRole), heCard,
            cutCheck
        );
    }
}
