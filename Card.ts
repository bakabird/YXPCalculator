import { ABuff, BuffFactory, BuffId, DCBuff, ManaBuff, PosionBuff } from "./Buff";
import { Human } from "./Human"

//#region CARD

export enum CardName {
    Hit = "普攻",
    DCTune = "断肠",
    BeiGong = "杯弓",
    FeiTa = "飞踏",
    TongXin = "同心",
    MeiKai = "梅开",
    HuangQue = "黄雀",
}

export enum CardOrder {
    L2R,
    R2L,
}

export enum CardLevel {
    Normal = 1,
    Rare = 2,
    Legend = 3,
}

export abstract class ACard {
    abstract cardName: CardName;
    _level: CardLevel;
    _useNum: number;
    public get mana(): number {
        return this.onGetMana();
    }
    init(level: CardLevel) {
        this._level = level;
        this._useNum = 0;
    };
    public effect(me:Human, he: Human) {
        this._useNum++;
        console.log(`【卡牌使用】${me.name} 使用 ${this.cardName}`)
        this.onEffect(me, he);
    }
    protected onGetMana(): number {
        return 0;
    }
    protected abstract onEffect(me: Human, he: Human);
    protected _lvlVal<T>(normal: T, rare: T, legend: T): T  {
        switch(this._level) {
            case CardLevel.Normal:
                return normal;
            case CardLevel.Rare:
                return rare;
            case CardLevel.Legend:
                return legend;
        }
    }
    protected _lvlMethod(normal: Function, rare: Function, legend: Function)  {
        switch(this._level) {
            case CardLevel.Normal:
                normal();
                break;
            case CardLevel.Rare:
                rare();
                break;
            case CardLevel.Legend:
                legend();
                break;
        }
    }
}

class HitCard extends ACard {
    cardName: CardName = CardName.Hit;
    onEffect(me: Human, he: Human) {
        he.CutHp(3, "普攻");
    }
}

class DCTuneCard extends ACard {
    cardName: CardName = CardName.DCTune;
    onEffect(me: Human, he: Human) {
        var meBuff = new DCBuff();
        var heBuff = new DCBuff();
        var val = this._lvlVal(1,2,3);
        meBuff.init(me, val);
        heBuff.init(he, val);
        me.AddBuff(meBuff);
        he.AddBuff(heBuff);
    }    
}

class BeiGongCard extends ACard {
    cardName: CardName = CardName.BeiGong;
    onEffect(me: Human, he: Human) {
        var posionBuff = new PosionBuff();
        posionBuff.init(he, this._lvlVal(2, 3, 4));
        he.AddBuff(posionBuff);
        var buff = he.GetBuff(BuffId.Posion);
        he.CutHp(buff.num, "杯弓");
    }
}

class FeiTaCard extends ACard {
    cardName: CardName = CardName.FeiTa;
    protected onEffect(me: Human, he: Human) {
        var buff = new ManaBuff();
        buff.init(me, this._lvlVal(3,3,4));
        me.AddBuff(buff);
        this._lvlMethod(()=>{
            if(this._useNum > 1) {
                me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
            }
        }, ()=>{
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
        }, ()=>{
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
        })
    }
}

class TongXinCard extends ACard {
    cardName: CardName = CardName.TongXin; 
    protected onEffect(me: Human, he: Human) {
        me.EachBuff((buff) => {
            if(ABuff.IsDebuff(buff.id)){
                he.AddBuff(BuffFactory.me.Produce(buff.id, he, buff.num));
            }
        })
    }
    protected onGetMana(): number {
        return this._lvlVal(2,1,0);
    }
}

class MeiKaiCard extends ACard {
    cardName: CardName = CardName.MeiKai;
    protected onEffect(me: Human, he: Human) {
        me.AddHp(this._lvlVal(2, 8, 14), this.cardName);
        me.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, me, 1));
    }
    
}

class HuangQueCard extends ACard {
    cardName: CardName = CardName.HuangQue;
    protected onEffect(me: Human, he: Human) {
        var cardList = me.CardList;
        cardList.SetCardOrder(cardList.cardOrder == CardOrder.L2R ? CardOrder.R2L : CardOrder.L2R);
        cardList.CostCurCard();
    }

}

export class CardList {
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

    public SetCardOrder(cardOrder: CardOrder) {
        this._cardOrder = cardOrder;
    }

    public CostCurCard() {
        this._costed[this._curCardIndex] = true;
    }

    public BackCard() {
        this._ShiftCard(-1);
    }
    
    public ShiftCard() {
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
        console.log("AFTER " + this._curCardIndex);
    }

    public toString(): string {
        return this._item.reduce((p,c,i)=> {
            var curMark = i == this._curCardIndex ? ">" : "";
            var costMark = this._costed[i] ? "*" : "";
            return p + ` ${costMark}${curMark}${c.cardName}`
        },"");
    }
}

export class CardListFactory {
    public static Size: number = 8;
    private _dict: Object;    
    constructor() {
        this._dict = {};
        [
            HitCard, DCTuneCard, BeiGongCard, FeiTaCard, TongXinCard,
            MeiKaiCard, HuangQueCard,
        ].forEach(type => {
            var card = new type() as ACard;
            this._dict[card.cardName] = type;
        });
    }
    public Pipe(...arg: any[]): CardList {
        var ret: ACard[] = [];
        for (var i = 0; i < CardListFactory.Size; i++) {
            var index = i * 2;
            if(arg[index] == undefined || index >= arg.length) {
                // 空的牌替换普攻
                var hit = new HitCard();
                hit.init(1);
                ret.push(hit);
            } else {
                var cardName = arg[index] as CardName;
                var cardLevel = arg[index + 1] as number;
                var card  = new this._dict[cardName]() as ACard;
                card.init(cardLevel);
                ret.push(card);
            }
        }
        return new CardList(ret);
    }
}

//#endregion CARD