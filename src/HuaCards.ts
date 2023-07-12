import { randomInt } from "crypto";
import { ABuff, BuffId } from "./Buff";
import { ACard, CardLevel, CardName, CardState } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { Human } from "./Human";
import { Cost, GenPush2Arr, Mana } from "./decorator";

export var Hua_LIST = []

var Hua = GenPush2Arr(Hua_LIST);


/*
CardState.LianQi
*/

@Hua
export class TiaoSeCard extends ACard {
    cardName: CardName = CardName.TiaoSe;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(3, 3, 4), me, this.cardName);
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
        me.AddBuffById(BuffId.Shield, 3, this.cardName);
    }

}

@Hua
export class LianBiCard extends ACard {
    cardName: CardName = CardName.LianBi;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {

    }

}

@Hua
@Mana(1)
export class YanMoCard extends ACard {
    cardName: CardName = CardName.YanMo;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
        me.RecoverMana(1);
    }
}




/*
CardState.ZhuJi
*/

@Hua
export class BiZouLongSheCard extends ACard {
    cardName: CardName = CardName.BiZouLongShe;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, me.Gua(this._lvlVal(5, 10, 15), this._lvlVal(16, 21, 26)), this.cardName);
    }

}
@Hua
export class HuaBingChongJiCard extends ACard {
    cardName: CardName = CardName.HuaBingChongJi;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddMaxHp(this._lvlVal(10, 15, 20), this.cardName);
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
    }

}
@Hua
export class HuaSheTianZuCard extends ACard {
    cardName: CardName = CardName.HuaSheTianZu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let time = 2;
        while (time--) {
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName);
        }
        me.AddBuffById(BuffId.Shield, 8, this.cardName);
        he.AddBuffById(BuffId.Shield, 8, this.cardName);
    }
}


/*
CardState.JinDan
*/

@Hua
export class HuiHaoPoMoCard extends ACard {
    cardName: CardName = CardName.HuiHaoPoMo;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const theDebuff = ABuff.Debuffs[randomInt(0, ABuff.Debuffs.length)];
        he.AddBuffById(theDebuff, this._lvlVal(2, 3, 4), this.cardName);
    }
}
@Hua
export class LingGanBengFaCard extends ACard {
    cardName: CardName = CardName.LingGanBengFa;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        me.AddBuffById(BuffId.Linggan, this._lvlVal(2, 3, 4), this.cardName);
    }
}
@Hua
export class YiHuaRuDaoCard extends ACard {
    cardName: CardName = CardName.YiHuaRuDao;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
    }
}


/*
CardState.YuanYing
*/


@Hua
export class ChuLeiPangTongCard extends ACard {
    cardName: CardName = CardName.ChuLeiPangTong;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {

    }
}
@Hua
export class ShenLaiZhiBiCard extends ACard {
    cardName: CardName = CardName.ShenLaiZhiBi;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(4, 6, 8), this.cardName);
        var card = CardListFactory.me.NewCardByType(
            CardListFactory.me.PickFromMen(me.men),
            this._lvlVal(CardLevel.Normal, CardLevel.Rare, CardLevel.Legend));
        me.appendLog("神来之笔", "释放 " + card.cardName)
        card.effect(me, he);
        card = null;
    }

}

@Hua
export class LuoZhiYunYanCard extends ACard {
    cardName: CardName = CardName.LuoZhiYunYan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        const index = randomInt(0, 3)
        if (index == 0) {
            me.AddBuffById(BuffId.Shield, this._lvlVal(16, 24, 32), this.cardName)
        } else if (index == 1) {
            me.AddHp(this._lvlVal(12, 18, 24), this.cardName);
        } else if (index == 2) {
            me.AddBuffById(BuffId.Protect, this._lvlVal(1, 2, 3), this.cardName);
        }
    }
}


/*
CardState.HuaShen
*/


@Hua
export class YunBiRuFeiCard extends ACard {
    cardName: CardName = CardName.YunBiRuFei;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(6, 12, 18), this.cardName);
        me.AddBuffById(BuffId.YunbirufeiWait, 1, this.cardName);
    }

}
@Hua
@Cost
export class HuaLongDianJingCard extends ACard {
    cardName: CardName = CardName.HuaLongDianJing;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Hualongdianjing, this._lvlVal(3, 4, 5), this.cardName);
    }
}
@Hua
export class MiaoBiShengHuaCard extends ACard {
    cardName: CardName = CardName.MiaoBiShengHua;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
    }

}
// @Hua
// export class BCard extends ACard {}
// @Hua
// export class BCard extends ACard {}
