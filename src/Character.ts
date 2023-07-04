import { BuffId } from "./Buff";
import { ACard, CardEffect, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { GenPush2Arr } from "./decorator";

export var WuXingzhi_LIST = []
export var TanShuYan_LIST = []
export var YanXue_LIST = []

var WuXingzhi = GenPush2Arr(WuXingzhi_LIST)
var TanShuYan = GenPush2Arr(TanShuYan_LIST)
var YanXue = GenPush2Arr(YanXue_LIST)

@WuXingzhi
export class Youranhl extends ACard {
    cardName: CardName = CardName.Youranhl;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        // recover mana 1/2/3
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName)
        // recover 3/5/7 hp
        me.AddHp(this._lvlVal(3, 5, 7), this.cardName)
        if (me.isWuxing) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }

}

@TanShuYan
export class FeiTaCard extends ACard {
    cardName: CardName = CardName.FeiTa;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(3, 3, 4), this.cardName)
        if (!this.onGetSecondAct()) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName)
        }
    }
    protected onGetSecondAct(): CardEffect {
        return this._lvlVal((me: Human, he: Human) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName)
        }, null, null);
    }
}

@YanXue
export class YunCrashSnowCard extends ACard {
    cardName: CardName = CardName.YunCrashSnow;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        if (!me.CheckBuff(BuffId.YunJian, 1)) {
            he.GetHit(2, me, this.cardName)
        }
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            if (me.CheckBuff(BuffId.YunJian, 1)) {
                he.GetHit(
                    2 + this._lvlVal(4, 5, 6) * me.GetBuff(BuffId.YunJian).num,
                    me, this.cardName
                );
            }
        }
    }
}