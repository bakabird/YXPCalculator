import { BuffId } from "./Buff";
import { ACard, CardLevel, CardName, CardState } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { Human } from "./Human";
import LogEncode from "./LogEncode";



/**
 * 炼气
 */
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


// export class BCard extends ACard {}



/**
 * 化神
 */

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



export var Zhen_LIST = [
    YinLeiZhenCard, SuiShaZhenCard, ChongJiZhenWenCard,
    GuiJiaZhenCard, XieGuZhenCard, LiaoYuZhenWenCard,
    DecalEchoCard, ZhenMillionFlower,
]