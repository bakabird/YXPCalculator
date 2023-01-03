import { CardInfo } from "./Card"
import { CardListFactory } from "./CardListFactory";
import { FightReport } from "./FightReport";
import { Sumamry } from "./Sumamry";

export class BestDmgAI {
    private _baseInfo: Array<CardInfo>;
    private _cur: number;
    private _allPossible: number[][];
    private _bestFightReport: FightReport;
    private _cutCount: number;
    public get best(): FightReport {
        return this._bestFightReport;
    }
    public get cutCount(): number {
        return this._cutCount;
    }
    constructor(private _code: string) {
        this._baseInfo = CardListFactory.me.SplitCode(_code);
        var count = this._baseInfo.length - 1;
        var arr = [];
        while(count > -1){
            arr[count] = count--;
        }
        this._bestFightReport = null;
        this._allPossible = this._AllPossible(arr, CardListFactory.Size);
        this._cur = 0;
        this._cutCount = 0;
    }
    private _AllPossible(arr: number[],pos: number): number[][] {
        var ret:number[][] = [];
        for(var i = 0; i< arr.length;i++){
            var fixed = arr[i];
            if(arr.length > 1 && pos > 1) {
                var other = arr.filter((c,idx)=>idx!=i);    
                this._AllPossible(other, pos - 1).forEach(arr => {
                    ret.push([fixed, ...arr]);    
                })
            } else {
                ret.push([fixed]);
            }
        }   
        return ret;
    }
    public Fetch(): CardInfo[] {
        if(this._cur > this._allPossible.length - 1) {
            return null
        } else {
            return this._FetchPossibleCardInfo(this._cur);
        }
    }
    public CutCheck(fightReport: FightReport) {
        if(this._bestFightReport) {
            if (fightReport.heRoundHp.length > this._bestFightReport.heRoundHp.length) {
                this._cutCount++;
                return true;
            }
        }
        return false;
    }
    public RecordThenMoveNext(fightReprot: FightReport) {
        const best = this._bestFightReport;
        const now = fightReprot;
        if(now) {
            if (best) {
                if(best.heRoundHp.length > now.heRoundHp.length) {
                    this._bestFightReport = now;
                }  else if(best.heRoundHp.length == now.heRoundHp.length) {
                    if(best.heRoundHp[best.heRoundHp.length - 1] > now.heRoundHp[now.heRoundHp.length - 1]) {
                        this._bestFightReport = now;
                    }
                }
            } else {
                this._bestFightReport = now;
            }
        }
        this._cur++;
    }
    private _FetchPossibleCardInfo(possibleIndex: number) {
        return this._allPossible[possibleIndex].map(pos => this._baseInfo[pos]);
    }
}