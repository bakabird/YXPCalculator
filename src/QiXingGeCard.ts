import { ABuff, BES, BuffFactory, BuffId, ManaBuff, PosionBuff } from "./Buff";
import { Human } from "./Human";
import { ACard, CardName, CardEffect, CardOrder, CardState } from "./Card";


export class StarMoveCard extends ACard {
    cardName: CardName = CardName.StarMove;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 8, 8), me, this.cardName);
        me.MakeStar(1);
        this._lvlMethod(null, null, () => {
            me.MakeStar(2);
        })
    }

}

export class PosStarCard extends ACard {
    cardName: CardName = CardName.PosStar;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 2), this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(2, 3, 4), this.cardName);
        me.AddBuffById(BuffId.StarPower, this._lvlVal(1, 1, 2), this.cardName);
    }

}

export class XingDangCard extends ACard {
    cardName: CardName = CardName.XingDang;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 8, 10), me, this.cardName);
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Shield, this._lvlVal(2, 4, 6), this.cardName);
        }
    }
}

export class XingJiaCard extends ACard {
    cardName: CardName = CardName.XingJia;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 7, 8), me, this.cardName);
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName)
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class GuaZhenCard extends ACard {
    cardName: CardName = CardName.GuaZhen;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4, 7, 10), me, this.cardName);
        me.AddBuffById(BuffId.Gua, 1, this.cardName);
    }

}

export class GuaKunCard extends ACard {
    cardName: CardName = CardName.GuaKun;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, 2, this.cardName);
        me.AddBuffById(BuffId.Gua, this._lvlVal(2, 3, 4), this.cardName);
    }

}

export class GuaXunCard extends ACard {
    cardName: CardName = CardName.GuaXun;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 2), this.cardName);
        me.AddBuffById(BuffId.Gua, this._lvlVal(1, 1, 2), this.cardName);
    }

}

export class PalmThunderCard extends ACard {
    cardName: CardName = CardName.PalmThunder;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(me.Gua(this._lvlVal(2, 5, 8), this._lvlVal(10, 13, 16)),
            me, this.cardName);
    }

}

export class WhiteCraneCard extends ACard {
    cardName: CardName = CardName.WhiteCrane;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(me.Gua(1, 8), me, this.cardName);
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
    }

}

export class FinchTailCard extends ACard {
    cardName: CardName = CardName.FinchTail;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(9, 10, 11), me, this.cardName);
        if (me.GuaRate(0.1)) {
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class MustangCard extends ACard {
    cardName: CardName = CardName.Mustang;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(3, 4, 5), me, this.cardName);
        }
        me.AddBuffById(BuffId.Shield, me.Gua(1, this._lvlVal(10, 12, 14)), this.cardName);
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class SilkRemain extends ACard {
    cardName: CardName = CardName.SilkRemain;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName);
    }
    protected onGetSecondAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddHp(this._lvlVal(2, 4, 6), this.cardName);
        }
    }
}









export class FlyingStarCard extends ACard {
    cardName: CardName = CardName.FlyingStar;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(5, me, this.cardName);
        me.AddBuffById(BuffId.StarPower, this._lvlVal(1, 2, 3), this.cardName);
    }

}

export class XingDianCard extends ACard {
    cardName: CardName = CardName.XingDian;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 10, 14), me, this.cardName);
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.RecoverMana(-1, this.cardName);
        }
    }

}

export class XingLiCard extends ACard {
    cardName: CardName = CardName.XingLi;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(7, 8, 9), me, this.cardName);
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
        }
    }
}

export class GuaGenCard extends ACard {
    cardName: CardName = CardName.GuaGen;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Gua, this._lvlVal(2, 3, 4), this.cardName);
        me.AddMaxHp(this._lvlVal(2, 3, 4), this.cardName);
        me.AddHp(this._lvlVal(2, 3, 4), this.cardName);
    }

}

export class GuaKanCard extends ACard {
    cardName: CardName = CardName.GuaKan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Gua, this._lvlVal(2, 3, 4), this.cardName);
        me.MakeStar(1);
    }

}

export class ThunderCard extends ACard {
    cardName: CardName = CardName.Thunder;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(
            me.Gua(this._lvlVal(6, 9, 12), this._lvlVal(16, 20, 24)),
            me,
            this.cardName
        );
    }
    protected onGetMana(me: Human): number {
        return 1;
    }

}

