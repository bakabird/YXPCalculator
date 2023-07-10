import { ABuff, BuffId } from "./Buff";
import { ACard, CardName, CardState } from "./Card";
import { Human } from "./Human";
import { Cost, GenPush2Arr, Mana } from "./decorator";

export var Fu_LIST = []

var Fu = GenPush2Arr(Fu_LIST)

/*
CardState.LianQi
*/

@Fu
@Cost
export class BenLeiFuCard extends ACard {
    cardName: CardName = CardName.BenLeiFu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(me.Gua(this._lvlVal(4, 7, 10), this._lvlVal(12, 15, 18)), me, this.cardName);
    }
}

@Fu
@Cost
export class HuLingFuCard extends ACard {
    cardName: CardName = CardName.HuLingFu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(1, this.cardName);
        me.AddBuffById(BuffId.Shield, this._lvlVal(7, 11, 15), this.cardName);
    }
}

@Fu
@Cost
export class RuiJinFuCard extends ACard {
    cardName: CardName = CardName.RuiJinFu;
    cardState: CardState = CardState.LianQi;
    protected onEffect(me: Human, he: Human) {
        he.GetHit(this._lvlVal(8, 11, 14), me, this.cardName);
    }

}





/*
CardState.ZhuJi
*/

@Fu
@Cost
@Mana(1)
export class HuoYunFuCard extends ACard {
    cardName: CardName = CardName.HuoYunFu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(11, 15, 19);
        me.CutHp(val, this.cardName);
        me.CutMaxHp(val, this.cardName);
    }

}

@Fu
export class QingXinZhouCard extends ACard {
    cardName: CardName = CardName.QingXinZhou;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        const debuffIdArr: Array<BuffId> = []
        me.RecoverMana(this._lvlVal(2, 3, 4), this.cardName);
        me.EachBuff(buff => {
            if (ABuff.IsDebuff(buff.id)) {
                debuffIdArr.push(buff.id);
            }
        })
        debuffIdArr.forEach(buffId => {
            me.AddBuffById(buffId, this._lvlVal(2, 3, 4), this.cardName);
        })
    }

}

@Fu
@Cost
export class ShuiQiFuCard extends ACard {
    cardName: CardName = CardName.ShuiQiFu;
    cardState: CardState = CardState.ZhuJi;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(1, this.cardName);
        he.GetHit(this._lvlVal(6, 10, 14), me, this.cardName);
    }

}



/*
CardState.JinDan
*/

@Fu
export class HanBingZhouCard extends ACard {
    cardName: CardName = CardName.HanBingZhou;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        let time = this._lvlVal(2, 3, 4);
        while (time--) {
            he.CutHp(4, this.cardName);
        }
    }

}

@Fu
@Cost
export class XiLingFuCard extends ACard {
    cardName: CardName = CardName.XiLingFu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        const val = this._lvlVal(2, 3, 4)
        me.RecoverMana(val, this.cardName)
        he.RecoverMana(-val, this.cardName)
    }

}

@Fu
@Cost
export class ZhangQiFuCard extends ACard {
    cardName: CardName = CardName.ZhangQiFu;
    cardState: CardState = CardState.JinDan;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.Posion, this._lvlVal(2, 3, 4), this.cardName);
    }
}





/*
CardState.YuanYing
*/

@Fu
export class JuQiZhouCard extends ACard {
    cardName: CardName = CardName.JuQiZhou;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(3, 4, 5), this.cardName);
        me.AddBuffById(BuffId.Shield, me.mana, this.cardName);

    }

}

@Fu
@Cost
export class RaoXinFuCard extends ACard {
    cardName: CardName = CardName.RaoXinFu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.AddBuffById(BuffId.Flaw, this._lvlVal(3, 4, 5), this.cardName);
    }

}

@Fu
@Cost
export class RuoTiFuCard extends ACard {
    cardName: CardName = CardName.RuoTiFu;
    cardState: CardState = CardState.YuanYing;
    protected onEffect(me: Human, he: Human) {
        he.AddBuffById(BuffId.Weak, this._lvlVal(2, 3, 4), this.cardName);
    }

}




/*
CardState.HuaShen
*/

@Fu
@Cost
export class ZhenHunFengYuanFuCard extends ACard {
    cardName: CardName = CardName.ZhenHunFengYuanFu;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        he.CutMaxHp(Math.floor(he.maxHp * this._lvlVal(0.2, 0.25, 0.3)), this.cardName)
    }
}

@Fu
@Cost
export class QianLiShenXingFuCard extends ACard {
    cardName: CardName = CardName.QianLiShenXingFu;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.RecoverMana(this._lvlVal(2, 4, 6), this.cardName);
        me.AddBuffById(BuffId.MoveAgain, 1, this.cardName);
    }

}

@Fu
@Mana(2)
export class WanXieRuTiZhouCard extends ACard {
    cardName: CardName = CardName.WanXieRuTiZhou;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        he.AddBuffById(BuffId.Posion, this._lvlVal(2, 3, 3), this.cardName)
        he.AddBuffById(BuffId.Flaw, this._lvlVal(2, 2, 3), this.cardName)
        he.AddBuffById(BuffId.Weak, this._lvlVal(1, 2, 3), this.cardName)
    }

}
// export class BCard extends ACard {}
// export class BCard extends ACard {}