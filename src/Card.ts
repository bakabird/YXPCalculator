import { ABuff, BuffFactory, BuffId, DCBuff, ManaBuff, PosionBuff } from "./Buff";
import { Debug } from "./Debug";
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
    XingFei = "星飞",
    HaiDi = "海底",
    TangLang = "螳螂",
    GoldChan = "金蝉",
    QiTun = "气吞",
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

export type CardInfo = {
    name: CardName,
    level: number,
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
        Debug.debug(`【卡牌使用】${me.name} 使用 ${this.cardName}`)
        this.onEffect(me, he);
        if (me.CardList.IsOnStar()) {
            this.onEffectStar(me, he);
        }
        if (this.onGetSecondAct()){
            if(this._useNum > 0) {
                this.onEffectSecAct(me, he)
            }
            var buff = me.GetBuff(BuffId.HuangQue);
            if(buff && buff.num > 0) {
                he.CutHp(buff.num, buff.id);
            }
        }
        this._useNum++;
    }
    // 卡牌耗蓝
    protected onGetMana(): number {
        return 0;
    }
    // 是否含后招
    protected onGetSecondAct(): boolean {
        return false;
    }
    // 卡牌效果
    protected abstract onEffect(me: Human, he: Human);
    // 后招效果
    protected onEffectSecAct(me: Human, he: Human){
    };
    // 星位效果
    protected onEffectStar(me: Human, he: Human) {
    };

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
        me.CardList.CostCur();
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
        if(!this.onGetSecondAct()) {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
        }
    }
    protected onGetSecondAct(): boolean {
        return this._lvlVal(true, false, false)
    }
    protected onEffectSecAct(me: Human, he: Human) {
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
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
    protected onGetMana(): number {
        return 1;
    }   
}

class HuangQueCard extends ACard {
    cardName: CardName = CardName.HuangQue;
    protected onEffect(me: Human, he: Human) {
        var cardList = me.CardList;
        cardList.SetCardOrder(cardList.cardOrder == CardOrder.L2R ? CardOrder.R2L : CardOrder.L2R);
        me.AddBuff(BuffFactory.me.Produce(BuffId.HuangQue, me, this._lvlVal(7, 10, 13)));
        cardList.CostCur();
    }

}

class XingFeiCard extends ACard {
    cardName: CardName = CardName.XingFei;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0;i < 2;i ++) {
            he.CutHp(this._lvlVal(2,4,6), this.cardName);
        }
    }
    protected onEffectStar(me: Human, he: Human): void {
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
    }
    protected onGetMana(): number {
        return 1;
    }
}

class HaiDiCard extends ACard {
    cardName: CardName = CardName.HaiDi;
    protected onEffect(me: Human, he: Human) {
        
    }
    protected onGetSecondAct(): boolean {
        return true;
    }
    protected onEffectSecAct(me: Human, he: Human): void {
        he.CutHp(this._lvlVal(12, 18 ,24), this.cardName);
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1));
    }
    
}

export class QiTunCard extends ACard {
    cardName: CardName = CardName.QiTun;
    protected onEffect(me: Human, he: Human) {
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1))
    }
    protected onGetMana(): number {
        return 2;
    }
    protected onGetSecondAct(): boolean {
        return true;
    }
    protected onEffectSecAct(me: Human, he: Human): void {
        me.AddHp(this._lvlVal(24, 31, 38), this.cardName);
    }
}

export class GoldChanCard extends ACard {
    cardName: CardName = CardName.GoldChan;
    protected onEffect(me: Human, he: Human) {
        // console.log("no need to realize Defend");
        me.AddHp(this._lvlVal(9, 12, 15), this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
    protected onGetSecondAct(): boolean {
        return true;
    }
    protected onEffectSecAct(me: Human, he: Human): void {
        me.AddBuff(BuffFactory.me.Produce(BuffId.Protect, me, 1));        
    }
}

export class TangLangCard extends ACard {
    cardName: CardName = CardName.TangLang;
    protected onEffect(me: Human, he: Human) {
        for(var i = 0;i < 2;i++){
            he.CutHp(this._lvlVal(2,3,4), this.cardName);
        }
        me.AddHp(this._lvlVal(4, 6, 8), this.cardName);
    }

    protected onGetSecondAct(): boolean {
        return true;
    }

    protected onEffectSecAct(me: Human, he: Human): void {
        he.CutHp(this._lvlVal(7, 10, 13), this.cardName);
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


var AllCardType = [
    HitCard, DCTuneCard, BeiGongCard, FeiTaCard, TongXinCard,
    MeiKaiCard, HuangQueCard, XingFeiCard, HaiDiCard, TangLangCard,
    GoldChanCard, QiTunCard,
] 

export class CardListFactory {
    private static _me: CardListFactory;
    public static Size: number = 8;
    public static get me(): CardListFactory {
        if(!this._me) {
            this._me = new CardListFactory();
        }
        return this._me;
    }

    private _dict: Object;    
    private constructor() {
        this._dict = {};
        AllCardType.forEach(type => {
            var card = new type() as ACard;
            this._dict[card.cardName] = type;
        });
    }
    public SplitCode(code: string): CardInfo[] {
        var ret: Array<CardInfo> = [];
        var arg = code == "" ? [] : code.split(" ");
        for(var i = 0;i < CardListFactory.Size;i++) {
            var index = i * 2;
            if(index >= arg.length || 
                arg[index] == undefined || arg[index] == "_") {
                ret.push({
                    name: CardName.Hit,
                    level: 1
                });
            } else {
                ret.push({
                    name: arg[index] as CardName,
                    level: parseInt(arg[index + 1])
                });
            }
        }
        return ret;
    }
    public FormList(infoList: Array<CardInfo>): CardList {
        var ret: ACard[] = [];
        infoList.forEach(info => {
            var cardType = this._dict[info.name];
            if(!cardType) {
                throw "unknown card " + info.name;
            }
            var card: ACard = new cardType();
            card.init(info.level);
            ret.push(card);
        })
        return new CardList(ret);
    }
}

//#endregion CARD