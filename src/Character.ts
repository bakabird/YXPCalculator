import { ABuff, BuffFactory, BuffId } from "./Buff";
import { ACard, CardEffect, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { GenPush2Arr, Keeping, Mana } from "./decorator";

// 牧逸风
export var DuYiFeng_LIST = []
// 炎雪
export var YanXue_LIST = []
// 龙瑶
export var LongYao_LIST = []
// 林小月
export var Linxiaoyue_LIST = []
// 陆剑心
export var LuJianxin_LIST = []
// 谭舒雁
export var TanShuYan_LIST = []
// 炎尘
export var YanChen_LIST = []
// 曜灵
export var YaoLing_LIST = []
// 姜袭明
export var JiangXiMing_LIST = []
// 吴策
export var WuCe_LIST = []
// 吾行之
export var WuXingzhi_LIST = []
// 杜伶鸳
export var DuLingYuan_LIST = []
// 花沁蕊
export var HuaQinrui_LIST = []
// 慕虎
export var MuHu_LIST = []
// 南宫生
export var NanGongSheng_LIST = []

var TanShuYan = GenPush2Arr(TanShuYan_LIST)
var YanXue = GenPush2Arr(YanXue_LIST)
var DuYiFeng = GenPush2Arr(DuYiFeng_LIST)
var LongYao = GenPush2Arr(LongYao_LIST)
var LinXiaoYue = GenPush2Arr(Linxiaoyue_LIST)
var LuJianXin = GenPush2Arr(LuJianxin_LIST)
var YanChen = GenPush2Arr(YanChen_LIST)
var YaoLing = GenPush2Arr(YaoLing_LIST)
var JiangXiMing = GenPush2Arr(JiangXiMing_LIST)
var WuCe = GenPush2Arr(WuCe_LIST)
var WuXingzhi = GenPush2Arr(WuXingzhi_LIST)
var DuLingYuan = GenPush2Arr(DuLingYuan_LIST)
var HuaQinrui = GenPush2Arr(HuaQinrui_LIST)
var MuHu = GenPush2Arr(MuHu_LIST)
var NanGongSheng = GenPush2Arr(NanGongSheng_LIST)

@DuYiFeng
export class YunQuanDaoCha extends ACard {
    cardName: CardName = CardName.YunQuanDaoCha;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
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

@YanXue
export class KuangJianYanWu extends ACard {
    cardName: CardName = CardName.KuangJianYanWu;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 12, 18), me, this.cardName);
        var csBuff = me.GetBuff(BuffId.CrazySword);
        if (csBuff) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }

}

@LongYao
export class YunHuanYuCard extends ACard {
    cardName: CardName = CardName.YunHuanYu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        let rest = 3;
        while (rest--) {
            he.GetHit(this._lvlVal(3, 4, 5), me, this.cardName);
        }
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Huifu, this._lvlVal(2,3,4), this.cardName);
        }
    }

}

@LongYao
@Mana(1)
export class JiuXiaoLingLongZhuoCard extends ACard {
    cardName: CardName = CardName.JiuXiaoLingLongZhuo;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, 5, this.cardName);
        me.AddBuffById(BuffId.Protect, this._lvlVal(1,2,3), this.cardName);
        me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
    }

}

@LinXiaoYue
export class YunMaoZhuaCard extends ACard {
    cardName: CardName = CardName.YunMaoZhua;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let rest = 2;
        while (rest--) {
            me.AddBuffById(BuffId.Pierce, 1, this.cardName);
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName);
        }
    }

}

@LinXiaoYue
export class LingMaoLuanJianCard extends ACard {
    cardName: CardName = CardName.LingMaoLuanJian;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        let rest = this._lvlVal(2, 3, 4) + Math.min(3, me.NumOf(BuffId.Record_ShouPai));
        while(rest--) {
            he.GetHit(2, me, this.cardName);
        }
    }

}

@LuJianXin
export class ChengXinJianPeiCard extends ACard {
    cardName: CardName = CardName.ChengXinJianPei;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(6, me, this.cardName);
    }
}

@YanChen
@Keeping
export class WuJiGuaPanCard extends ACard {
    cardName: CardName = CardName.WuJiGuaPan; 
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Gua, this._lvlVal(0, 2, 4), this.cardName);
        me.AddBuffById(BuffId.WujiGuapan, 1, this.cardName);
    }

}

@YanChen
export class WengZhongZhuoBieCard extends ACard {
    cardName: CardName = CardName.WengZhongZhuoBie;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        var debuffNum = 0;
        he.EachBuff((buff) => {
            if(ABuff.IsDebuff(buff.id) && buff.num > 0) {
                debuffNum += buff.num;
            }
        });
        he.GetHit(9 + this._lvlVal(2, 3, 4) * debuffNum, me, this.cardName);
    }

}

@YanChen
export class KuangLeiDianShanCard extends ACard {
    cardName: CardName = CardName.KuangLeiDianShan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        let state = "searching";
        let firstCard: ACard;
        let nextCard: ACard;
        he.AddBuffById(BuffId.Flaw, this._lvlVal(1, 2, 3), this.cardName);
        me.CardList.EachCardsL2R((card) => {
            if(!firstCard) {
                firstCard = card;
            }
            if(card == this) {
                state = "justNext"
            } else if (state == "justNext") {
                nextCard = card;
                state = "end"
            }
        });
        if(!nextCard) {
            nextCard = firstCard;
        }
        if (nextCard.cardName.includes("雷")) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
        me.appendLog(this.cardName, `【${me.name}】使用了【${this.cardName}】，下张牌是 ${nextCard.cardName}，${nextCard.cardName.includes("雷") ? "获得了" : "没有获得"}额外行动`);
    }

}

