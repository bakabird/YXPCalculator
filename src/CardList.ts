import { ACard, CardInfo, CardOrder } from "./Card";

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

    public get curCardIndex(): number {
        return this._curCardIndex;
    }

    public get cardInfos(): Array<CardInfo> {
        return this._item.map(i => {
            return {
                name: i.cardName,
                level: i.initLevel,
            }
        })
    }

    public get numOfWuxing(): number {
        const note = new Array(5).fill(false);
        this._item.forEach((c) => {
            if (c.isJin) note[0] = true;
            if (c.isMu) note[1] = true;
            if (c.isShui) note[2] = true;
            if (c.isHuo) note[3] = true;
            if (c.isTu) note[4] = true;
        })
        return note.filter(i => i).length;
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
        for (var i = 0; i < this.size; i++) {
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

    /**
     * @return {boolean} is the pos already a star
     */
    public MakeStar(posOffsetCur: number): boolean {
        const pos = this._PosAjust(this._curCardIndex + posOffsetCur, this.size);
        if (this._star[pos]) {
            return true;
        } else {
            this._star[pos] = true;
            return false;
        }
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

    public EachCardsL2R(walk: (card: ACard) => void) {
        this._item.forEach(walk);
    }

    public EachCardsR2L(walk: (card: ACard) => void) {
        for (let index = this._item.length - 1; index > -1; index--) {
            walk(this._item[index]);
        }
    }

    private _PosAjust(num: number, size: number): number {
        if (num >= 0) {
            return num % size;
        } else {
            return this._PosAjust(size + num, size);
        }
    }

    // time为负时代表反方向
    private _ShiftCard(time: number) {
        var absTime = Math.abs(time);
        var step = (this._cardOrder == CardOrder.L2R ? 1 : -1) * (time > 0 ? 1 : -1);
        var size = this.size;
        while (absTime > 0) {
            var cur = this._curCardIndex;
            var sum = step;
            while (this._costed[this._PosAjust(cur + sum, size)]) {
                sum += step;
            }
            this._curCardIndex = this._PosAjust(cur + sum, size);
            absTime--;
        }
    }

    public toString(): string {
        return this._item.reduce((p, c, i) => {
            var curMark = i == this._curCardIndex ? ">" : "";
            var costMark = this._costed[i] ? "*" : "";
            return p + ` ${costMark}${curMark}${c.cardName}${c.initLevel}`
        }, "");
    }
}
