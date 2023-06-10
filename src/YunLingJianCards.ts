import { BuffId } from "./Buff";
import { ACard, CardEffect, CardName, CardState } from "./Card";
import { Human } from "./Human";

export class YunTanYunCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.YunTanYun;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName);
    }
}

export class YunFeiCiCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.YunFeiCi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 6, 7), me, this.cardName);
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(3, 5, 7), me, this.cardName);
        }
    }
}

export class YunHouTuCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.YunHouTu;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4, 6, 8), me, this.cardName)
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Shield, this._lvlVal(4, 6, 8), this.cardName);
        }
    }

}

export class LightSwordCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.LightSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(4, me, this.cardName);
        me.RecoverMana(this._lvlVal(1, 2, 3));
    }

}

export class ManaProtectMeCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.ManaProtectMe;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 3));
        me.AddBuffById(BuffId.Shield, 5, this.cardName);
    }

}

export class ManaInsideCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.ManaInside;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4));
        me.AddBuffById(BuffId.Pierce, 1, this.cardName)
    }

}

export class HugeTigerManaSwordCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.HugeTigerManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(10, 13, 16), me, this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class ShockThunderSwordCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.ShockThunderSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 6, 7), me, this.cardName);
    }
    protected onGetHurtAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(6, 8, 10), me, this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class SwordChopCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.SwordChop;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4, 5, 6), me, this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2, 3, 4), this.cardName);
    }

}

export class SwordBlockCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.SwordBlock;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(4, 5, 6), this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2, 3, 4), this.cardName);
    }

}

export class FlyingToothSwordCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.FlyingToothSword;
    protected onEffect(me: Human, he: Human) {
        const smBuff = me.GetBuff(BuffId.SwordMenaing);
        he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
        if (smBuff) {
            me.AddBuff(smBuff, this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class SuddenWindSwordCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.SuddenWindSword;
    protected onEffect(me: Human, he: Human) {
        for (let index = 0; index < 2; index++) {
            he.GetHit(this._lvlVal(3, 4, 6), me, this.cardName);
        }
    }

}







export class YunHuiShouCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.YunHuiShou;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(8, 11, 14), this.cardName);
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddHp(this._lvlVal(3, 5, 7), this.cardName);
        }
    }
}

export class YunJiYiCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.YunJiYi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 8, 10), me, this.cardName);
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2, 3, 4), this.cardName);
        }
    }
}

export class YunWuFengCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.YunWuFeng;
    protected onEffect(me: Human, he: Human) {

    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            he.GetHit(this._lvlVal(9, 13, 17), me, this.cardName);
        }
    }

}


export class ToManaFormulaCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.ToManaFormula;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(3, 4, 5));
    }

}

export class QiDrawingSwordCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.QiDrawingSword;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4));
        if (me.mana > this._lvlVal(2, 3, 4)) {
            he.GetHit(2, me, this.cardName)
            he.GetHit(2, me, this.cardName)
        }
    }

}

export class CondensationFormulaCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.CondensationFormula;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(1, this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(3, 4, 5), this.cardName);
    }

}

export class GiantWhaleSwordCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.GiantWhaleSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(16, 20, 24), me, this.cardName);
    }
    protected onGetMana(): number {
        return 2;
    }
}

export class LingxiSwordArray extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.LingxiSwordArray;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(9, 14, 19), this.cardName);
        const smBuff = me.GetBuff(BuffId.SwordMenaing);
        if (smBuff) {
            const num = smBuff.num;
            me.RemoveBuff(BuffId.SwordMenaing, this.cardName);
            me.RecoverMana(num, this.cardName);
        }
    }

}

export class DishaSwordCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.DishaSword;
    private _tmp: number = 0;
    protected onEffect(me: Human, he: Human) {
        this._tmp = he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
    }
    protected onGetHurtAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            if (this._tmp > 0) {
                me.AddBuffById(BuffId.Shield, this._tmp, this.cardName);
                this._tmp = 0;
            }
        }
    }
    protected onGetMana(): number {
        return 1;
    }

}

export class XingyiSwordCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.XingyiSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
    }
    protected onGetHurtAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(3, 4, 5), this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class CrazyMoveOneCard extends ACard {
    cardState: CardState = CardState.ZhuJi;
    cardName: CardName = CardName.CrazyMoveOne;
    protected onEffect(me: Human, he: Human) {
        const cNum = me.GetBuff(BuffId.CrazySword)?.num ?? 0;
        he.GetHit(this._lvlVal(5, 8, 10) + cNum * this._lvlVal(2, 3, 5), me, this.cardName);
    }

}









