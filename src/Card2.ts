import { BuffId } from "./Buff";
import { ACard, CardName } from "./Card";
import { Human } from "./Human";

export class ToManaFormulaCard extends ACard {
    cardName: CardName = CardName.ToManaFormula;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(3, 4, 5));
    }

}

export class QiDrawingSwordCard extends ACard {
    cardName: CardName = CardName.QiDrawingSword;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2,3,4));
        if(me.mana > this._lvlVal(2,3,4)) {
            he.GetHit(2, me, this.cardName)
            he.GetHit(2, me, this.cardName)
        }
    }

}

export class CondensationFormulaCard extends ACard {
    cardName: CardName = CardName.CondensationFormula;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(1, this.cardName);
        me.AddBuffById(BuffId.SwordMenaing, this._lvlVal(3,4,5), this.cardName);
    }

}

export class GiantWhaleSwordCard extends ACard {
    cardName: CardName = CardName.GiantWhaleSword;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(16, 20, 24), me, this.cardName);
    }
    protected onGetMana(): number {
        return 2;
    }
}

export class LingxiSwordArray extends ACard {
    cardName: CardName = CardName.LingxiSwordArray;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(9, 14, 19), this.cardName);
        const smBuff = me.GetBuff(BuffId.SwordMenaing);
        if(smBuff) {
            const num = smBuff.num;
            me.RemoveBuff(BuffId.SwordMenaing, this.cardName);
            me.RecoverMana(num, this.cardName);
        }
    }

}

export class DishaSwordCard extends ACard {
    cardName: CardName = CardName.DishaSword;
    private _tmp : number = 0;
    protected onEffect(me: Human, he: Human) {
        this._tmp = he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
    }
    protected onGetHurtAct(): (me: Human, he: Human) => void {
        return (me: Human, he: Human) => {
            if(this._tmp > 0) {
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

export class CrazySword_OnePieceCard extends ACard {
    cardName: CardName = CardName.CrazySword_OnePiece;
    protected onEffect(me: Human, he: Human) {
        const cNum = me.GetBuff(BuffId.CrazySword)?.num ?? 0;
        he.GetHit(this._lvlVal(5, 8, 10) + cNum * this._lvlVal(2,3,5), me, this.cardName);
    }

}