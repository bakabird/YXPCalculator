import { BuffId } from "./Buff";
import { ACard, CardName, CardState } from "./Card";
import { Human } from "./Human";

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

export var list = [
    Youranhl,
]