import { ACard, CardInfo, CardName, HitCard,  } from "./Card"
import { BeiGongCard, FeiTaCard, GoldChanCard, HaiDiCard, HuangQueCard, MeiKaiCard, QiTunCard, TangLangCard, XingFeiCard } from "./QiXingGeCard";
import { DCTuneCard, TongXinCard } from "./QingCards";
import { BNLJFormulaCard, BreakingQiSwordCard, ChainSwordArrayCard, CloudDanceFormula, CondensationFormulaCard, CrazyMoveOneCard, CrazyMoveTwoCard, CrazyMoveZeroCard, DarkCrowManaSwordCard, DishaSwordCard, EgretManaSwordCard, FlyingSpiritFlashingShadowSwordCard, FlyingToothSwordCard, GiantKunManaSwordCard, GiantRocManaSwordCard, GiantWhaleSwordCard, HugeTigerManaSwordCard, InspirationSwordCard, LightSwordCard, LingxiSwordArray, LiuyunChaoticSwordCard, ManaGatherMentalSkillCard, ManaInsideCard, ManaProtectMeCard, MirrorFlowerSwordArrayCard, QiDrawingSwordCard, ReflexiveSwordCard, ShockThunderSwordCard, SuddenWindSwordCard, SwordBlockCard, SwordChopCard, SwordMenaingStirringCard, TenThousandWayManaSwordCard, ThreePeakSwordCard, ToManaFormulaCard, WaterMoonSwordArrayCard, XingyiSwordCard, YukongSwordArrayCard, YunFeiCiCard, YunFlashingWindCard, YunHouTuCard, YunHuilingCard, YunHuiShouCard, YunJiYiCard, YunLingboCard, YunMoonShadowCard, YunPointStarCard, YunSoftMentalSkillCard, YunTanYunCard, YunWuFengCard, YunWuliCard, YunYouLongCard } from "./YunLingJianCards";
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
    YunSoftMentalSkillCard, YunWuliCard, YunPointStarCard, YunHuilingCard,
    CloudDanceFormula, DarkCrowManaSwordCard, BreakingQiSwordCard, GiantWhaleSwordCard,
    ReflexiveSwordCard, MirrorFlowerSwordArrayCard, ThreePeakSwordCard, GiantRocManaSwordCard,
    YunFlashingWindCard, YunMoonShadowCard, BNLJFormulaCard, ManaGatherMentalSkillCard,
    EgretManaSwordCard, GiantKunManaSwordCard, InspirationSwordCard, LiuyunChaoticSwordCard,
    WaterMoonSwordArrayCard, CrazyMoveTwoCard, YunYouLongCard, YunLingboCard, FlyingSpiritFlashingShadowSwordCard,
    TenThousandWayManaSwordCard, SwordMenaingStirringCard, YukongSwordArrayCard, ChainSwordArrayCard, CrazyMoveZeroCard,

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
                arg[i] = CardName.Hit + ",1";
                arg[i] = CardName.ManaProtectMe + ",1";
                arg[i] = CardName.YunPointStar + ",2";
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


  