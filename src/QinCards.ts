import { ABuff, BuffFactory, DCBuff } from "./Buff";
import { Human } from "./Human";
import { ACard, CardName, CardState } from "./Card";



export class DCTuneCard extends ACard {
    cardState: CardState = CardState.JinDan;
    cardName: CardName = CardName.DCTune;
    onEffect(me: Human, he: Human) {
        var meBuff = new DCBuff();
        var heBuff = new DCBuff();
        var val = this._lvlVal(1, 2, 3);
        meBuff.init(me, val);
        heBuff.init(he, val);
        me.AddBuff(meBuff, this.cardName);
        he.AddBuff(heBuff, this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}





export class TongXinCard extends ACard {
    cardState: CardState = CardState.YuanYing;
    cardName: CardName = CardName.TongXin;
    protected onEffect(me: Human, he: Human) {
        me.EachBuff((buff) => {
            if (ABuff.IsDebuff(buff.id)) {
                he.AddBuff(BuffFactory.me.Produce(buff.id, he, buff.num), this.cardName);
            }
        });
    }
    protected onGetMana(): number {
        return this._lvlVal(2, 1, 0);
    }
}



export var Qin_LIST = [
    DCTuneCard,

    TongXinCard,
]