import { BES, BuffFactory, BuffId, ManaBuff, PosionBuff } from "./Buff";
import { Human } from "./Human";
import { ACard, CardName, CardEffect, CardOrder, CardState } from "./Card";


export class FeiTaCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.FeiTa;
    protected onEffect(me: Human, he: Human) {
        var buff = new ManaBuff();
        buff.init(me, this._lvlVal(3, 3, 4));
        me.AddBuff(buff, this.cardName);
        if (!this.onGetSecondAct()) {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        }
    }
    protected onGetSecondAct(): CardEffect {
        return this._lvlVal((me: Human, he: Human) => {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        }, null, null);
    }
}















export class HaiDiCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.HaiDi;
    protected onEffect(me: Human, he: Human) {
    }
    protected onGetSecondAct() {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(12, 18, 24), me, this.cardName);
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        };
    }

}

export class TangLangCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.TangLang;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(2, 3, 4), me, this.cardName);
        }
        me.AddHp(this._lvlVal(4, 6, 8), this.cardName);
    }

    protected onGetSecondAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(7, 10, 13), me, this.cardName);
        };
    }
}
















export class GoldChanCard extends ACard {
    cardState: CardState = CardState.YuanYing;
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
        };
    }
}

export class XingFeiCard extends ACard {
    cardState: CardState = CardState.YuanYing
    cardName: CardName = CardName.XingFei;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(2, 4, 6), me, this.cardName);
        }
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        };
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class BeiGongCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.BeiGong;
    onEffect(me: Human, he: Human) {
        var posionBuff = new PosionBuff();
        posionBuff.init(he, this._lvlVal(2, 3, 4));
        he.AddBuff(posionBuff, this.cardName);
        var buff = he.GetBuff(BuffId.Posion);
        buff.effect(BES.RoundStart);
    }
}














export class QiTunCard extends ACard {
    cardState: CardState = CardState.HuaShen;
    cardName: CardName = CardName.QiTun;
    protected onEffect(me: Human, he: Human) {
        me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
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

export class HuangQueCard extends ACard {
    cardState: CardState = CardState.HuaShen;
    cardName: CardName = CardName.HuangQue;
    protected onEffect(me: Human, he: Human) {
        var cardList = me.CardList;
        cardList.SetCardOrder(cardList.cardOrder == CardOrder.L2R ? CardOrder.R2L : CardOrder.L2R);
        me.AddBuff(BuffFactory.me.Produce(BuffId.HuangQue, me, this._lvlVal(7, 10, 13)), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class MeiKaiCard extends ACard {
    cardState: CardState = CardState.HuaShen;
    cardName: CardName = CardName.MeiKai;
    protected onEffect(me: Human, he: Human) {
        me.AddHp(this._lvlVal(2, 8, 14), this.cardName);
        me.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, me, 1), this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
}