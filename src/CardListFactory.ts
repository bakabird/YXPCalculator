import { ACard, BeiGongCard, CardInfo, CardName, DCTuneCard, FeiTaCard, GoldChanCard, HaiDiCard, HitCard, HuangQueCard, MeiKaiCard, QiTunCard, TangLangCard, TongXinCard, XingFeiCard } from "./Card"
import CardList from "./CardList";
import pinyin from "pinyin";
import FuzzySearch from 'fuzzy-search'; // Or: var FuzzySearch = require('fuzzy-search');

var AllCardType = [
    HitCard, DCTuneCard, BeiGongCard, FeiTaCard, TongXinCard,
    MeiKaiCard, HuangQueCard, XingFeiCard, HaiDiCard, TangLangCard,
    GoldChanCard, QiTunCard,
] 

type CardRecord = {
    name: CardName,
    pinyin: string,
    Type: any,
}

var pinyinOption = {
    style: pinyin.STYLE_FIRST_LETTER,
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
    private _searcher: FuzzySearch;

    private constructor() {
        var list: Array<CardRecord> = [];
        this._dict = {};
        AllCardType.forEach(type => {
            var card = new type() as ACard;
            var cardRecord = {
                name: card.cardName,
                pinyin: pinyin(card.cardName, pinyinOption).join(""),
                Type: type
            };
            this._dict[cardRecord.name] = cardRecord;
            list.push(cardRecord);
        });

        this._searcher = new FuzzySearch(list, ['pinyin'], {
            caseSensitive: false,
        });
    }

    public Search(needle: string): Array<string> {
        return this._searcher.search(needle).map(i => i.name);
    }

    public SplitCode(code: string): CardInfo[] {
        var ret: Array<CardInfo> = [];
        var arg = code == "" ? [] : code.split(" ");
        for(var i = 0;i < CardListFactory.Size;i++) {
            var index = i * 2;
            if(index >= arg.length || 
                arg[index] == undefined || arg[index] == "_") {
                ret.push({
                    name: CardName.Hit,
                    level: 1
                });
            } else {
                ret.push({
                    name: arg[index] as CardName,
                    level: parseInt(arg[index + 1])
                });
            }
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
}


  