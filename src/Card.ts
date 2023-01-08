import { BES, BuffFactory, BuffId, SwordMenaingBuff } from "./Buff";
import { Human } from "./Human"

//#region CARD

export enum CardName {
    Hit = "普通攻击",
    DCTune = "断肠曲",
    BeiGong = "杯弓蛇影",
    FeiTa = "飞鸿踏雪",
    TongXin = "同心曲",
    MeiKai = "梅开二度",
    HuangQue = "黄雀在后",
    HaiDi = "海底捞月",
    TangLang = "螳螂捕蝉",
    GoldChan = "金蝉脱壳",
    QiTun = "气吞山河",
    YunTanYun = "云剑·探云",
    YunFeiCi = "云剑·飞刺",
    YunHouTu = "云剑·厚土",
    LightSword = "轻剑",
    ManaProtectMe = "护身灵气",
    ManaInside = "灵气灌注",
    HugeTigerManaSword = "巨虎灵剑",
    ShockThunderSword = "震雷剑",
    SwordChop = "剑劈",
    SwordBlock = "剑挡",
    FlyingToothSword = "飞牙剑",
    SuddenWindSword = "骤风剑",
    YunHuiShou = "云剑·回守",
    YunJiYi = "云剑·极意",
    YunWuFeng = "云剑·无锋",
    ToManaFormula = "化灵诀",
    QiDrawingSword = "引气剑",
    CondensationFormula = "凝意诀",
    GiantWhaleSword = "巨鲸灵剑",
    LingxiSwordArray = "灵犀剑阵",
    DishaSword = "地煞剑",
    XingyiSword = "形意剑",
    CrazyMoveOne = "狂剑·一式",
    YunSoftMentalSkill  = "柔云心法",
    YunWuli = "云剑·无妄",
    YunPointStar = "云剑·点星",
    YunHuiling = "云剑·汇灵",
    CloudDanceFormula  = "云舞诀",
    DarkCrowManaSword = "暗鸦灵剑",
    BreakingQiSword = "破气剑",
    GiantRocManaSword = "巨鹏灵剑",
    ReflexiveSword = "反身剑",
    MirrorFlowerSwordArray = "镜花剑阵",
    ThreePeakSword = "三峰剑",
    YunFlashingWind = "云剑·闪风",
    YunMoonShadow = "云剑·月影",
    ManaGatherMentalSkill = "聚灵心法",
    BNLJFormula = "百鸟灵剑诀",
    EgretManaSword = "白鹭灵剑",
    GiantKunManaSword = "巨鲲灵剑",
    InspirationSword = "灵感剑",
    LiuyunChaoticSword = "流云乱剑",
    WaterMoonSwordArray = "水月剑阵",
    CrazyMoveTwo = "狂剑·二式",
    YunYouLong = "云剑·游龙",
    YunLingbo = "云剑·凌波",
    FlyingSpiritFlashingShadowSword = "飞灵闪影剑",
    TenThousandWayManaSword = "万法归灵剑",
    SwordMenaingStirring = "剑意激荡",
    YukongSwordArray = "御空剑阵",
    ChainSwordArray = "连环剑阵",
    CrazyMoveZero = "狂剑·零式",
    StarMove = "斗转星移",
    PosStar = "星罗棋布",
    XingDang = "星弈·挡",
    XingJia = "星弈·夹",
    GuaZhen = "震卦",
    GuaKun = "坤卦",
    GuaXun = "巽卦",
    PalmThunder = "掌心雷",
    WhiteCrane = "白鹤亮翅",
    FinchTail = "揽雀尾",
    Mustang = "野马分鬃",

    SilkRemain = "藕断丝连",



    XingFei = "星弈·飞",
}

export enum CardOrder {
    L2R,
    R2L,
}

export enum CardLevel {
    Normal = 1,
    Rare = 2,
    Legend = 3,
}

// 境界
export enum CardState {
    LianQi = 0,
    ZhuJi = 1,
    JinDan = 2,
    YuanYing = 3,
    HuaShen = 4,
    FanXu = 5,
}

export type CardInfo = {
    name: CardName,
    level: number,
}

export type CardEffect = (me: Human,he: Human)=>void;

