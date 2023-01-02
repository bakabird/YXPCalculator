import { CardListFactory, CardRecord } from "./CardListFactory";
import pinyin from "pinyin";
import FuzzySearch from 'fuzzy-search'; // Or: var FuzzySearch = require('fuzzy-search');

type SearchItem = {
    record: CardRecord,
    pinyin: string,
}

var pinyinOption = {
    style: pinyin.STYLE_FIRST_LETTER,
}

export default class CardSearcher {
    private static _me: CardSearcher;
    public static get me(): CardSearcher {
        if(!this._me) {
            this._me = new CardSearcher();
        }
        return this._me;
    }
    private _searcher: FuzzySearch;
    private constructor() {
        var list: Array<SearchItem> = [];
        CardListFactory.me.EachRecord((record: CardRecord)=>{
            list.push({
                record,
                pinyin: pinyin(record.name, pinyinOption).join(""),
            })
        });
        this._searcher = new FuzzySearch(list, ['pinyin'], {
            caseSensitive: false,
        });
    }
    public Search(needle: string): Array<string> {
        return this._searcher.search(needle).map(i => i.record.name);
    }
}