export class YunSoftMentalCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.YunSoftMental;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.YunSoft, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class YunWuliCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.YunWuli;
    protected onEffect(me: Human, he: Human) {
        for (let i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(4, 6, 8), me, this.cardName);
        }
    }
    protected onGetYunAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Pierce, this._lvlVal(1, 1, 2), this.cardName);
        }
    }
}

export class YunPointStarCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.YunPointStar;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        he.GetHit(me.mana, me, this.cardName);
    }

}

export class YunHuilingCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.YunHuiling;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(7, 11, 15), me, this.cardName);
    }
    protected onGetYunAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            const yjBuff = me.GetBuff(BuffId.YunJian);
            if (yjBuff) {
                me.RecoverMana(yjBuff.num, this.cardName);
            }
        }
    }
}

export class CloudDanceFormula extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.CloudDanceFormula;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Mana, this._lvlVal(2, 3, 4), this.cardName)
        me.AddBuffById(BuffId.Shield, this._lvlVal(2, 3, 4), this.cardName)
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(2, 3, 4), this.cardName)
    }

}


export class DarkCrowManaSwordCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.DarkCrowManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(5, me, this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(2, 3, 4) * me.mana, this.cardName);
    }

}

export class BreakingQiSwordCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.BreakingQiSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(11, 15, 17), me, this.cardName);
    }
    protected onGetHurtAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            he.RecoverMana(-this._lvlVal(1, 1, 2), this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class GiantRocManaSwordCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.GiantRocManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(9, 12, 15), me, this.cardName)
        if (me.mana > 0) {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }
    protected onGetMana(): number {
        return 2;
    }
}

export class ReflexiveSwordCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.ReflexiveSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(10, 13, 16), me, this.cardName);
    }
    protected onGetHurtAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.InternalShield, this._lvlVal(6, 9, 12), this.cardName);
        }
    }
}

export class MirrorFlowerSwordArrayCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.MirrorFlowerSwordArray;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(3, 5, 8), this.cardName);
        he.GetHit(me.GetBuff(BuffId.Shield)?.num ?? 0, me, this.cardName);
    }

}

export class ThreePeakSwordCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.ThreePeakSword;
    protected onEffect(me: Human, he: Human) {
        for (let index = 0; index < 3; index++) {
            he.GetHit(this._lvlVal(3, 4, 5), me, this.cardName);
        }
    }

}







export class YunFlashingWindCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.YunFlashingWind;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4, 8, 12), me, this.cardName);
    }
    protected onGetYunAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }
}

export class YunMoonShadowCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.YunMoonShadow;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(1, 2, 3), this.cardName);
    }
    protected onGetYunAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Power, this._lvlVal(2, 3, 4), this.cardName);
        }
    }
}

export class ManaGatherMentalCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.ManaGatherMental;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 1, 3), this.cardName);
        this._lvlMethod(() => {
            me.AddBuffById(BuffId.ManaGatherSlow, 1, this.cardName);
        }, () => {
            me.AddBuffById(BuffId.ManaGather, 1, this.cardName);
        }, () => {
            me.AddBuffById(BuffId.ManaGather, 1, this.cardName);
        })
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class BNLJFormulaCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.BNLJFormula;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 3, 3), this.cardName);
        me.AddBuffById(BuffId.BNLJ, this._lvlVal(1, 1, 2), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

export class EgretManaSwordCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.EgretManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(5 + me.mana * this._lvlVal(2, 3, 4), me, this.cardName);
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class GiantKunManaSwordCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.GiantKunManaSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(10, 13, 16), me, this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(10, 13, 16), this.cardName);
        me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
    }
    protected onGetMana(): number {
        return 3;
    }
}

export class InspirationSwordCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.InspirationSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(8, 12, 16), me, this.cardName);
    }
    protected onGetHurtAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.SwordMenaing, Math.min(this._lvlVal(8, 12, 16), me.mana), this.cardName);
        }
    }
}

export class LiuyunChaoticSwordCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.LiuyunChaoticSword;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < this._lvlVal(4, 5, 6); i++) {
            he.GetHit(2, me, this.cardName);
        }
    }
    protected onGetMana(): number {
        return 1;
    }
}

export class WaterMoonSwordArrayCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.WaterMoonSwordArray;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(10, 14, 18), this.cardName);
        me.AddBuffById(BuffId.WaterMoon, this._lvlVal(3, 4, 5), this.cardName);
    }

}

export class CrazyMoveTwoCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.CrazyMoveTwo;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(4, 6, 9), me, this.cardName);
        var csBuff = me.GetBuff(BuffId.CrazySword);
        if (csBuff) {
            for (var i = 0; i < csBuff.num; i++) {
                he.GetHit(this._lvlVal(4, 6, 9), me, this.cardName);
            }
        }
    }

}

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




