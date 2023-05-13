import { BES, BuffId } from "./Buff";
import { Human } from "./Human";
import LogEncode from "./LogEncode";

//每次行动

export class Action {
    constructor(private _actor: Human, private _target: Human) {
    }

    public effect() {
        var me = this._actor;
        var he = this._target;

        if (this.anyDead) return;
        me.EffectBuff(BES.RoundStart);
        me.EffectCard(he);
        if (this.anyDead) return;
        if (me.CheckBuff(BuffId.MoveAgain, 1)) {
            me.AddBuffById(BuffId.MoveAgainIng, 1, LogEncode.Ignore)
            me.EffectCard(he);
            me.RemoveBuff(BuffId.MoveAgainIng, LogEncode.Ignore);
            if (this.anyDead) return;
        }
        me.EffectBuff(BES.RoundEnd);
    }

    private get anyDead() {
        return this._actor.isDead || this._target.isDead;
    }
}