export class DigRootCard extends ACard {
    cardName: CardName = CardName.DigRoot;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName);
        }
        he.CutMaxHp(me.Gua(this._lvlVal(3, 6, 9), this._lvlVal(13, 17, 21)), this.cardName);
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class OneFootCard extends ACard {
    cardName: CardName = CardName.OneFoot;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(11, 15, 15), me, this.cardName);
        if (me.GuaRate(0.11)) {
            he.AddBuffById(BuffId.Weak, this._lvlVal(1, 1, 2), this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class MindMentalCard extends ACard {
    cardName: CardName = CardName.MindMental;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Mind, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class FallingFlowerCard extends ACard {
    cardName: CardName = CardName.FallingFlower;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(1, 2, 3), this.cardName);
        he.AddBuffById(BuffId.Posion, 1, this.cardName);
    }

}

export class ImbuedRainbowCard extends ACard {
    cardName: CardName = CardName.ImbuedRainbow;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetSecondAct(): CardEffect {
        return (me: Human) => {
            me.AddHp(this._lvlVal(6, 9, 12), this.cardName);
        }
    }

}

export class FeiTaCard extends ACard {
    cardName: CardName = CardName.FeiTa;
    cardState: CardState = CardState.ZhuJi;
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















export class StarAroundMoonCard extends ACard {
    cardName: CardName = CardName.StarAroundMoon;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.StarPower, this._lvlVal(2, 3, 4), this.cardName);
        me.MakeStar(1);
        me.MakeStar(2);
    }

}

export class XingDaCard extends ACard {
    cardName: CardName = CardName.XingDa;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(5, 6, 7), me, this.cardName);
        }
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(5, 7, 9), me, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class GuaDuiCard extends ACard {
    cardName: CardName = CardName.GuaDui;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const manaAdd = this._lvlVal(2, 3, 4);
        me.AddBuffById(BuffId.Gua, this._lvlVal(2, 3, 4), this.cardName);
        me.RecoverMana(manaAdd, this.cardName);
        he.RecoverMana(manaAdd, this.cardName);
    }

}

export class WhiteSnakeCard extends ACard {
    cardName: CardName = CardName.WhiteSnake;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        if (me.GuaRate(0.1)) {
            he.AddBuffById(BuffId.Flaw, this._lvlVal(2, 3, 4), this.cardName);
        }
        he.GetHit(6, me, this.cardName);
    }

}

export class ThunderGuaFormulaCard extends ACard {
    cardName: CardName = CardName.ThunderGuaFormula;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(
            me.Gua(1, this._lvlVal(9, 10, 11)),
            me, this.cardName
        );
        me.AddBuffById(BuffId.Gua, Math.min(me.guaCostNum, this._lvlVal(3, 4, 5)), this.cardName);
    }

}

export class LiangyiArrayCard extends ACard {
    cardName: CardName = CardName.LiangyiArray;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        if (me.CheckBuff(BuffId.Gua, 1)) {
            const guaNum = me.GetBuff(BuffId.Gua).num;
            me.AddBuffById(BuffId.Shield, guaNum * this._lvlVal(1, 2, 2), this.cardName);
            me.AddHp(guaNum * this._lvlVal(1, 1, 2), this.cardName);
        }
    }

}

export class FlowingWaterCard extends ACard {
    cardName: CardName = CardName.FlowingWater;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        let hasDebuff = false;
        he.GetHit(6, me, this.cardName);
        he.EachBuff((buff) => {
            if (ABuff.IsDebuff(buff.id)) {
                hasDebuff = true;
            }
        });
        if (hasDebuff) {
            he.AddBuffById(BuffId.Posion, this._lvlVal(2, 3, 4), this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class QiRecoverCard extends ACard {
    cardName: CardName = CardName.QiRecover;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddMaxHp(this._lvlVal(8, 12, 16), this.cardName);
        me.AddHp(
            me.Gua(this._lvlVal(8, 12, 16), this._lvlVal(18, 22, 26)),
            this.cardName
        );
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class DryTreeCard extends ACard {
    cardName: CardName = CardName.DryTree;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.appendLog("累积回血 " + me.hpEverAdd);
        const exAtk = Math.floor(me.hpEverAdd / this._lvlVal(5, 4, 3));
        he.GetHit(10 + exAtk, me, this.cardName);
    }
    protected onGetMana(me: Human): number {
        return 1;
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

export class HaiDiCard extends ACard {
    cardName: CardName = CardName.HaiDi;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
    }
    protected onGetSecondAct() {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(12, 18, 24), me, this.cardName);
            me.AddBuff(BuffFactory.me.Produce(BuffId.MoveAgain, me, 1), this.cardName);
        };
    }

}


















export class XingFeiCard extends ACard {
    cardName: CardName = CardName.XingFei;
    cardState: CardState = CardState.YuanYing
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

export class XingHuCard extends ACard {
    cardName: CardName = CardName.XingHu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        var i = 3;
        while (i--) {
            he.GetHit(1, me, this.cardName);
        }
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.AddBuffById(BuffId.Weak, this._lvlVal(1, 2, 3), this.cardName);
        }
    }

}

export class SixyaoArrayCard extends ACard {
    cardName: CardName = CardName.SixyaoArray;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Sixyao, this._lvlVal(3, 4, 5), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class GuaLiCard extends ACard {
    cardName: CardName = CardName.GuaLi;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Gua, this._lvlVal(3, 4, 5), this.cardName);
        he.CutMaxHp(this._lvlVal(2, 4, 6), this.cardName);
    }

}

