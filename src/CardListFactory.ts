import { ACard, CardInfo, CardName, HitCard, } from "./Card";
import CardList from "./CardList";
import { TanShuYan_LIST, WuXingzhi_LIST, YanXue_LIST } from "./Character";
import { Dan_LIST } from "./DanCards";
import { Fu_LIST } from "./FuCards";
import Go from "./Go";
import { QiXing_LIST } from "./QiXingGeCard";
import { Qin_LIST } from "./QinCards";
import { WuXing_LIST } from "./WuXingDaoMengCards";
import { JianZong_LIST } from "./YunLingJianCards";
import { Zhen_LIST } from "./ZhenCards";
import { Career, Men, Role } from "./_share_code_";


var AllCardType = [
    // 通用卡
    HitCard,
    // 门派卡
    ...JianZong_LIST,
    ...QiXing_LIST,
    ...WuXing_LIST,
    // 角色卡
    ...WuXingzhi_LIST,
    ...TanShuYan_LIST,
    ...YanXue_LIST,
    // 职业卡
    ...Zhen_LIST,
    ...Dan_LIST,
    ...Qin_LIST,
    ...Fu_LIST,
]

Go.Qin_LIST = Qin_LIST;

function getMenByType(type): Men {
    if (QiXing_LIST.includes(type)) return Men.QXG
    else if (WuXing_LIST.includes(type)) return Men.WXDM
    else if (JianZong_LIST.includes(type)) return Men.QLJJ
    else return Men.NON
}

function getCareerByType(type): Career {
    if (Zhen_LIST.includes(type)) return Career.Zhen
    else if (Qin_LIST.includes(type)) return Career.Qin
    else if (Dan_LIST.includes(type)) return Career.Dan
    else if (Fu_LIST.includes(type)) return Career.Fu
    else return Career.NON
}

function getRoleByType(type): Role {
    if (WuXingzhi_LIST.includes(type)) return Role.Wxz
    else if (TanShuYan_LIST.includes(type)) return Role.Tsy
    else if (YanXue_LIST.includes(type)) return Role.Yx
    else return Role.NON
}

export type CardRecord = {
    name: CardName,
    Type: any,
    onlyMen: Men | null,
    onlyCareer: Career | null,
    onlyRole: Role | null,
    // 门派卡 | 职业卡 | 个人卡
}

export class CardListFactory {
    private static _me: CardListFactory;
    public static Size: number = 8;
    public static get me(): CardListFactory {
        if (!this._me) {
            this._me = new CardListFactory();
        }
        return this._me;
    }

    private _dict: Record<string, CardRecord>

    private constructor() {
        this._dict = {};
        AllCardType.forEach(type => {
            var card = new type() as ACard;
            var cardRecord: CardRecord = {
                name: card.cardName,
                Type: type,
                onlyMen: getMenByType(type),
                onlyCareer: getCareerByType(type),
                onlyRole: getRoleByType(type),
            };
            this._dict[cardRecord.name] = cardRecord;
        });
    }

    public SplitCode(code: string): CardInfo[] {
        var ret: Array<CardInfo> = [];
        var arg = code == "" ? [] : code.split(";");
        for (var i = 0; i < CardListFactory.Size; i++) {
            if (i >= arg.length) {
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
            ret.push(this.NewCard(info.name, info.level));
        })
        return new CardList(ret);
    }

    public NewCard(name: string, level: number): ACard {
        var cardType = this._dict[name].Type;
        if (!cardType) {
            throw "unknown card " + name;
        }
        var card: ACard = new cardType();
        card.init(level);
        return card;
    }

    public EachRecord(walk: (record: CardRecord) => void) {
        Object.values(this._dict).forEach(record => {
            walk(record);
        });
    }
}


