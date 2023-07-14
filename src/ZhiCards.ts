import { randomInt } from "node:crypto";
import { ABuff, BuffId, DuanChang } from "./Buff";
import { ACard, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { GenPush2Arr, Keeping, Mana } from "./decorator";

export var Zhi_LIST = []

var Zhi = GenPush2Arr(Zhi_LIST);

/*
CardState.LianQi
*/

@Zhi
export class GuiYuanCao extends ACard {
    cardName: CardName = CardName.GuiYuanCao;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class GuiYanCaoCard extends ACard {
    cardName: CardName = CardName.GuiYanCao;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class JinSuolanCard extends ACard {
    cardName: CardName = CardName.JinSuolan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class HuoSuolanCard extends ACard {
    cardName: CardName = CardName.HuoSuolan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class JianZhiZhuCard extends ACard {
    cardName: CardName = CardName.JianZhiZhu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        let time = this._lvlVal(1, 2, 3);
        const atk = 6 / time;
        while (time--) {
            he.GetHit(atk, me, this.cardName);
        }
    }
}
@Zhi
export class YingZhiZhuCard extends ACard {
    cardName: CardName = CardName.YingZhiZhu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(3, 6, 9), this.cardName);
        if (this._lvlVal(false, false, true)) {
            me.AddBuffById(BuffId.Yingzhizhu, 1, this.cardName);
        }
    }
    protected onGetIsKeeping(): boolean {
        return this._lvlVal(false, false, true);
    }
}




/*
CardState.ZhuJi
*/



@Zhi
export class ShenLiCaoCard extends ACard {
    cardName: CardName = CardName.ShenLiCao;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class ShiLiCaoCard extends ACard {
    cardName: CardName = CardName.ShiLiCao;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class ShenMiZhongziCard extends ACard {
    cardName: CardName = CardName.ShenMiZhongzi;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class YeDunHuaCard extends ACard {
    cardName: CardName = CardName.YeDunHua;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(8, 14, 20), this.cardName);
        if (this._lvlVal(false, false, true)) {
            me.AddBuffById(BuffId.Yedunhua, 1, this.cardName);
        }
    }
    protected onGetIsKeeping(): boolean {
        return this._lvlVal(false, false, true)
    }
}
@Zhi
export class YeRenHuaCard extends ACard {
    cardName: CardName = CardName.YeRenHua;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let time = this._lvlVal(1, 2, 3);
        while (time--) {
            he.GetHit(4, me, this.cardName);
        }
        me.AddBuffById(BuffId.Yerenhua, 1, this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return this._lvlVal(false, false, true)
    }
}

/*
CardState.JinDan
*/

@Zhi
export class YuGanJuCard extends ACard {
    cardName: CardName = CardName.YuGanJu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class QingGanJuCard extends ACard {
    cardName: CardName = CardName.QingGanJu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {

    }
}

@Zhi
export class LingZhiJiaoGuanCard extends ACard {
    cardName: CardName = CardName.LingZhiJiaoGuan;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class XiangLingKuiCard extends ACard {
    cardName: CardName = CardName.XiangLingKui;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        if (he.mana > 0 && this._lvlVal(false, false, true)) {
            me.RecoverMana(2, this.cardName);
        }
    }
}
@Zhi
export class XieLingKuiCard extends ACard {
    cardName: CardName = CardName.XieLingKui;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const heMana = he.mana;
        const cutMana = this._lvlVal(1, 2, 3);
        he.RecoverMana(-cutMana, this.cardName);
        if (this._lvlVal(false, false, true) && heMana < cutMana) {
            he.SimpleGetHit((cutMana - heMana) * 5, this.cardName);
        }
    }
}

/*
CardState.YuanYing
*/


@Zhi
export class FeiXiaoLingZhiCard extends ACard {
    cardName: CardName = CardName.FeiXiaoLingZhi;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class YingXiaoLingZhiCard extends ACard {
    cardName: CardName = CardName.YingXiaoLingZhi;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
    }
}
@Zhi
export class ChuanChangZiJueCard extends ACard {
    cardName: CardName = CardName.ChuanChangZiJue;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class QingChangZiJueCard extends ACard {
    cardName: CardName = CardName.QingChangZiJue;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        var tmp = [];
        me.EachBuff(buff => {
            if (ABuff.IsDebuff(buff.id)) {
                tmp.push(buff);
            }
        })
        if (tmp.length > 0) {
            const cutbuff = tmp[randomInt(0, tmp.length)];
            me.AddBuffById(cutbuff.id, this._lvlVal(1, 2, 3), this.cardName);
        }

        if (this._lvlVal(false, false, true)) {
            tmp.length = 0;
            me.EachBuff(buff => {
                if (ABuff.IsDebuff(buff.id)) {
                    tmp.push(buff);
                }
            })
            if (tmp.length < 1) {
                me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
            }
        }
    }
}
@Zhi
export class BingFengXueLianCard extends ACard {
    cardName: CardName = CardName.BingFengXueLian;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddHp(this._lvlVal(5, 10, 10), this.cardName);
        if (this._lvlVal(false, false, true)) {
            me.AddBuffById(BuffId.BingFengXueLian, 3, this.cardName);
        }
    }
}
@Zhi
export class BingFengXieLianCard extends ACard {
    cardName: CardName = CardName.BingFengXieLian;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.CutHp(this._lvlVal(5, 15, 25), this.cardName);
        me.AddBuffById(BuffId.Protect, this._lvlVal(1, 2, 3), this.cardName);
    }
}


/*
CardState.HuaShen
*/

@Zhi
export class XuanYunDaoGuoCard extends ACard {
    cardName: CardName = CardName.XuanYunDaoGuo;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class MoYunDaoGuoCard extends ACard {
    cardName: CardName = CardName.MoYunDaoGuo;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {

    }
}
@Zhi
export class KongJianLingTianCard extends ACard {
    cardName: CardName = CardName.KongJianLingTian;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(4, 5, 6));
    }
    protected onGetIsSkip(me: Human, he: Human): boolean {
        // 2 0|2 1|1
        const posOnLast2 = (me.CardList.size - me.CardList.curCardIndex) <= 2;
        return posOnLast2 && this.skipNum < 1;
    }
}
@Zhi
@Mana(1)
export class FuXianGuTengCard extends ACard {
    cardName: CardName = CardName.FuXianGuTeng;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        he.AddBuffById(BuffId.Shufu, this._lvlVal(1, 2, 2), this.cardName);
        if (this._lvlVal(false, false, true)) {
            he.AddBuffById(BuffId.FuXianGuTeng, 3, this.cardName);
        }
    }
    protected onGetIsKeeping(): boolean {
        return this._lvlVal(false, false, true)
    }
}
@Zhi
export class ShiXianGuTengCard extends ACard {
    cardName: CardName = CardName.ShiXianGuTeng;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(5, 10, 10);
        he.CutHp(val, this.cardName);
        me.AddHp(val, this.cardName);
        if (this._lvlVal(false, false, true)) {
            he.AddBuffById(BuffId.ShiXianGuTeng, 7, this.cardName);
        }
    }
    protected onGetIsKeeping(): boolean {
        return this._lvlVal(false, false, true)
    }
}
// @Zhi
// export class BCard extends ACard {}
// @Zhi
// export class BCard extends ACard {}