@YaoLing
export class DengYanFeiWuCard extends ACard {
    cardName: CardName = CardName.DengYanFeiWu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(3, 4, 5), me, this.cardName);
        he.AddBuffById(BuffId.Posion, me.Gua(this._lvlVal(1, 2, 3), this._lvlVal(3, 4, 5)), this.cardName);
    }

}

@YaoLing
export class XuanDengZhanGuaCard extends ACard {
    cardName: CardName = CardName.XuanDengZhanGua;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Gua, this._lvlVal(3, 4, 5), this.cardName)
        he.CutHp(this._lvlVal(4, 5, 6), this.cardName)
        he.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
    }

}

@JiangXiMing
export class XingBaoShuCard extends ACard {
    cardName: CardName = CardName.XingBaoShu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        let hurt = this._lvlVal(8, 10, 12);
        if(me.NumOf(BuffId.StarPower) > 0) {
            me.AddBuffById(BuffId.StarPower, -1, this.cardName);
            hurt += this._lvlVal(8, 10, 13);
        }
        he.GetHit(hurt, me, this.cardName);
    }
}

@JiangXiMing
export class QiXingDingHunCard extends ACard {
    cardName: CardName = CardName.QiXingDingHun;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.CutHp(this._lvlVal(4, 9, 14), this.cardName);
        he.AddBuffById(BuffId.QiXingDingHun, 1, this.cardName);
    }

}

@WuCe
export class SuanWuYiCeCard extends ACard {
    cardName: CardName = CardName.SuanWuYiCe;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(1, this.cardName);
        me.AddBuffById(BuffId.Gua, 1, this.cardName);
        me.MakeStar(1);
        if(this._lvlVal(false, true, true)) {
            me.AddBuffById(BuffId.StarPower, 1 , this.cardName);
        }
        if(this._lvlVal(false, false, true)) {
            me.AddMaxHp(4, this.cardName);
            me.AddHp(4, this.cardName);
        }
    }

}

@WuCe
@Keeping
export class XingYueZheShanCard extends ACard {
    cardName: CardName = CardName.XingYueZheShan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        const mana = me.mana;
        const starPower = me.NumOf(BuffId.StarPower);
        if(mana >= 1) {
            me.AddBuffById(BuffId.StarPower, this._lvlVal(1,2,3), this.cardName);
        }
        if(starPower >= 3) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
        me.AddBuffById(BuffId.XingYueZheShan, 1, this.cardName);
    }

}

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

@WuXingzhi
export class WuXingChuanChengCard extends ACard {
    cardName: CardName = CardName.WuXingChuanCheng;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
    }

}

@DuLingYuan
export class ShuangYuanNiKeCard extends ACard {
    cardName: CardName = CardName.ShuangYuanNiKe;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(3, 5, 7), this.cardName);
        const list = me.CardList;
        list.PosBack();
        const pre = list.GetCur()
        list.PosShift()
        list.PosShift()
        const next = list.GetCur()
        list.PosBack()
        if (pre.amIWuxingNi(next)) {
            next.effectCardWuxing(me, this.cardName);
            me.AddBuffById(BuffId.MoveAgain, 1 , this.cardName);
        }
    }

}


@HuaQinrui
export class MuLingTaoHuaYinCard extends ACard {
    cardName: CardName = CardName.MuLingTaoHuaYin;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let rest = this._lvlVal(2,3,4);
        while(rest--) {
            he.GetHit(1, me, this.cardName);
        }
        me.RecoverMana(this._lvlVal(2,3,4), this.cardName);
        me.AddBuffById(BuffId.Mu, 1, this.cardName);
    }

}

@Mana(1)
@Keeping
@HuaQinrui
export class ShuiLingChunYuCard extends ACard {
    cardName: CardName = CardName.ShuiLingChunYu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddMaxHp(this._lvlVal(6, 12, 18), this.cardName);
        me.AddHp(this._lvlVal(6, 12, 18), this.cardName);
        me.AddBuffById(BuffId.ShuiLingChunYu, 1, this.cardName);
    }
}

@MuHu
@Keeping
export class KunWuJinHuanCard extends ACard {
    cardName: CardName = CardName.KunWuJinHuan;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Tu, 1, this.cardName)
        me.AddBuffById(BuffId.Jin, 1, this.cardName)
        me.AddBuffById(BuffId.KunWuJinHuan, this._lvlVal(2, 3, 4), this.cardName)
    }

}

@MuHu
export class JinLingGangJingCard extends ACard {
    cardName: CardName = CardName.JinLingGangJing;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        const sharp = me.NumOf(BuffId.Sharp);
        let hurt = this._lvlVal(6, 12, 18);
        if (me.isJin) {
            hurt += sharp;
        }
        me.AddBuffById(BuffId.BanSharp, 1, this.cardName);
        he.GetHit(hurt, me, this.cardName);
        me.AddBuffById(BuffId.BanSharp, -1, this.cardName);
    }

}

@MuHu
export class TuLingShanBengCard extends ACard {
    cardName: CardName = CardName.TuLingShanBeng;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        const meShiled = me.NumOf(BuffId.Shield)
        let hurt = this._lvlVal(8, 15, 15);
        if(me.isTu && meShiled > 1) {
            const cut = Math.floor(meShiled / 2);
            hurt += cut;
            me.AddBuffById(BuffId.Shield, -cut, this.cardName);
        }
        he.GetHit(hurt, me, this.cardName);
    }

}
// export class BCard extends ACard {}
// export class BCard extends ACard {}