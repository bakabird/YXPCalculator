import { CardInfo } from "./Card";
import { CardListFactory } from "./CardListFactory";

//提供可能的牌组组合
export default class PossibleCardSet {
    private _baseInfo: Array<CardInfo>;
    private _allPossible: number[][];
    public _cur: number;
    public get cur(): number {
        return this._cur;
    }
    constructor(private _code: string) {
        this._baseInfo = CardListFactory.me.SplitCode(_code);
        var count = this._baseInfo.length - 1;
        var arr = [];
        while(count > -1){
            arr[count] = count--;
        }
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
    public MoveNext() {
        this._cur++;
    }
    private _FetchPossibleCardInfo(possibleIndex: number) {
        return this._allPossible[possibleIndex].map(pos => this._baseInfo[pos]);
    }
}