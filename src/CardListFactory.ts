import { ACard, CardInfo, CardName, HitCard, } from "./Card";
import CardList from "./CardList";
import { DuLingYuan_LIST, DuYiFeng_LIST, HuaQinrui_LIST, JiangXiMing_LIST, Linxiaoyue_LIST, LongYao_LIST, LuJianxin_LIST, MuHu_LIST, NanGongSheng_LIST, TanShuYan_LIST, WuCe_LIST, WuXingzhi_LIST, YanChen_LIST, YanXue_LIST, YaoLing_LIST } from "./Character";
import { Dan_LIST } from "./DanCards";
import { Fu_LIST } from "./FuCards";
import Go from "./Go";
import { Hua_LIST } from "./HuaCards";
import { QiXing_LIST } from "./QiXingGeCard";
import { Qin_LIST } from "./QinCards";
import { WuXing_LIST } from "./WuXingDaoMengCards";
import { JianZong_LIST } from "./YunLingJianCards";
import { Zhen_LIST } from "./ZhenCards";
import { Zhi_LIST } from "./ZhiCards";
import { Career, Men, Role } from "./_share_code_";
require = require("esm")(module);
const { pick } = require("gnfun");


var AllCardType = [
    // 通用卡
    HitCard,
    // 门派卡
    ...JianZong_LIST,
    ...QiXing_LIST,
    ...WuXing_LIST,
    // 角色卡
    ...DuYiFeng_LIST,
    ...YanXue_LIST,
    ...LongYao_LIST,
    ...Linxiaoyue_LIST,
    ...TanShuYan_LIST,
    ...YanChen_LIST,
    ...YaoLing_LIST,
    ...JiangXiMing_LIST,
    ...WuXingzhi_LIST,
    ...LuJianxin_LIST,
    ...WuCe_LIST,
    ...DuLingYuan_LIST,
    ...HuaQinrui_LIST,
    ...MuHu_LIST,
    ...NanGongSheng_LIST,
    // 职业卡
    ...Zhen_LIST,
    ...Dan_LIST,
    ...Qin_LIST,
    ...Fu_LIST,
    ...Hua_LIST,
    ...Zhi_LIST
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
    else if (Hua_LIST.includes(type)) return Career.Hua
    else if (Zhi_LIST.includes(type)) return Career.Zhi
    else return Career.NON
}

function getRoleByType(type): Role {
    if (WuXingzhi_LIST.includes(type)) return Role.Wxz
    else if (TanShuYan_LIST.includes(type)) return Role.Tsy
    else if (YanXue_LIST.includes(type)) return Role.Yx
    else if (DuYiFeng_LIST.includes(type)) return Role.Dyf
    else if (LongYao_LIST.includes(type)) return Role.Ly
    else if (Linxiaoyue_LIST.includes(type)) return Role.Lxy
    else if (LuJianxin_LIST.includes(type)) return Role.Ljx
    else if (YanChen_LIST.includes(type)) return Role.Yc
    else if (YaoLing_LIST.includes(type)) return Role.Yl
    else if (JiangXiMing_LIST.includes(type)) return Role.Jxm
    else if (WuCe_LIST.includes(type)) return Role.Wc
    else if (DuLingYuan_LIST.includes(type)) return Role.Dly
    else if (HuaQinrui_LIST.includes(type)) return Role.Hqr
    else if (MuHu_LIST.includes(type)) return Role.Mh
    else if (NanGongSheng_LIST.includes(type)) return Role.Ngs
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

    public NewCardByType(type: { new(): ACard }, level: number) {
        var card = new type();
        card.init(level);
        return card;
    }

    public EachRecord(walk: (record: CardRecord) => void) {
        Object.values(this._dict).forEach(record => {
            walk(record);
        });
    }

    /**
     * 从对应的门派中任意抽卡
     * @param men 
     */
    public PickFromMen<T extends ACard>(men: Men): { new(): T } {
        let pool = [];
        if (men == Men.QLJJ) {
            pool = JianZong_LIST;
        } else if (men == Men.QXG) {
            pool = QiXing_LIST;
        } else if (men == Men.WXDM) {
            pool = WuXing_LIST;
        }
        if (pool.length > 0) {
            return pick(pool);
        }
        return null;
    }
}


