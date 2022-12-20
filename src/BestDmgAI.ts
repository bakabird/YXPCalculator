import { CardInfo, CardListFactory } from "./Card"
import { FightReport } from "./index"

export type Sumamry = Array<{
    fr: FightReport,
    index: number,
    cards: Array<CardInfo>,
}>

export class BestDmgAI {
    private _baseInfo: Array<CardInfo>;
    private _cur: number;
    private _allPossible: number[][];
    private _allFightReport: FightReport[];
    constructor(private _code: string) {
        this._baseInfo = CardListFactory.me.SplitCode(_code);
        this.reset();
    }
    public reset() {
        var count = this._baseInfo.length - 1;
        var arr = [];
        while(count > -1){
            arr[count] = count--;
        }
        this._allFightReport = [];
        this._allPossible = this._AllPossible(arr, CardListFactory.Size);
        this._cur = 0;
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
    public RecordThenMoveNext(fightReprot: FightReport) {
        this._allFightReport[this._cur] = fightReprot
        this._cur++;
    }
    private _FetchPossibleCardInfo(possibleIndex: number) {
        return this._allPossible[possibleIndex].map(pos => this._baseInfo[pos]);
    }
    public reportSumamry(): Sumamry {    
        var tmp = this._allFightReport.map((fr,index) => ({ fr, index }))
        tmp.sort((a,b)=>{
            var tmp = a.fr.heRoundHp.length - b.fr.heRoundHp.length;
            if(tmp != 0) {
                return tmp;
            } 
            return a.fr.heRoundHp[a.fr.heRoundHp.length - 1] - b.fr.heRoundHp[b.fr.heRoundHp.length - 1];
        });
        var sum: Sumamry = tmp.slice(0, 30).map(obj => ({
                fr: obj.fr,
                index: obj.index,
                cards: this._FetchPossibleCardInfo(obj.index),
            }));
        for(var i = 0;i < 5;i++){
            console.log("TOP " + i);
            console.log(...sum[i].cards.map(info => info.name+info.level));
            console.log(...sum[i].fr.heRoundHp);
        }
        return sum;
    }
}