import { FightReport } from "./FightReport";
import { IBestAI } from "./IBestAI";

export class BestDmgAI implements IBestAI {
    private static _me: BestDmgAI;
    public static get me(): BestDmgAI {
        if(!this._me) this._me = new BestDmgAI();
        return this._me;
    }
    private constructor() {}
    public compare(a: FightReport, b: FightReport): FightReport {
        if(!a) return b;
        if(!b) return a;
        if(a.heRoundHp.length > b.heRoundHp.length) {
            return b;
        }  else if(a.heRoundHp.length == b.heRoundHp.length) {
            if(a.heRoundHp[a.heRoundHp.length - 1] > b.heRoundHp[b.heRoundHp.length - 1]) {
                return b;
            } else {
                return a;
            }
        } else {
            return a;
        }
    }
    public cutCheck(writingFr: FightReport, best: FightReport): boolean {
        if(best) {
            if (writingFr.heRoundHp.length > best.heRoundHp.length) {
                return true;
            }
        }
        return false;
    }
}