import { ABuff, BES, BuffFactory, BuffId, DCBuff, ManaBuff, PosionBuff, SwordMenaingBuff } from "./Buff";
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
    YunTanYun = "云剑·探云",
    YunFeiCi = "云剑·飞刺",
    YunHouTu = "云剑·厚土",
    LightSword = "轻剑",
    ManaProtectMe = "护身灵气",
    ManaInside = "灵气灌注",
    HugeTigerManaSword = "巨虎灵剑",
    ShockThunderSword = "震雷剑",
    SwordChop = "剑劈",
    SwordBlock = "剑挡",
    FlyingToothSword = "飞牙剑",
    SuddenWindSword = "骤风剑",
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

type CardEffect = (me: Human,he: Human)=>void;

export abstract class ACard {
    abstract cardName: CardName;
    private _level: CardLevel;
    private _useNum: number;
    public get mana(): number {
        return this.onGetMana();
    }
    // 初始化时被赋予的卡牌等级
    public get initLevel() {
        return this._level;
    }
    init(level: CardLevel) {
        this._level = level;
        this._useNum = 0;
    };
    public effect(me:Human, he: Human) {
        const secondAct = this.onGetSecondAct();
        const starAct = this.onGetStarAct();
        const yunAct = this.onGetYunAct();
        const hurtAct = this.onGetHurtAct();
        const oldHeHp = he.hp;
        this.onEffect(me, he);
        if (starAct) {
            if (me.CardList.IsOnStar()){
                starAct(me, he);
            }
        }
        if (secondAct){
            if(this._useNum > 0) {
                secondAct(me, he);
            }
            var buff = me.GetBuff(BuffId.HuangQue);
            if(buff && buff.num > 0) {
                he.GetHit(buff.num, me, buff.id);
            }
        }
        if (yunAct && me.CheckBuff(BuffId.YunJian, 1)) {
            yunAct(me, he);
        }
        if (hurtAct && he.hp < oldHeHp) {
            hurtAct(me, he);
        }
        if (this.cardName.startsWith("云剑")) {
            me.AddBuff(BuffFactory.me.Produce(BuffId.YunJian, me, 1), this.cardName);
        } else {
            me.RemoveBuff(BuffId.YunJian, "用牌结束");
        }
        this._useNum++;
        me.EffectBuff(BES.AnyCardEffectOver);
    }
    // 卡牌耗蓝
    protected onGetMana(): number {
        return 0;
    }
    // 卡牌效果
    protected abstract onEffect(me: Human, he: Human);
    // 后招效果
    protected onGetSecondAct(): CardEffect {
        return null;
    }
    // 星位效果
    protected onGetStarAct(): CardEffect {
        return null;
    }
    // 云剑效果
    protected onGetYunAct(): CardEffect {
        return null;
    }
    // 击伤效果
    protected onGetHurtAct(): CardEffect {
        return null
    }

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
        he.GetHit(3, me, this.cardName);
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
        me.AddBuff(meBuff, this.cardName);
        he.AddBuff(heBuff, this.cardName);
        me.CardList.CostCur();
    }    
}

export class BeiGongCard extends ACard {
    cardName: CardName = CardName.BeiGong;
    onEffect(me: Human, he: Human) {
        var posionBuff = new PosionBuff();
        posionBuff.init(he, this._lvlVal(2, 3, 4));
        he.AddBuff(posionBuff, this.cardName);
        var buff = he.GetBuff(BuffId.Posion);
        buff.effect(BES.RoundStart);
    }
}

export class FeiTaCard extends ACard {
    cardName: CardName = CardName.FeiTa;
    protected onEffect(me: Human, he: Human) {
        var buff = new ManaBuff();
        buff.init(me, this._lvlVal(3,3,4));
        me.AddBuff(buff, this.cardName);
        if(!this.onGetSecondAct()) {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        }
    }
    protected onGetSecondAct(): CardEffect{
        return this._lvlVal((me: Human, he: Human)=>{
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        }, null, null)
    }
}

