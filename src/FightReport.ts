import { CardInfo, CardName } from "./Card";

export type FROption = {
    hpChg: boolean; 
    buffChg: boolean;
    cardUseLog: boolean;
    cardUse: boolean; 
}

export class FightReport {
    public meCards: CardInfo[];
    public heCards: CardInfo[];
    public meUseCard: CardName[][];
    public meRoundHp: number[];
    public meRoundMaxHp: number[];
    public heRoundHp: number[];
    public heRoundMaxHp: number[];
    public log: string;
    public appendUse(cardName: CardName) {
        this.meUseCard[this.meUseCard.length - 1].push(cardName);
    }
    public apeendLog(log:string) {
        this.log += log + "\n";
    }
    constructor() {
        this.meCards = [];
        this.heCards = [];
        this.meUseCard = [];
        this.meRoundHp = [];
        this.meRoundMaxHp = [];
        this.heRoundHp = [];
        this.heRoundMaxHp = [];
        this.log = "";
    }
}
