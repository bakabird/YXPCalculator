import { ACard, CardInfo, CardName, HitCard,  } from "./Card"
import { BeiGongCard, CountershockMentalCard, DigRootCard, DoubleThunderCard, DryTreeCard, FallingFlowerCard, FeiTaCard, FinchTailCard, FiveThunderCard, FlowingWaterCard, FlyingStarCard, GoldChanCard, GuaDuiCard, GuaGenCard, GuaKunCard, GuaLiCard, GuaQianCard, GuaXunCard, GuaZhenCard, HaiDiCard, HuangQueCard, ImbuedRainbowCard, LiangyiArrayCard, MeiKaiCard, MindMentalCard, MustangCard, OneFootCard, PalmThunderCard, PosStarCard, PurpleManaCard, QiRecoverCard, QiTunCard, SilkRemain as SilkRemainCard, SixyaoArrayCard, StarAroundMoonCard, StarMoveCard, StarOrbitCard, TangLangCard, ThunderCard, ThunderGuaFormulaCard, TouchWaterCard, WhiteCraneCard, WhiteSnakeCard, WorldCenterMentalCard, XingDaCard, XingDangCard, XingDianCard, XingDuanCard, XingFeiCard, XingHuCard, XingJiaCard, XingLiCard } from "./QiXingGeCard";
import { DCTuneCard, TongXinCard } from "./QingCards";
import { BNLJFormulaCard, BreakingQiSwordCard, ChainSwordArrayCard, CloudDanceFormula, CondensationFormulaCard, CrazyMoveOneCard, CrazyMoveTwoCard, CrazyMoveZeroCard, DarkCrowManaSwordCard, DishaSwordCard, EgretManaSwordCard, FlyingSpiritFlashingShadowSwordCard, FlyingToothSwordCard, GiantKunManaSwordCard, GiantRocManaSwordCard, GiantWhaleSwordCard, HugeTigerManaSwordCard, InspirationSwordCard, LightSwordCard, LingxiSwordArray, LiuyunChaoticSwordCard, ManaGatherMentalCard, ManaInsideCard, ManaProtectMeCard, MirrorFlowerSwordArrayCard, QiDrawingSwordCard, ReflexiveSwordCard, ShockThunderSwordCard, SuddenWindSwordCard, SwordBlockCard, SwordChopCard, SwordMenaingStirringCard, TenThousandWayManaSwordCard, ThreePeakSwordCard, ToManaFormulaCard, WaterMoonSwordArrayCard, XingyiSwordCard, YukongSwordArrayCard, YunFeiCiCard, YunFlashingWindCard, YunHouTuCard, YunHuilingCard, YunHuiShouCard, YunJiYiCard, YunLingboCard, YunMoonShadowCard, YunPointStarCard, YunSoftMentalCard, YunTanYunCard, YunWuFengCard, YunWuliCard, YunYouLongCard } from "./YunLingJianCards";
import CardList from "./CardList";

var AllCardType = [
    HitCard, 

    DCTuneCard, TongXinCard,

    BeiGongCard, FeiTaCard, MeiKaiCard, HuangQueCard, 
    XingFeiCard, HaiDiCard, TangLangCard,
    GoldChanCard, QiTunCard, 
    
    YunTanYunCard, YunFeiCiCard, YunHouTuCard,
    LightSwordCard, ManaProtectMeCard, ManaInsideCard, HugeTigerManaSwordCard,
    ShockThunderSwordCard, SwordChopCard, SwordBlockCard, FlyingToothSwordCard,
    SuddenWindSwordCard, YunHuiShouCard, YunJiYiCard, YunWuFengCard,
    ToManaFormulaCard, QiDrawingSwordCard, CondensationFormulaCard, GiantWhaleSwordCard,
    LingxiSwordArray, DishaSwordCard, XingyiSwordCard, CrazyMoveOneCard,
    YunSoftMentalCard, YunWuliCard, YunPointStarCard, YunHuilingCard,
    CloudDanceFormula, DarkCrowManaSwordCard, BreakingQiSwordCard, GiantWhaleSwordCard,
    ReflexiveSwordCard, MirrorFlowerSwordArrayCard, ThreePeakSwordCard, GiantRocManaSwordCard,
    YunFlashingWindCard, YunMoonShadowCard, BNLJFormulaCard, ManaGatherMentalCard,
    EgretManaSwordCard, GiantKunManaSwordCard, InspirationSwordCard, LiuyunChaoticSwordCard,
    WaterMoonSwordArrayCard, CrazyMoveTwoCard, YunYouLongCard, YunLingboCard, FlyingSpiritFlashingShadowSwordCard,
    TenThousandWayManaSwordCard, SwordMenaingStirringCard, YukongSwordArrayCard, ChainSwordArrayCard, CrazyMoveZeroCard,
    StarMoveCard, PosStarCard, XingDangCard, XingJiaCard, GuaZhenCard, GuaKunCard, GuaXunCard, PalmThunderCard, WhiteCraneCard, FinchTailCard, MustangCard, SilkRemainCard,
    FlyingStarCard, XingDianCard, XingLiCard, GuaGenCard, GuaKunCard, ThunderCard, DigRootCard, OneFootCard, MindMentalCard, FallingFlowerCard, ImbuedRainbowCard, 
    StarAroundMoonCard, FlowingWaterCard, XingDaCard, GuaDuiCard, WhiteSnakeCard,  ThunderGuaFormulaCard, LiangyiArrayCard, QiRecoverCard, DryTreeCard,
    XingHuCard, SixyaoArrayCard, GuaLiCard, StarOrbitCard, TouchWaterCard, DoubleThunderCard, CountershockMentalCard,
    WorldCenterMentalCard, XingDuanCard, GuaQianCard, FiveThunderCard, PurpleManaCard,
    
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
                arg[i] = CardName.YunWuFeng + ",1";
                arg[i] = CardName.ManaProtectMe + ",1";
                arg[i] = CardName.Hit + ",1";
                arg[i] = CardName.YunPointStar + ",2";
                arg[i] = CardName.CrazyMoveTwo + ",2";
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


  