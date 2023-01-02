import { ACard, BeiGongCard, CardInfo, CardName, DCTuneCard, FeiTaCard, GoldChanCard, HaiDiCard, HitCard, HuangQueCard, LightSwordCard, ManaInsideCard, ManaProtectMeCard, MeiKaiCard, QiTunCard, TangLangCard, TongXinCard, XingFeiCard, YunFeiCiCard, YunHouTuCard, YunTanYunCard } from "./Card"
import CardList from "./CardList";

var AllCardType = [
    HitCard, DCTuneCard, BeiGongCard, FeiTaCard, TongXinCard,
    MeiKaiCard, HuangQueCard, XingFeiCard, HaiDiCard, TangLangCard,
    GoldChanCard, QiTunCard, YunTanYunCard, YunFeiCiCard, YunHouTuCard,
    LightSwordCard, ManaProtectMeCard, ManaInsideCard,
] 

export type CardRecord = {
    name: CardName,
    Type: any,
}

export class CardListFactory {
    private static _me: CardListFactory;
    public static Size: number = 8;
    public static get me(): CardListFactory {
        if(!this._me) {
            this._me = new CardListFactory();
        }
        return this._me;
    }

    private _dict: Record<string, CardRecord>

    private constructor() {
        this._dict = {};
        AllCardType.forEach(type => {
            var card = new type() as ACard;
            var cardRecord = {
                name: card.cardName,
                Type: type
            };
            this._dict[cardRecord.name] = cardRecord;
        });
    }

    public SplitCode(code: string): CardInfo[] {
        var ret: Array<CardInfo> = [];
        var arg = code == "" ? [] : code.split(";");
        for (var i = 0;i < CardListFactory.Size;i++) {
            if(i >= arg.length) {
                arg[i] = CardName.ManaProtectMe + ",1";
                arg[i] = CardName.Hit + ",1";
            }
            var parts = arg[i].split(",");
            ret.push({
                name: parts[0] as CardName, 
                level: parseInt(parts[1]) + 1,
            });
        }
        return ret;
    }

    public FormList(infoList: Array<CardInfo>): CardList {
        var ret: ACard[] = [];
        infoList.forEach(info => {
            var cardType = this._dict[info.name].Type;
            if(!cardType) {
                throw "unknown card " + info.name;
            }
            var card: ACard = new cardType();
            card.init(info.level);
            ret.push(card);
        })
        return new CardList(ret);
    }

    public EachRecord(walk:(record: CardRecord)=>void) {
        Object.values(this._dict).forEach(record => {
            walk(record);
        });
    }
}


  