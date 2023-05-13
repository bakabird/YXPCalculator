import { BuffId } from "./Buff";
import { ACard, CardLevel, CardName, CardState } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { Human } from "./Human";
import LogEncode from "./LogEncode";










/**
 * 化神
 */

export class DecalEchoCard extends ACard {
    cardName: CardName = CardName.DecalEcho;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        var firstCard: ACard;
        me.CardList.EachCardsL2R(c => { if (!firstCard) firstCard = c });
        if (firstCard && firstCard.isKeeping) {
            var card = CardListFactory.me.NewCard(firstCard.cardName,
                this._lvlVal(CardLevel.Normal, CardLevel.Rare, CardLevel.Legend));
            me.AddBuffById(BuffId.DecalEcho, 1, LogEncode.Ignore);
            card.effect(me, he);
            me.RemoveBuff(BuffId.DecalEcho, LogEncode.Ignore);
            card = null;
        }
    }

}

export class ZhenMillionFlower extends ACard {
    cardName: CardName = CardName.ZhenMillionFlower;
    cardState: CardState = CardState.HuaShen;
    protected onEffect(me: Human, he: Human) {
        me.AddBuffById(BuffId.ZhenMillionFlower, this._lvlVal(2, 3, 4), this.cardName);
    }
    protected onGetIsKeeping(): boolean {
        return true;
    }
}

