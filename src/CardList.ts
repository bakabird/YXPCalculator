import { ACard, CardOrder } from "./Card";

export default class CardList {
    // 卡组
    private _item: ACard[];
    // 已消耗/持续的牌的位置
    private _costed: boolean[]; 
    // 星位
    private _star: boolean[];

    // 下一张牌
    private _curCardIndex: number;
    // 卡牌使用顺序
    private _cardOrder: CardOrder;

    // 空间
    public get size(): number {
        return this._item.length;
    }

    public get cardOrder(): CardOrder {
        return this._cardOrder;
    }

    constructor(item: ACard[]) {
        this._item = item;
        this.reset();
    }

    public reset() {
        this._costed = [];
        this._star = [];
        this._curCardIndex = 0;
        this._cardOrder = CardOrder.L2R;
        for(var i = 0;i < this.size;i ++){
            this._star[i] = i == 2 || i == 5;
            this._costed[i] = false;
        }
    }
    
    public GetCur(): ACard {
        return this._item[this._curCardIndex];
    }
    
    public IsOnStar(): boolean {
        return this._star[this._curCardIndex];
    }

    public SetCardOrder(cardOrder: CardOrder) {
        this._cardOrder = cardOrder;
    }

    public CostCur() {
        this._costed[this._curCardIndex] = true;
    }

    public PosBack() {
        this._ShiftCard(-1);
    }
    
    public PosShift() {
        this._ShiftCard(1);
    }

    // time为负时代表反方向
    private _ShiftCard(time: number) {
        const ajust = (num, size) => {
            if(num >= 0) {
                return num % size;
            } else {
                return ajust(size + num, size);
            }
        }

        var absTime = Math.abs(time);
        var step = (this._cardOrder == CardOrder.L2R ? 1 : -1) * (time > 0 ? 1 : -1);
        var size = this.size;
        while(absTime > 0){
            var cur = this._curCardIndex;
            var sum = step;
            while(this._costed[ajust(cur + sum, size)]) {
                sum += step;
            }
            this._curCardIndex = ajust(cur + sum, size);
            absTime--;
        }
    }

    public toString(): string {
        return this._item.reduce((p,c,i)=> {
            var curMark = i == this._curCardIndex ? ">" : "";
            var costMark = this._costed[i] ? "*" : "";
            return p + ` ${costMark}${curMark}${c.cardName}${c._level}`
        },"");
    }
}
