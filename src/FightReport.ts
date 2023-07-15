import { last } from "./ArrUtil";
import { CardInfo, CardName } from "./Card";
import { FightConst } from "./FightConst";
import LogEncode from "./LogEncode";
import { Role } from "./_share_code_";

export type FROption = {
    hpChg: boolean;
    buffChg: boolean;
    cardUseLog: boolean;
    meCardUse: boolean;
    heCardUse: boolean;
}

export class FightReport {
    public meRole: Role;
    public heRole: Role;
    public meCards: CardInfo[];
    public heCards: CardInfo[];
    public meUseCard: CardName[][];
    public meRoundHp: number[];
    public meRoundMaxHp: number[];
    public heUseCard: CardName[][];
    public heRoundHp: number[];
    public heRoundMaxHp: number[];
    public log: string;
    public appendMeUse(cardName: CardName) {
        this.meUseCard[this.meUseCard.length - 1].push(cardName);
    }
    public appendHeUse(cardName: CardName) {
        this.heUseCard[this.heUseCard.length - 1].push(cardName);
    }
    public apeendLog(log: string) {
        if (log.includes(LogEncode.Ignore)) return;
        this.log += log + "\n";
    }
    constructor(meRole: Role, heRole: Role) {
        this.meRole = meRole;
        this.heRole = heRole;
        this.meCards = [];
        this.heCards = [];
        this.meUseCard = [];
        this.meRoundHp = [];
        this.meRoundMaxHp = [];
        this.heUseCard = [];
        this.heRoundHp = [];
        this.heRoundMaxHp = [];
        this.log = "";
    }
    public static checkWin(fr: FightReport): boolean {
        if (last(fr.meRoundHp) <= 0) return false;
        if (fr.meRoundHp.length == FightConst.MAX_ROUND
            && last(fr.meRoundHp) <= last(fr.heRoundHp)) return false;
        return true;
    }
}
