import { BuffId } from "./Buff";
import { ACard, CardEffect, CardLevel, CardName, CardState } from "./Card";
import { CardListFactory } from "./CardListFactory";
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
        me.AddBuffById(BuffId.Huntianyin, 1, this.cardName);
        me.RecoverMana(1);
    }
}


//#endregion







//#region 金丹期
export class Mu_zhenCard extends ACard {
    cardName: CardName = CardName.Mu_zhen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddMaxHp(this._lvlVal(10, 15, 20), this.cardName);
        me.AddHp(this._lvlVal(2, 3, 4), this.cardName);
        me.AddBuffById(BuffId.MuZhen, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }

}
export class Mu_XunlinCard extends ACard {
    cardName: CardName = CardName.Mu_Xunlin;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Suiyan, 1, this.cardName);
        new Array(2).forEach(() => {
            he.GetHit(this._lvlVal(1, 2, 3), me, this.cardName);
        })
        me.AddBuffById(BuffId.Suiyan, -1, this.cardName);
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            if (me.everAddHp) {
                me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
            }
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
export class Huo_zhenCard extends ACard {
    cardName: CardName = CardName.Huo_zhen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(2, 3, 4);
        he.CutHp(val, this.cardName)
        he.CutMaxHp(val, this.cardName)
        me.AddBuffById(BuffId.HuoZhen, val, this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
export class Huo_honbaoCard extends ACard {
    cardName: CardName = CardName.Huo_honbao;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Power, this._lvlVal(1, 2, 3), this.cardName);
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            const cut = 7 + me.GetBuff(BuffId.Power)?.num ?? 0;
            he.CutHp(cut, this.cardName);
            he.CutMaxHp(cut, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
export class Tu_yangchenCard extends ACard {
    cardName: CardName = CardName.Tu_yangchen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(8, 12, 16), me, this.cardName);
    }
    protected onGetTuAct(): CardEffect {
        return (me, he) => {
            const val = Math.floor(Math.abs(he.maxHp - me.maxHp) / 4);
            me.AddBuffById(BuffId.Shield, val, this.cardName);
            me.AddBuffById(BuffId.InternalShield, val, this.cardName);
        }
    }
}
export class Tu_duanyaCard extends ACard {
    cardName: CardName = CardName.Tu_duanya;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(10, 15, 20), this.cardName);
    }
    protected onGetTuAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Duanya, 1, this.cardName);
        }
    }
}
export class Jin_xuruiCard extends ACard {
    cardName: CardName = CardName.Jin_xurui;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, this._lvlVal(4, 6, 8), this.cardName);
        me.AddBuffById(BuffId.Sharp, this._lvlVal(4, 6, 8), this.cardName);
    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            const val = Math.floor((me.GetBuff(BuffId.Shield)?.num ?? 0) / 4);
            me.AddBuffById(BuffId.Sharp, val, this.cardName);
        }
    }
}
export class Jin_fengmangCard extends ACard {
    cardName: CardName = CardName.Jin_fengmang;
    cardState: CardState = CardState.JinDan;
    hurtHp: number;
    protected onEffect(me: Human, he: Human) {
        const oriHp = he.hp
        he.GetHit(this._lvlVal(6, 9, 12), me, this.cardName);
        this.hurtHp = oriHp - he.hp;
    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            if (this.hurtHp > 0) {
                const val = Math.floor(this.hurtHp / 2);
                if (val > 0) {
                    me.AddBuffById(BuffId.Sharp, val, this.cardName);
                }
            }
        }
    }
}
export class Shui_zhenCard extends ACard {
    cardName: CardName = CardName.Shui_zhen;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 5), this.cardName);
        me.AddBuffById(BuffId.ShuiZhen, 1, this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
export class Shui_quanyongCard extends ACard {
    cardName: CardName = CardName.Shui_quanyong;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetShuiAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Quanyong, 1, this.cardName);
        }
    }
}
export class WuxingflowCard extends ACard {
    cardName: CardName = CardName.Wuxingflow;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const list = me.CardList;
        list.PosBack();
        const pre = list.GetCur()
        list.PosShift()
        list.PosShift()
        const next = list.GetCur()
        list.PosBack()
        if (pre.amIWuxingGen(next)) {
            next.effectCardWuxing(me, this.cardName);
            var card = CardListFactory.me.NewCard(next.cardName,
                this._lvlVal(CardLevel.Normal, CardLevel.Rare, CardLevel.Legend));
            card.effect(me, he);
        }
    }

}

//#endregion