export class TongXinCard extends ACard {
    cardName: CardName = CardName.TongXin; 
    protected onEffect(me: Human, he: Human) {
        me.EachBuff((buff) => {
            if(ABuff.IsDebuff(buff.id)){
                he.AddBuff(BuffFactory.me.Produce(buff.id, he, buff.num), this.cardName);
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
        me.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, me, 1), this.cardName);
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
        me.AddBuff(BuffFactory.me.Produce(BuffId.HuangQue, me, this._lvlVal(7, 10, 13)), this.cardName);
        cardList.CostCur();
    }

}

export class XingFeiCard extends ACard {
    cardName: CardName = CardName.XingFei;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0;i < 2;i ++) {
            he.GetHit(this._lvlVal(2,4,6), me, this.cardName);
        }
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class HaiDiCard extends ACard {
    cardName: CardName = CardName.HaiDi;
    protected onEffect(me: Human, he: Human) {
        
    }
    protected onGetSecondAct() {
        return (me: Human, he: Human)=>{
            he.GetHit(this._lvlVal(12, 18 ,24), me, this.cardName);
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        };
    }
    
}

export class QiTunCard extends ACard {
    cardName: CardName = CardName.QiTun;
    protected onEffect(me: Human, he: Human) {
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName)
        me.AddMaxHp(this._lvlVal(12, 16, 20), this.cardName);
    }
    protected onGetMana(): number {
        return 2;
    }
    protected onGetSecondAct() {
        return (me, he) => {
            me.AddHp(this._lvlVal(24, 31, 38), this.cardName);
        };
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
    protected onGetSecondAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuff(BuffFactory.me.Produce(BuffId.Protect, me, 1), this.cardName);        
        }
    }
}

export class TangLangCard extends ACard {
    cardName: CardName = CardName.TangLang;
    protected onEffect(me: Human, he: Human) {
        for(var i = 0;i < 2;i++){
            he.GetHit(this._lvlVal(2,3,4), me, this.cardName);
        }
        me.AddHp(this._lvlVal(4, 6, 8), this.cardName);
    }

    protected onGetSecondAct(): CardEffect {
        return (me: Human,he: Human) => {
            he.GetHit(this._lvlVal(7, 10, 13), me, this.cardName);
        }
    }
}

export class YunTanYunCard extends ACard {
    cardName: CardName = CardName.YunTanYun;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName);
    }
}

export class YunFeiCiCard extends ACard {
    cardName: CardName = CardName.YunFeiCi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5,6,7), me, this.cardName);
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(3,5,7), me, this.cardName);
        }
    }
}

export class YunHouTuCard extends ACard {
    cardName: CardName = CardName.YunHouTu;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4,6,8), me, this.cardName)
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he:Human)=> {
            me.AddBuff(BuffFactory.me.Produce(BuffId.Shield, me, this._lvlVal(4,6,8)), this.cardName);
        }
    }

}

export class LightSwordCard extends ACard {
    cardName: CardName = CardName.LightSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(4, me, this.cardName);
        me.RecoverMana(this._lvlVal(1, 2, 3));
    }

}

export class ManaProtectMeCard extends ACard {
    cardName: CardName = CardName.ManaProtectMe;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1,2,3));
        me.AddBuff(BuffFactory.me.Produce(BuffId.Shield, me, 5), this.cardName);
    }

}

export class ManaInsideCard extends ACard {
    cardName: CardName = CardName.ManaInside;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2,3,4));
        me.AddBuff(BuffFactory.me.Produce(BuffId.Pierce, me, 1), this.cardName);
    }

}

export class HugeTigerManaSwordCard extends ACard {
    cardName: CardName = CardName.HugeTigerManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(10, 13, 16), me, this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class ShockThunderSwordCard extends ACard {
    cardName: CardName = CardName.ShockThunderSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5,6,7), me, this.cardName);
    }
    protected onGetHurtAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(6, 8, 10), me, this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class SwordChopCard extends ACard {
    cardName: CardName = CardName.SwordChop;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4,5,6), me, this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2,3,4), this.cardName);
    }

}

export class SwordBlockCard extends ACard {
    cardName: CardName = CardName.SwordBlock;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(4,5,6), this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2,3,4), this.cardName);
    }

}

export class FlyingToothSwordCard extends ACard {
    cardName: CardName = CardName.FlyingToothSword;
    protected onEffect(me: Human, he: Human) {
        const smBuff = me.GetBuff(BuffId.SwordMenaing);
        he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
        if(smBuff) {
            me.AddBuff(smBuff, this.cardName);
        }
    }

}

export class SuddenWindSwordCard extends ACard {
    cardName: CardName = CardName.SuddenWindSword;
    protected onEffect(me: Human, he: Human) {
        for (let index = 0; index < 2; index++) {
            he.GetHit(this._lvlVal(3,4,6), me, this.cardName);
        }
    }

}