export class StarOrbitCard extends ACard {
    cardName: CardName = CardName.StarOrbit;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(6, 12, 18), this.cardName);
        const guaBuffNum = me.GetBuff(BuffId.Gua)?.num ?? 0;
        if (guaBuffNum > 0) {
            me.AddBuffById(BuffId.StarPower, guaBuffNum, this.cardName);
            me.RecoverMana(guaBuffNum, this.cardName);
            me.RemoveBuff(BuffId.Gua, this.cardName);
        }
    }

}

export class TouchWaterCard extends ACard {
    cardName: CardName = CardName.TouchWater;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 9, 13), me, this.cardName);
        if (me.GuaRate(0.1)) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }

}

export class DoubleThunderCard extends ACard {
    cardName: CardName = CardName.DoubleThunder;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        var i = 2;
        var meGuaNum = me.GetBuff(BuffId.Gua)?.num ?? 0;
        while (i--) {
            he.GetHit(
                me.Gua(1, this._lvlVal(10, 13, 16)),
                me, this.cardName
            );
            if (meGuaNum > 0) {
                me.RecoverMana(1, this.cardName);
                meGuaNum--;
            }
        }
    }

}

export class CountershockMentalCard extends ACard {
    cardName: CardName = CardName.CountershockMental;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Countershock, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class GoldChanCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.GoldChan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(9, 12, 15), this.cardName);
        me.AddHp(this._lvlVal(9, 12, 15), this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
    protected onGetSecondAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Protect, 1, this.cardName);
        };
    }
}

export class BeiGongCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.BeiGong;
    onEffect(me: Human, he: Human) {
        var posionBuff = new PosionBuff();
        posionBuff.init(he, this._lvlVal(2, 3, 4));
        he.AddBuff(posionBuff, this.cardName);
        he.GetBuff(BuffId.Posion).effect(BES.RoundStart);
    }
}










export class WorldCenterMentalCard extends ACard {
    cardName: CardName = CardName.WorldCenterMental;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.StarPower, this._lvlVal(1, 2, 3), this.cardName);
        me.MakeAllStar();
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class XingDuanCard extends ACard {
    cardName: CardName = CardName.XingDuan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(16, 22, 28), me, this.cardName);
    }
    protected onGetStarAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.AddBuffById(BuffId.XingDuan, 1, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class GuaQianCard extends ACard {
    cardName: CardName = CardName.GuaQian;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName);
        me.AddBuffById(BuffId.Gua, this._lvlVal(1, 2, 3), this.cardName);
        if (me.CheckBuff(BuffId.Gua, 3)) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }

}

export class FiveThunderCard extends ACard {
    cardName: CardName = CardName.FiveThunder;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        var i = 5;
        while (i--) {
            if (me.GuaRate(0.3)) {
                he.GetHit(this._lvlVal(8, 10, 12), me, this.cardName);
            }
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
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

export class PurpleManaCard extends ACard {
    cardName: CardName = CardName.PurpleMana;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(2, this.cardName);
        const mana = me.mana;
        const gua = me.GetBuff(BuffId.Gua)?.num ?? 0;
        const star = me.GetBuff(BuffId.StarPower)?.num ?? 0;
        const add = this._lvlVal(3, 5, 7);
        if (mana >= gua && mana >= star) {
            me.RecoverMana(add, this.cardName);
        } else if (gua >= mana && gua >= star) {
            me.AddBuffById(BuffId.Gua, add, this.cardName);
        } else {
            me.AddBuffById(BuffId.StarPower, add, this.cardName);
        }
    }

}

export var QiXing_LIST = [
    StarMoveCard, PosStarCard, XingDangCard, XingJiaCard, GuaZhenCard, GuaKunCard, GuaXunCard,
    PalmThunderCard, WhiteCraneCard, FinchTailCard, MustangCard, SilkRemain,

    FlyingStarCard, XingDianCard, XingLiCard, GuaGenCard, GuaKanCard, ThunderCard,
    DigRootCard, OneFootCard, MindMentalCard, FallingFlowerCard, ImbuedRainbowCard,
    FeiTaCard,

    StarAroundMoonCard, XingDaCard, GuaDuiCard, WhiteSnakeCard, ThunderGuaFormulaCard,
    LiangyiArrayCard, FlowingWaterCard, QiRecoverCard, DryTreeCard, TangLangCard,
    HaiDiCard,

    XingFeiCard, XingHuCard, SixyaoArrayCard, GuaLiCard, StarOrbitCard, TouchWaterCard,
    DoubleThunderCard, CountershockMentalCard, GoldChanCard, BeiGongCard,

    WorldCenterMentalCard, XingDuanCard, GuaQianCard, FiveThunderCard, QiTunCard,
    HuangQueCard, MeiKaiCard, PurpleManaCard
]