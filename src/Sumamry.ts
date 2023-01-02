import { CardInfo } from "./Card";
import { FightReport } from "./FightReport";



export class Sumamry {
    public cur: {
        fr: FightReport;
        card: Array<CardInfo>;
    };
    public dmgAI: Array<{
        fr: FightReport;
        index: number;
        cards: Array<CardInfo>;
    }>;
};
