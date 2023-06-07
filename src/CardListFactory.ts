import { ACard, CardInfo, CardName, HitCard, } from "./Card"
import { BeiGongCard, CountershockMentalCard, DigRootCard, DoubleThunderCard, DryTreeCard, FallingFlowerCard, FeiTaCard, FinchTailCard, FiveThunderCard, FlowingWaterCard, FlyingStarCard, GoldChanCard, GuaDuiCard, GuaGenCard, GuaKanCard, GuaKunCard, GuaLiCard, GuaQianCard, GuaXunCard, GuaZhenCard, HaiDiCard, HuangQueCard, ImbuedRainbowCard, LiangyiArrayCard, MeiKaiCard, MindMentalCard, MustangCard, OneFootCard, PalmThunderCard, PosStarCard, PurpleManaCard, QiRecoverCard, QiTunCard, QiXing_LIST, SilkRemain, SixyaoArrayCard, StarAroundMoonCard, StarMoveCard, StarOrbitCard, TangLangCard, ThunderCard, ThunderGuaFormulaCard, TouchWaterCard, WhiteCraneCard, WhiteSnakeCard, WorldCenterMentalCard, XingDaCard, XingDangCard, XingDianCard, XingDuanCard, XingFeiCard, XingHuCard, XingJiaCard, XingLiCard } from "./QiXingGeCard";
import { DCTuneCard, TongXinCard } from "./QinCards";
import { BNLJFormulaCard, BreakingQiSwordCard, ChainSwordArrayCard, CloudDanceFormula, CondensationFormulaCard, CrazyMoveOneCard, CrazyMoveTwoCard, CrazyMoveZeroCard, DarkCrowManaSwordCard, DishaSwordCard, EgretManaSwordCard, FlyingSpiritFlashingShadowSwordCard, FlyingToothSwordCard, GiantKunManaSwordCard, GiantRocManaSwordCard, GiantWhaleSwordCard, HugeTigerManaSwordCard, InspirationSwordCard, LightSwordCard, LingxiSwordArray, LiuyunChaoticSwordCard, ManaGatherMentalCard, ManaInsideCard, ManaProtectMeCard, MirrorFlowerSwordArrayCard, QiDrawingSwordCard, ReflexiveSwordCard, ShockThunderSwordCard, SuddenWindSwordCard, SwordBlockCard, SwordChopCard, SwordMenaingStirringCard, TenThousandWayManaSwordCard, ThreePeakSwordCard, ToManaFormulaCard, WaterMoonSwordArrayCard, XingyiSwordCard, YukongSwordArrayCard, YunCrashSnowCard, YunFeiCiCard, YunFlashingWindCard, YunHouTuCard, YunHuilingCard, YunHuiShouCard, YunJiYiCard, YunLingboCard, YunMoonShadowCard, YunPointStarCard, YunSoftMentalCard, YunTanYunCard, YunWuFengCard, YunWuliCard, YunYouLongCard } from "./YunLingJianCards";
import CardList from "./CardList";
import { DecalEchoCard, ZhenMillionFlower } from "./ZhenCards";
import { Wu_Xingzhi_LIST } from "./Character";
import { WuXing_LIST } from "./WuXingDaoMengCards";
import { Men } from "./_share_code_";


var AllCardType = [
    // 通用卡
    HitCard,
    // 门派卡
    ...QiXing_LIST,
    ...WuXing_LIST,
    // 角色卡
    ...Wu_Xingzhi_LIST,
]

function getMenByType(type): Men {
    if (QiXing_LIST.includes(type)) return Men.QXG
    else if (WuXing_LIST.includes(type)) return Men.WXDM
    else return Men.NON
}

export type CardRecord = {
    name: CardName,
    Type: any,
    onlyMen: Men | null,
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
            var cardRecord = {
                name: card.cardName,
                Type: type,
                onlyMen: getMenByType(type),
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


