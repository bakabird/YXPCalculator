import { CardListFactory, CardRecord } from "./CardListFactory";
import FuzzySearch from 'fuzzy-search'; // Or: var FuzzySearch = require('fuzzy-search');
import { Career, Men, Role } from "./_share_code_";
// @ts-ignore
import CardPinyin from "../Lib/CardPinyin.json";

type SearchItem = {
    record: CardRecord,
    pinyin: string,
}


export interface SearchFilter {
    men: Men,
    career: Career,
    role: Role,
}

export default class CardSearcher {
    private static _me: CardSearcher;
    public static get me(): CardSearcher {
        if (!this._me) { 
            this._me = new CardSearcher();
        }
        return this._me;
    }
    private _searcher: FuzzySearch<SearchItem>;
    private constructor() {
        var list: Array<SearchItem> = [];
        CardListFactory.me.EachRecord((record: CardRecord) => {
            list.push({
                record,
                pinyin: CardPinyin[record.name]
            })
        });
        // console.log(JSON.stringify(list));
        this._searcher = new FuzzySearch(list, ['pinyin'], {
            caseSensitive: false,
        });
    }
    public Search(needle: string, filter: SearchFilter): Array<string> {
        return this._searcher.search(needle).filter(r => {
            const {
                onlyMen,
                onlyCareer,
                onlyRole
            } = r.record
            if (onlyMen == Men.NON
                && onlyCareer == Career.NON
                && onlyRole == Role.NON) {
                // 通用卡
                return true;
            }
            if (filter.men == onlyMen) {
                return true
            } else if (filter.career == onlyCareer) {
                return true
            } else if (filter.role == onlyRole) {
                return true
            }
            return false;
        }).map(i => i.record.name);
    }
}