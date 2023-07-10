import { ABuff, BuffId, DuanChang } from "./Buff";
import { ACard, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { GenPush2Arr, Keeping } from "./decorator";

export var Qin_LIST = []

var Qin = GenPush2Arr(Qin_LIST);


/*
CardState.LianQi
*/

@Qin
export class PoYingCard extends ACard {
    cardName: CardName = CardName.PoYing;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Pierce, 1, this.cardName);
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName);
    }

}

@Qin
export class TuXingQu extends ACard {
    cardName: CardName = CardName.TuXingQu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(14, 20, 26)
        me.AddBuffById(BuffId.Shield, val, this.cardName);
        he.AddBuffById(BuffId.Shield, val, this.cardName);
    }
}

@Qin
@Keeping
export class XiaoYaoQuCard extends ACard {
    cardName: CardName = CardName.XiaoYaoQu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(4, 6, 9)
        me.AddBuffById(BuffId.Xiaoyao, val, this.cardName)
        he.AddBuffById(BuffId.Xiaoyao, val, this.cardName)
    }

}


/*
CardState.ZhuJi
*/

@Qin
@Keeping
export class CiNianQuCard extends ACard {
    cardName: CardName = CardName.CiNianQu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        // Nothings...
    }
}

@Qin
@Keeping
export class HuanYinQuCard extends ACard {
    cardName: CardName = CardName.HuanYinQu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Huanyin, this._lvlVal(3, 5, 7), this.cardName);
        he.AddBuffById(BuffId.Huanyin, this._lvlVal(3, 5, 7), this.cardName);
    }
}

@Qin
export class TianLingQuCard extends ACard {
    cardName: CardName = CardName.TianLingQu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(3, 5, 7);
        me.RecoverMana(val, this.cardName)
        he.RecoverMana(val, this.cardName)
    }
}
// export class BCard extends ACard {}
// export class BCard extends ACard {}


/*
CardState.JinDan
*/

@Qin
@Keeping
export class DuanChangQuCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.DuanChangQu;
    onEffect(me: Human, he: Human) {
        var meBuff = new DuanChang();
        var heBuff = new DuanChang();
        var val = this._lvlVal(1, 2, 3);
        meBuff.init(me, val);
        heBuff.init(he, val);
        me.AddBuff(meBuff, this.cardName);
        he.AddBuff(heBuff, this.cardName);
    }
}

@Qin
@Keeping
export class KuangWuQuCard extends ACard {
    cardName: CardName = CardName.KuangWuQu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Kuangwu, this._lvlVal(2, 4, 6), this.cardName);
        he.AddBuffById(BuffId.Kuangwu, this._lvlVal(2, 4, 6), this.cardName);
    }

}

@Qin
export class LunZhiLianYinCard extends ACard {
    cardName: CardName = CardName.LunZhiLianYin;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(2, 3, 4);
        let rest = 3;
        while (rest--) {
            me.AddBuffById(BuffId.Pierce, 1, this.cardName);
            he.GetHit(val, me, this.cardName);
        }
    }
}
// export class BCard extends ACard {}
// export class BCard extends ACard {}

/*
CardState.YuanYing
*/

@Qin
@Keeping
export class HuiChunQuCard extends ACard {
    cardName: CardName = CardName.HuiChunQu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Huichun, this._lvlVal(3, 5, 7), this.cardName);
        he.AddBuffById(BuffId.Huichun, this._lvlVal(3, 5, 7), this.cardName);
    }
}

@Qin
export class JiuShaPoLingQuCard extends ACard {
    cardName: CardName = CardName.JiuShaPoLingQu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(-this._lvlVal(3, 5, 7), this.cardName)
        he.RecoverMana(-this._lvlVal(3, 5, 7), this.cardName)
    }

}
// export class BCard extends ACard {}

@Qin
export class TongXinQuCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.TongXinQu;
    protected onEffect(me: Human, he: Human) {
        me.EachBuff((buff) => {
            if (ABuff.IsDebuff(buff.id)) {
                he.AddBuffById(buff.id, buff.num, this.cardName);
            }
        });
    }
    protected onGetMana(): number {
        return this._lvlVal(2, 1, 0);
    }
}



/*
CardState.HuaShen
*/

@Qin
@Keeping
export class TianYinKunXianQuCard extends ACard {
    cardName: CardName = CardName.TianYinKunXianQu;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Tianyinkunxian, 1, this.cardName);
        he.AddBuffById(BuffId.Tianyinkunxian, 1, this.cardName);
    }
    protected onGetMana(me: Human): number {
        return this._lvlVal(2, 1, 0);
    }
}


@Qin
@Keeping
export class YouXuLuanXinQuCard extends ACard {
    cardName: CardName = CardName.YouXuLuanXinQu;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Youxuluaxin, this._lvlVal(4, 5, 6), this.cardName)
        he.AddBuffById(BuffId.Youxuluaxin, this._lvlVal(4, 5, 6), this.cardName)
    }

}

@Qin
export class ZhuanXianHeDiaoCard extends ACard {
    cardName: CardName = CardName.ZhuanXianHeDiao;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 4, 6), this.cardName);
        if (me.CheckBuff(BuffId.Record_QinCardUseTime, 1)) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        } else {
            me.CardList.PosShift()
            if (me.CardList.GetCur().isQin) {
                me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
            }
            me.CardList.PosBack()
        }
    }

}
// export class BCard extends ACard {}
// export class BCard extends ACard {}

