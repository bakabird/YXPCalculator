import { last } from "./ArrUtil";
import { FightConst } from "./FightConst";
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
        const aWin = FightReport.checkWin(a);
        const bWin = FightReport.checkWin(b);
        if(!aWin && !bWin) {
            return last(a.heRoundHp) < last(b.heRoundHp) ? a : b;
        }
        if (!aWin) return b;
        if (!bWin) return a;
        // 都赢了
        if(a.heRoundHp.length == b.heRoundHp.length) {
            return last(a.heRoundHp) < last(b.heRoundHp) ? a : b;
        } else {
            return a.heRoundHp.length < b.heRoundHp.length ? a : b;
        }
    }
    private _firstWin: boolean = false;
    public cutCheck(writingFr: FightReport, best: FightReport): boolean {
        if(best) {
            if(FightReport.checkWin(best)) {
                if(!this._firstWin) {
                    this._firstWin = true;
                }
                if (writingFr.heRoundHp.length > best.heRoundHp.length) {
                    return true;
                }   
            }
        }
        return false;
    }
}