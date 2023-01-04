import { BES, BuffId } from "./Buff";
import { Human } from "./Human";

//每次行动

export class Action {
    constructor(private _actor: Human, private _target: Human) {
    }

    public effect() {
        var me = this._actor;
        var he = this._target;

        if (me.hp <= 0)
            return;
        me.EffectBuff(BES.RoundStart);
        me.EffectCard(he);
        if (me.CheckBuff(BuffId.MoveAgain, 1)) {
            me.EffectCard(he);
        }
        me.RemoveBuff(BuffId.MoveAgain, "再动结束");
    }
}
