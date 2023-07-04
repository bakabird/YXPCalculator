import { BuffId } from "./Buff";
import { ACard, CardLevel, CardName, CardState } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { Human } from "./Human";
import LogEncode from "./LogEncode";
import { GenPush2Arr, Keeping } from "./decorator";


export var Zhen_LIST = []

var Zhen = GenPush2Arr(Zhen_LIST)


/**
 * 炼气
 */
@Zhen
export class YinLeiZhenCard extends ACard {
    cardName: CardName = CardName.YinLeiZhen;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Yinlei, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true
    }
}

@Zhen
export class SuiShaZhenCard extends ACard {
    cardName: CardName = CardName.SuiShaZhen;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Suisha, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true
    }

}

@Zhen
export class ChongJiZhenWenCard extends ACard {
    cardName: CardName = CardName.ChongJiZhenWen;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        const add = me.CheckBuff(BuffId.Record_KeepingCardUseTime, 1) ? this._lvlVal(2, 3, 4) : 0;
        he.GetHit(this._lvlVal(6, 8, 10) + add, me, this.cardName);
    }
}








/**
 * 筑基期
 */
@Zhen
export class GuiJiaZhenCard extends ACard {
    cardName: CardName = CardName.GuiJiaZhen;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Guijia, this._lvlVal(4, 6, 8), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true
    }
}

@Zhen
export class XieGuZhenCard extends ACard {
    cardName: CardName = CardName.XieGuZhen;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Xiegu, this._lvlVal(2, 3, 4), this.cardName)
    }
    protected onGetIsKeeping(): boolean {
        return true
    }
}

@Zhen
export class LiaoYuZhenWenCard extends ACard {
    cardName: CardName = CardName.LiaoYuZhenWen;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        if (me.CheckBuff(BuffId.Record_KeepingCardUseTime, 1)) {
            me.AddMaxHp(this._lvlVal(6, 9, 12), this.cardName);
        }
        me.AddHp(this._lvlVal(7, 11, 15), this.cardName)
    }
}


/**
 * 金丹
 */
@Zhen
export class JuLingZhenCard extends ACard {
    cardName: CardName = CardName.JuLingZhen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Juling, this._lvlVal(2, 3, 4), this.cardName)
    }
    protected onGetIsKeeping(): boolean {
        return true
    }

}
@Zhen
export class ZhouTianJianZhenCard extends ACard {
    cardName: CardName = CardName.ZhouTianJianZhen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Zhoutianjian, this._lvlVal(2, 3, 4), this.cardName)
    }
    protected onGetIsKeeping(): boolean {
        return true
    }

}

@Zhen
export class PiXieZhenWenCard extends ACard {
    cardName: CardName = CardName.PiXieZhenWen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(10, 14, 18), this.cardName);
        if (me.CheckBuff(BuffId.Record_KeepingCardUseTime, 1)) {
            me.AddBuffById(BuffId.Pixie, this._lvlVal(3, 4, 5), this.cardName);
        }
    }

}









/**
 * 元婴
 */
@Zhen
@Keeping
export class TianGangJuLiZhenCard extends ACard {
    cardName: CardName = CardName.TianGangJuLiZhen;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Juli, this._lvlVal(2, 3, 4), this.cardName)
    }
}
@Keeping
@Zhen
export class BaMenJinSuoZhenCard extends ACard {
    cardName: CardName = CardName.BaMenJinSuoZhen;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.AddBuffById(BuffId.Bamenjinsuo, this._lvlVal(2, 3, 4), this.cardName)
    }
}
@Keeping
@Zhen
export class BuDongJinGangZhenCard extends ACard {
    cardName: CardName = CardName.BuDongJinGangZhen;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Budongjingang, this._lvlVal(2, 3, 4), this.cardName);
    }

}
// export class BCard extends ACard {}








/**
 * 化神
 */
@Zhen
export class DecalEchoCard extends ACard {
    cardName: CardName = CardName.DecalEcho;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        var firstCard: ACard;
        me.CardList.EachCardsL2R(c => { if (!firstCard) firstCard = c });
        if (firstCard && firstCard.isKeeping) {
            var card = CardListFactory.me.NewCard(firstCard.cardName,
                this._lvlVal(CardLevel.Normal, CardLevel.Rare, CardLevel.Legend));
            me.AddBuffById(BuffId.DecalEcho, 1, LogEncode.Ignore);
            card.effect(me, he);
            me.RemoveBuff(BuffId.DecalEcho, LogEncode.Ignore);
            card = null;
        }
    }

}

@Zhen
export class ZhenMillionFlower extends ACard {
    cardName: CardName = CardName.ZhenMillionFlower;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.ZhenMillionFlower, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