//#region 元婴期
export class Mu_anxiangCard extends ACard {
    cardName: CardName = CardName.Mu_anxiang;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        me.AddHp(this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            const val = Math.floor(me.mana / 3);
            if (val > 0) {
                me.AddBuffById(BuffId.Power, val, this.cardName);
            }
        }
    }

}
export class Mu_meiciCard extends ACard {
    cardName: CardName = CardName.Mu_meici;
    cardState: CardState = CardState.YuanYing;
    hurtSum: number = 0;
    protected onEffect(me: Human, he: Human) {
        this.hurtSum = 0;
        let loop = this._lvlVal(3, 4, 5)
        while (loop--) {
            this.hurtSum += he.GetHit(4, me, this.cardName);
        }
    }
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            const val = Math.floor(this.hurtSum / 3);
            if (val > 0) {
                me.AddHp(val, this.cardName);
            }
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }

}
export class Huo_shunranCard extends ACard {
    cardName: CardName = CardName.Huo_shunran;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.CutMaxHp(this._lvlVal(4, 8, 12), this.cardName);
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }

}
export class Huo_zhuoxinCard extends ACard {
    cardName: CardName = CardName.Huo_zhuoxin;
    cardState: CardState = CardState.YuanYing;
    hurt: number;
    protected onEffect(me: Human, he: Human) {
        let num = 2;
        this.hurt = 0;
        while (num--) {
            this.hurt += he.GetHit(this._lvlVal(4, 5, 7), me, this.cardName);
        }
    }
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            if (this.hurt > 0) {
                he.CutMaxHp(this.hurt * 2, this.cardName);
            }
        }
    }

}
export class Tu_juebiCard extends ACard {
    cardName: CardName = CardName.Tu_juebi;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Shield, 12, this.cardName);
    }
    protected onGetTuAct(): CardEffect {
        return (me, he) => {
            var val = Math.floor(me.shieldEverCut / this._lvlVal(6, 5, 4))
            if (val > 0) {
                me.AddBuffById(BuffId.Shield, val, this.cardName);
            }
        }
    }
}
export class Tu_liushaCard extends ACard {
    cardName: CardName = CardName.Tu_liusha;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        var extra = 0;
        if (me.isTu) {
            extra = Math.floor(me.shieldEverCut / this._lvlVal(6, 5, 3));
        }
        he.GetHit(9 + extra, me, this.cardName)
    }

}
export class Jin_feisuoCard extends ACard {
    cardName: CardName = CardName.Jin_feisuo;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.BanSharp, 1, this.cardName);
        he.GetHit(this._lvlVal(4, 8, 12), me, this.cardName);
        me.AddBuffById(BuffId.BanSharp, -1, this.cardName);
    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }
}
export class Shui_tenglangCard extends ACard {
    cardName: CardName = CardName.Shui_tenglang;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 3, 4))
        me.AddMaxHp(this._lvlVal(2, 3, 4), this.cardName);
        me.AddHp(this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetShuiAct(): CardEffect {
        return (me, he) => {
            const val = Math.floor(me.mana / 2)
            if (val > 0) {
                me.AddBuffById(BuffId.WaterFlow, val, this.cardName);
            }
        }
    }
}
export class Jin_tieguCard extends ACard {
    cardName: CardName = CardName.Jin_tiegu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {

    }
    protected onGetJinAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Tiegu, this._lvlVal(2, 3, 4), this.cardName);
        }
    }

}
export class Shui_qiandunCard extends ACard {
    cardName: CardName = CardName.Shui_qiandun;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddMaxHp(this._lvlVal(2, 7, 12), this.cardName);
        me.AddHp(this._lvlVal(2, 7, 12), this.cardName);
    }
    protected onGetShuiAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.Qiandun, 2, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
export class HunyuansjCard extends ACard {
    cardName: CardName = CardName.Hunyuansj;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Suiyan, 1, this.cardName)
        he.GetHit(this._lvlVal(4, 7, 10) + this._lvlVal(4, 5, 6) * me.CardList.numOfWuxing, me, this.cardName)
        me.AddBuffById(BuffId.Suiyan, -1, this.cardName)
    }
    protected onGetMana(me: Human): number {
        return 1;
    }
}
// export class BCard extends ACard {

// }

//#endregion