export class YunYouLongCard extends ACard {
    cardState: CardState = CardState.HuaShen;
    cardName: CardName = CardName.YunYouLong;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < this._lvlVal(2, 3, 4); i++) {
            he.GetHit(2, me, this.cardName);
        }
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.Shield, this._lvlVal(3, 5, 7), this.cardName);
        }
    }
    protected onGetHurtAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }
}

export class YunLingboCard extends ACard {
    cardName: CardName = CardName.YunLingbo;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < this._lvlVal(2, 3, 4); i++) {
            he.GetHit(2, me, this.cardName);
        }
    }
    protected onGetYunAct(): CardEffect {
        return (me: Human, he: Human) => {
            if (me.CheckBuff(BuffId.YunJian, 1)) {
                me.AddBuffById(BuffId.Shield, this._lvlVal(3, 4, 5) * me.GetBuff(BuffId.YunJian).num, this.cardName);
            }
        }
    }

}

export class FlyingSpiritFlashingShadowSwordCard extends ACard {
    cardName: CardName = CardName.FlyingSpiritFlashingShadowSword;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        let hitNum = 0;
        for (var i = 0; i < this._lvlVal(4, 5, 6); i++) {
            if (he.GetHit(1, me, this.cardName) > 0) {
                hitNum++;
            }
        }
        me.RecoverMana(hitNum);
    }
}

export class TenThousandWayManaSwordCard extends ACard {
    cardName: CardName = CardName.TenThousandWayManaSword;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        var dmg = 5;
        dmg += me.mana * this._lvlVal(5, 6, 7);
        me.RecoverMana(-me.mana, this.cardName);
        he.GetHit(dmg, me, this.cardName);
    }

}

export class SwordMenaingStirringCard extends ACard {
    cardName: CardName = CardName.SwordMenaingStirring;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        const smBuff = me.GetBuff(BuffId.SwordMenaing)
        if (smBuff) {
            const add = Math.floor(smBuff.num * this._lvlVal(0.8, 1, 1.2));
            if (add > 0) {
                me.AddBuffById(BuffId.SwordMenaing, add, this.cardName);
            }
        }
    }
    protected onGetMana(): number {
        return 1;
    }

}

export class YukongSwordArrayCard extends ACard {
    cardName: CardName = CardName.YukongSwordArray;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(6, 12, 18), this.cardName);
        me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
    }
    protected onGetMana(me: Human): number {
        if (me.CheckBuff(BuffId.Shield, 1)) {
            return 0;
        }
        return 1;
    }
}


export class ChainSwordArrayCard extends ACard {
    cardState: CardState = CardState.HuaShen;
    cardName: CardName = CardName.ChainSwordArray;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(1, 5, 10), this.cardName);
        let start = false;
        let end = false
        me.CardList.EachCardsR2L(card => {
            if (end) return;
            if (start) {
                if (card.cardName.endsWith("剑阵")) {
                    card.effect(me, he);
                    card.decUseNum();
                    end = true;
                }
            }
            if (card == this) {
                start = true;
            }
        })
    }

}

export class CrazyMoveZeroCard extends ACard {
    cardName: CardName = CardName.CrazyMoveZero;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.CrazyMoveZero, this._lvlVal(30, 45, 60), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}



export var JianZong_LIST = [
    YunTanYunCard, YunFeiCiCard, YunHouTuCard, LightSwordCard, ManaProtectMeCard,
    ManaInsideCard, HugeTigerManaSwordCard, ShockThunderSwordCard, SwordChopCard,
    SwordBlockCard, FlyingToothSwordCard, SuddenWindSwordCard,

    YunHuiShouCard, YunJiYiCard, YunWuFengCard, ToManaFormulaCard,
    QiDrawingSwordCard, CondensationFormulaCard, GiantWhaleSwordCard, LingxiSwordArray,
    DishaSwordCard, XingyiSwordCard, CrazyMoveOneCard,

    YunSoftMentalCard, YunWuliCard, YunPointStarCard, YunHuilingCard, CloudDanceFormula,
    DarkCrowManaSwordCard, BreakingQiSwordCard, GiantRocManaSwordCard, ReflexiveSwordCard,
    MirrorFlowerSwordArrayCard, ThreePeakSwordCard,

    YunFlashingWindCard, YunMoonShadowCard, ManaGatherMentalCard, BNLJFormulaCard,
    EgretManaSwordCard, GiantKunManaSwordCard, InspirationSwordCard, LiuyunChaoticSwordCard,
    WaterMoonSwordArrayCard, CrazyMoveTwoCard, YunCrashSnowCard,

    YunYouLongCard, YunLingboCard, FlyingSpiritFlashingShadowSwordCard,
    TenThousandWayManaSwordCard, SwordMenaingStirringCard, YukongSwordArrayCard,
    ChainSwordArrayCard, CrazyMoveZeroCard,
]