export abstract class ACard {
    abstract cardName: CardName;
    abstract cardState: CardState;
    private _level: CardLevel;
    private _useNum: number;
    // 初始化时被赋予的卡牌等级
    public get initLevel(): number {
        return this._level;
    }
    // 狂?
    public get isCrazy(): boolean {
        return this.cardName.startsWith("狂剑")
    }
    init(level: CardLevel) {
        this._level = level;
        this._useNum = 0;
    };
    public decUseNum() {
        this._useNum--;
    }
    public effect(me:Human, he: Human) {
        const secondAct = this.onGetSecondAct();
        const starAct = this.onGetStarAct();
        const yunAct = this.onGetYunAct();
        const hurtAct = this.onGetHurtAct();
        const meCrazyMoveNum = me.GetBuff(BuffId.CrazyMoveZero)?.num ?? 0;
        const meStarPowerNum = me.GetBuff(BuffId.StarPower)?.num ?? 0;
        const oldHeHp = he.hp;
        const onStar = me.CardList.IsOnStar();
        // 前处理
        if(this.isCrazy && meCrazyMoveNum > 0) {
            me.AddBuffById(BuffId.HpSteal, meCrazyMoveNum, BuffId.CrazyMoveZero);
        }
        if(onStar && meStarPowerNum > 0) {
            me.AddBuffById(BuffId.Power, meStarPowerNum, BuffId.StarPower);
        }
        // 卡牌效果
        this.onEffect(me, he);
        if (this.onGetIsCost() || this.onGetIsKeeping()) {
            me.CardList.CostCur();
        }
        if (starAct && onStar) {
            starAct(me, he);
        }
        if (secondAct){
            if(this._useNum > 0) {
                secondAct(me, he);
            }
            var buff = me.GetBuff(BuffId.HuangQue);
            if(buff && buff.num > 0) {
                he.GetHit(buff.num, me, buff.id);
            }
        }
        if (yunAct && me.CheckBuff(BuffId.YunJian, 1)) {
            yunAct(me, he);
        }
        if (hurtAct && he.hp < oldHeHp) {
            hurtAct(me, he);
        }
        // 后处理
        if (this.cardName.startsWith("云剑")) {
            const yunSoftBuff = me.GetBuff(BuffId.YunSoft);
            yunSoftBuff && me.AddHp(yunSoftBuff.num, yunSoftBuff.id);
            me.AddBuff(BuffFactory.me.Produce(BuffId.YunJian, me, 1), this.cardName);
        } else {
            me.RemoveBuff(BuffId.YunJian, "断云");
        }
        if(this.isCrazy) {
            me.AddBuffById(BuffId.CrazySword, 1, "狂!");
            if(meCrazyMoveNum > 0) {
                me.AddBuffById(BuffId.HpSteal, -meCrazyMoveNum, BuffId.CrazyMoveZero);
            }
        }
        if(onStar && meStarPowerNum > 0) {
            me.AddBuffById(BuffId.Power, -meStarPowerNum, BuffId.StarPower);
        }
        // 结束
        this._useNum++;
        me.EffectBuff(BES.AnyCardEffectOver);
    }
    // 获取卡牌的实际耗蓝
    public getMana(me: Human, he: Human): number {
        let mana = this.onGetMana(me);
        if (this.cardName.endsWith("灵剑") && me.CheckBuff(BuffId.BNLJ, 1)){
            mana = Math.max(0, mana - me.GetBuff(BuffId.BNLJ).num);
        }
        return mana;
    }
    // 卡牌卡面耗蓝
    protected onGetMana(me: Human): number {
        return 0;
    }
    // 是否消耗
    protected onGetIsCost(): boolean {
        return false;
    }
    // 是否持续
    protected onGetIsKeeping(): boolean {
        return false;
    }
    // 卡牌效果
    protected abstract onEffect(me: Human, he: Human);
    // 后招效果
    protected onGetSecondAct(): CardEffect {
        return null;
    }
    // 星位效果
    protected onGetStarAct(): CardEffect {
        return null;
    }
    // 云剑效果
    protected onGetYunAct(): CardEffect {
        return null;
    }
    // 击伤效果
    protected onGetHurtAct(): CardEffect {
        return null
    }

    protected _lvlVal<T>(normal: T, rare: T, legend: T): T  {
        switch(this._level) {
            case CardLevel.Normal:
                return normal;
            case CardLevel.Rare:
                return rare;
            case CardLevel.Legend:
                return legend;
        }
    }
    protected _lvlMethod(normal: Function, rare: Function, legend: Function)  {
        switch(this._level) {
            case CardLevel.Normal:
                normal && normal();
                break;
            case CardLevel.Rare:
                rare && rare();
                break;
            case CardLevel.Legend:
                legend && legend();
                break;
        }
    }
}

export class HitCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.Hit;
    onEffect(me: Human, he: Human) {
        he.GetHit(3, me, this.cardName);
    }
}