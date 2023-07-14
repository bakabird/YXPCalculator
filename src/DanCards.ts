import { randomInt } from "node:crypto";
import { ABuff, BuffId } from "./Buff";
import BuffCfg from "./BuffCfg";
import { ACard, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { Cost, GenPush2Arr, Mana } from "./decorator"

export var Dan_LIST = []

var Dan = GenPush2Arr(Dan_LIST);

/*
 CardState.LianQi
 */

@Dan
@Cost
export class DiLingDanCard extends ACard {
    cardName: CardName = CardName.DiLingDan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(11, 16, 21), this.cardName);
    }

}


@Dan
@Cost
export class PeiYuanDanCard extends ACard {
    cardName: CardName = CardName.PeiYuanDan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(3, 5, 7), this.cardName);
    }
}


@Dan
@Cost
export class XiaoHuanDanCard extends ACard {
    cardName: CardName = CardName.XiaoHuanDan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddHp(this._lvlVal(8, 12, 16), this.cardName);
    }

}




/**
    CardState.ZhuJi
 */
@Dan
export class DuanTiDanCard extends ACard {
    cardName: CardName = CardName.DuanTiDan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
    }

}

@Dan
@Cost
export class FeiYunDanCard extends ACard {
    cardName: CardName = CardName.FeiYunDan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        me.AddBuffById(BuffId.Pierce, this._lvlVal(2, 3, 4), this.cardName);
    }

}

@Dan
@Cost
export class QuXieDanCard extends ACard {
    cardName: CardName = CardName.QuXieDan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let tmp = [];
        let rest = this._lvlVal(2, 3, 4)
        me.AddBuffById(BuffId.Shield, this._lvlVal(8, 12, 16), this.cardName)
        while (rest--) {
            tmp.length = 0;
            me.EachBuff(buff => {
                if (ABuff.IsDebuff(buff.id)) {
                    tmp.push(buff);
                }
            })
            if (tmp.length > 0) {
                const cutbuff = tmp[randomInt(0, tmp.length)];
                me.AddBuffById(cutbuff.id, BuffCfg.Quxiedan_cut, this.cardName);
            }
        }

    }
}




/**
CardState.JinDan
 */
@Dan
export class HuanHunDanCard extends ACard {
    cardName: CardName = CardName.HuanHunDan;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
    }

}

@Dan
@Cost
export class LiaoShangDanCard extends ACard {
    cardName: CardName = CardName.LiaoShangDan;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const extra = me.mana * 2;
        me.AddHp(this._lvlVal(7, 12, 17) + extra, this.cardName);
    }
}

@Dan
@Cost
export class ShenLiDanCard extends ACard {
    cardName: CardName = CardName.ShenLiDan;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Power, this._lvlVal(1, 2, 3), this.cardName);
    }

}




/**
CardState.YuanYing
 */
@Dan
@Cost
export class DaHuanDanCard extends ACard {
    cardName: CardName = CardName.DaHuanDan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(13, 19, 25);
        me.AddMaxHp(val, this.cardName)
        me.AddHp(val, this.cardName);
    }

}
@Dan
@Cost
export class JuLingDanCard extends ACard {
    cardName: CardName = CardName.JuLingDan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(4, 6, 8), this.cardName)
    }

}
@Dan
export class XiSuiDanCard extends ACard {
    cardName: CardName = CardName.XiSuiDan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
    }
}




/**
CardState.HuaShen
 */
@Dan
@Cost
@Mana(1)
export class BingLingHuTiDanCard extends ACard {
    cardName: CardName = CardName.BingLingHuTiDan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Protect, this._lvlVal(2, 3, 4), this.cardName);
    }
}
@Dan
export class DuanTiXuanDanCard extends ACard {
    cardName: CardName = CardName.DuanTiXuanDan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
    }
}
@Dan
export class WuDaoDanCard extends ACard {
    cardName: CardName = CardName.WuDaoDan;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
    }

}
// export class BCard extends ACard {}