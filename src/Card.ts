import { ABuff, BuffFactory, BuffId, DCBuff, ManaBuff, PosionBuff } from "./Buff";
import { Debug } from "./Debug";
import { Human } from "./Human"

//#region CARD

export enum CardName {
    Hit = "普通攻击",
    DCTune = "断肠曲",
    BeiGong = "杯弓蛇影",
    FeiTa = "飞鸿踏雪",
    TongXin = "同心曲",
    MeiKai = "梅开二度",
    HuangQue = "黄雀在后",
    XingFei = "星弈·飞",
    HaiDi = "海底捞月",
    TangLang = "螳螂捕蝉",
    GoldChan = "金蝉脱壳",
    QiTun = "气吞山河",
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

export class HitCard extends ACard {
    cardName: CardName = CardName.Hit;
    onEffect(me: Human, he: Human) {
        he.CutHp(3, this.cardName);
    }
}

export class DCTuneCard extends ACard {
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

export class BeiGongCard extends ACard {
    cardName: CardName = CardName.BeiGong;
    onEffect(me: Human, he: Human) {
        var posionBuff = new PosionBuff();
        posionBuff.init(he, this._lvlVal(2, 3, 4));
        he.AddBuff(posionBuff);
        var buff = he.GetBuff(BuffId.Posion);
        he.CutHp(buff.num, this.cardName);
    }
}

export class FeiTaCard extends ACard {
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

export class TongXinCard extends ACard {
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

export class MeiKaiCard extends ACard {
    cardName: CardName = CardName.MeiKai;
    protected onEffect(me: Human, he: Human) {
        me.AddHp(this._lvlVal(2, 8, 14), this.cardName);
        me.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, me, 1));
    }
    protected onGetMana(): number {
        return 1;
    }   
}

export class HuangQueCard extends ACard {
    cardName: CardName = CardName.HuangQue;
    protected onEffect(me: Human, he: Human) {
        var cardList = me.CardList;
        cardList.SetCardOrder(cardList.cardOrder == CardOrder.L2R ? CardOrder.R2L : CardOrder.L2R);
        me.AddBuff(BuffFactory.me.Produce(BuffId.HuangQue, me, this._lvlVal(7, 10, 13)));
        cardList.CostCur();
    }

}

export class XingFeiCard extends ACard {
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

export class HaiDiCard extends ACard {
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