//#region 化神期
export class Mu_liufengfeiCard extends ACard {
    cardName: CardName = CardName.Mu_liufengfei;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        // add buff power with 1/2/3
        me.AddBuffById(BuffId.Power, this._lvlVal(1, 2, 3), this.cardName);
        // recover 3 hp 
        me.AddHp(3, this.cardName);
    }
    // add buff.moveagian
    protected onGetMuAct(): CardEffect {
        return (me, he) => {
            me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 1
    }
}
export class Huo_lieliaoyuanCard extends ACard {
    cardName: CardName = CardName.Huo_lieliaoyuan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        // he gethit 6/8/10 by 3 times
        for (let i = 0; i < 3; i++) {
            he.GetHit(this._lvlVal(6, 8, 10), me, this.cardName);
        }
    }
    // cut his maxhp to curHp - 2 3 4
    protected onGetHuoAct(): CardEffect {
        return (me, he) => {
            // his cur hp 
            const curHp = he.hp;
            if (curHp > 0) {
                const newMaxHp = Math.max(0, curHp - this._lvlVal(2, 3, 4));
                he.CutMaxHp(he.maxHp - newMaxHp, this.cardName);
            }
        }
    }
    protected onGetMana(me: Human): number {
        return 2;
    }
}
export class Tu_hebahuanCard extends ACard {
    cardName: CardName = CardName.Tu_hebahuan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        // add 12 shiled
        me.AddBuffById(BuffId.Shield, 12, this.cardName);
    }
    protected onGetTuAct(): CardEffect {
        return (me, he) => {
            // add 2/3/4 buff.hebahuan
            me.AddBuffById(BuffId.Hebahuan, this._lvlVal(2, 3, 4), this.cardName);
        }
    }
}
export class Shui_nabaichuanCard extends ACard {
    cardName: CardName = CardName.Shui_nabaichuan;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        // get 3/4/5 buff.waterflow
        me.AddBuffById(BuffId.WaterFlow, this._lvlVal(3, 4, 5), this.cardName);
    }
    protected onGetShuiAct(): CardEffect {
        return (me, he) => {
            // recover and add maxhp 6/8/10, bonus by cur num of buff.waterflow
            const bonus = me.GetBuff(BuffId.WaterFlow)?.num ?? 0;
            me.AddMaxHp(this._lvlVal(6, 8, 10) + bonus, this.cardName);
            me.AddHp(this._lvlVal(6, 8, 10) + bonus, this.cardName);
        }
    }
    protected onGetMana(me: Human): number {
        return 2;
    }

}
export class Hunyuan_wujiCard extends ACard {
    cardName: CardName = CardName.Hunyuan_wuji;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        // add 0/2/4 + wuxingOfCardList buff.hunyuanwuji
        const val = this._lvlVal(0, 2, 4) + me.CardList.numOfWuxing
        if (val > 0) me.AddBuffById(BuffId.Hunyuanwuji, val, this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
export class WuXing_tiansuijueCard extends ACard {
    cardName: CardName = CardName.WuXing_tiansuijue;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        const mana = this._lvlVal(0, 2, 2);
        if (mana > 0) me.RecoverMana(mana, this.cardName);
        if (me.CardList.numOfWuxing == 1) {
            me.AddBuffById(BuffId.Wuxingtiansui, this._lvlVal(2, 2, 3), this.cardName);
        }
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}
// export class BCard extends ACard {

// }
//#endregion


export var list = [
    Mu_yinCard, Mu_yaCard, Huo_yinCard, Huo_cuanCard, Tu_yinCard,
    Tu_suiCard, Jin_yinCard, WuxingcCard, Shui_yinCard, Shui_taoCard,
    Jin_zhenCard,

    Mu_fusuCard, Mu_shuyingCard, Huo_juyanCard, Huo_chiyanCard, Tu_zhenCard,
    Tu_qunshanCard, Jin_zhenArrayCard, Jin_chuanxinCard, Shui_bolanCard, Shui_xiongyongCard,
    HuntianyinCard,

    Mu_zhenCard, Mu_XunlinCard, Huo_zhenCard, Huo_honbaoCard,
    Tu_yangchenCard, Tu_duanyaCard, Jin_xuruiCard, Jin_fengmangCard,
    Shui_zhenCard, Shui_quanyongCard, WuxingflowCard,

    Mu_anxiangCard, Mu_meiciCard, Huo_shunranCard, Huo_zhuoxinCard,
    Tu_juebiCard, Tu_liushaCard, Jin_feisuoCard, Shui_tenglangCard,
    Jin_tieguCard, Shui_qiandunCard, HunyuansjCard,

    Mu_liufengfeiCard, Huo_lieliaoyuanCard, Tu_hebahuanCard, Shui_nabaichuanCard,
    Hunyuan_wujiCard, WuXing_tiansuijueCard
]
