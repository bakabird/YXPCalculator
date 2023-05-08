import { BuffId, HuangQueBuff } from "./Buff";
import { ACard, CardEffect, CardName, CardState } from "./Card";
import { Human } from "./Human";

//#region 炼气

export class Mu_yinCard extends ACard {
    cardName: CardName = CardName.Mu_yin;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(1, 2, 3), this.cardName)
        me.AddHp(4, this.cardName)
        me.AddBuffById(BuffId.Mu, 1, this.cardName);
    }

}

export class Mu_yaCard extends ACard {
    cardName: CardName = CardName.Mu_ya;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        for (var i = 0; i < this._lvlVal(2, 3, 4); i++) {
            he.GetHit(3, me, this.cardName)
        }
    }
    protected onGetMuAct(): CardEffect {
        return (me: Human, he: Human) => {
            me.AddHp(5, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class Huo_yinCard extends ACard {
    cardName: CardName = CardName.Huo_yin;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.CutHp(3, this.cardName);
        he.CutMaxHp(3, this.cardName);
        me.RecoverMana(this._lvlVal(1, 2, 3));
        me.AddBuffById(BuffId.Huo, 1, this.cardName);
    }

}
export class Huo_cuanCard extends ACard {
    cardName: CardName = CardName.Huo_cuan;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(9, 11, 13), me, this.cardName);
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            he.GetHit(this._lvlVal(2, 3, 4), me, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
export class Tu_yinCard extends ACard {
    cardName: CardName = CardName.Tu_yin;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(3, 5, 7), me, this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(4, 6, 8), this.cardName);
        me.AddBuffById(BuffId.Tu, 1, this.cardName);
    }
}
export class Tu_suiCard extends ACard {
    cardName: CardName = CardName.Tu_sui;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 7, 8), me, this.cardName);
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            if (me.CheckBuff(BuffId.Shield, 1) || he.CheckBuff(BuffId.Shield, 1)) {
                he.GetHit(this._lvlVal(3, 5, 7), me, this.cardName);
            }
        }
    }
}

export class Jin_yinCard extends ACard {
    cardName: CardName = CardName.Jin_yin;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName)
        me.AddBuffById(BuffId.Jin, 1, this.cardName);
    }
}
export class WuxingcCard extends ACard {
    cardName: CardName = CardName.Wuxingc;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        let add = 0;
        if (me.isMu || me.isJin || me.isShui || me.isHuo || me.isTu) {
            add = this._lvlVal(3, 6, 9);
        }
        he.GetHit(5 + add, me, this.cardName);
    }
}
export class Shui_yinCard extends ACard {
    cardName: CardName = CardName.Shui_yin;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName)
        me.AddBuffById(BuffId.Shui, 1, this.cardName);
    }
}
export class Shui_taoCard extends ACard {
    cardName: CardName = CardName.Shui_tao;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(10, 13, 16), me, this.cardName);
        me.AddBuffById(BuffId.WaterFlow, 1, this.cardName);
    }
    protected onGetMana(me: Human): number {
        return 2;
    }
}
export class Jin_zhenCard extends ACard {
    cardName: CardName = CardName.Jin_zhen;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(6, 7, 8), me, this.cardName);
    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Sharp, this._lvlVal(2, 4, 6), this.cardName);
        }
    }
}


//#endregion


//#region 筑基期
export class Mu_fusuCard extends ACard {
    cardName: CardName = CardName.Mu_fusu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4));
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            const mePower = me.GetBuff(BuffId.Power)
            const mePowerNum = mePower ? mePower.num : 0;
            me.AddHp(this._lvlVal(3, 4, 6) + mePowerNum, this.cardName);
        }
    }
}

export class Mu_shuyingCard extends ACard {
    cardName: CardName = CardName.Mu_shuying;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let count = this._lvlVal(2, 3, 4);
        while (count--) {
            he.GetHit(3, me, this.cardName)
        }
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Power, 1, this.cardName)
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class Huo_juyanCard extends ACard {
    cardName: CardName = CardName.Huo_juyan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4));
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            he.CutHp(this._lvlVal(3, 4, 6), this.cardName);
            he.CutMaxHp(this._lvlVal(3, 4, 6), this.cardName)
        }
    }
}

export class Huo_chiyanCard extends ACard {
    cardName: CardName = CardName.Huo_chiyan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        for (let i = 0; i < 2; i++) {
            he.GetHit(this._lvlVal(4, 5, 6), me, this.cardName);
        }
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            he.GetHit(this._lvlVal(4, 6, 8), me, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}

export class Tu_zhenCard extends ACard {
    cardName: CardName = CardName.Tu_zhen;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(4, 6, 8), this.cardName);
        me.AddBuffById(BuffId.TuZhen, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
export class Tu_qunshanCard extends ACard {
    cardName: CardName = CardName.Tu_qunshan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 6, 7), me, this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetTuAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.InternalShield, this._lvlVal(3, 6, 9), this.cardName);
        }
    }
}
export class Jin_zhenArrayCard extends ACard {
    cardName: CardName = CardName.Jin_zhenArray;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Sharp, 4, this.cardName);
        me.AddBuffById(BuffId.JinZhen, this._lvlVal(1, 2, 3), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
export class Jin_chuanxinCard extends ACard {
    cardName: CardName = CardName.Jin_chuanxin;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(7, 10, 13), me, this.cardName);
    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Pierce, this._lvlVal(1, 2, 3), this.cardName);
        }
    }
}
export class Shui_bolanCard extends ACard {
    cardName: CardName = CardName.Shui_bolan;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.WaterFlow, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetMana(me: Human): number {
        if (me.isShui) return 0;
        return 2;
    }
}
export class Shui_xiongyongCard extends ACard {
    cardName: CardName = CardName.Shui_xiongyong;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        let dmg = this._lvlVal(10, 14, 18);
        if (me.isShui) {
            dmg += me.GetBuff(BuffId.WaterFlow)?.num ?? 0;
        }
        he.GetHit(dmg, me, this.cardName);
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
export class HuntianyinCard extends ACard {
    cardName: CardName = CardName.Huntianyin;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(5, 9, 13), me, this.cardName);
        me.RecoverMana(1);
    }
}

// export class BCard extends ACard { }
// export class BCard extends ACard { }
//#endregion
