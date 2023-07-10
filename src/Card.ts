import { BES, BuffFactory, BuffId } from "./Buff";
import BuffCfg from "./BuffCfg";
import { Human } from "./Human";
import LogEncode from "./LogEncode";
import { GenPush2Arr } from "./decorator";

export var GongCards = []

/**带“攻”的卡 */
export var Gong = GenPush2Arr(GongCards);

//#region CARD

export enum CardName {
    Hit = "普通攻击",
    DCTune = "断肠曲",
    FeiTa = "飞鸿踏雪",
    TongXin = "同心曲",
    MeiKai = "梅开二度",
    HuangQue = "黄雀在后",

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
    YunSoftMental = "柔云心法",
    YunWuli = "云剑·无妄",
    YunPointStar = "云剑·点星",
    YunHuiling = "云剑·汇灵",
    CloudDanceFormula = "云舞诀",
    DarkCrowManaSword = "暗鸦灵剑",
    BreakingQiSword = "破气剑",
    GiantRocManaSword = "巨鹏灵剑",
    ReflexiveSword = "反身剑",
    MirrorFlowerSwordArray = "镜花剑阵",
    ThreePeakSword = "三峰剑",
    YunFlashingWind = "云剑·闪风",
    YunMoonShadow = "云剑·月影",
    ManaGatherMental = "聚灵心法",
    BNLJFormula = "百鸟灵剑诀",
    EgretManaSword = "白鹭灵剑",
    GiantKunManaSword = "巨鲲灵剑",
    InspirationSword = "灵感剑",
    YunCrashSnow = "云剑·崩雪",
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
    FlyingStar = "飞星刺",
    XingDian = "星弈·点",
    XingLi = "星弈·立",
    GuaGen = "艮卦",
    GuaKan = "坎卦",
    Thunder = "落雷术",
    DigRoot = "斩草除根",
    OneFoot = "金鸡独立",
    MindMental = "静气心法",
    FallingFlower = "落花有意",
    ImbuedRainbow = "气贯长虹",
    StarAroundMoon = "众星拱月",
    XingDa = "星弈·打",
    GuaDui = "兑卦",
    WhiteSnake = "白蛇吐信",
    ThunderGuaFormula = "御雷卦诀",
    LiangyiArray = "两仪阵",
    FlowingWater = "流水无情",
    QiRecover = "气疗术",
    DryTree = "枯木逢春",
    TangLang = "螳螂捕蝉",
    HaiDi = "海底捞月",
    XingFei = "星弈·飞",
    XingHu = "星弈·虎",
    SixyaoArray = "六爻绝阵",
    GuaLi = "离卦",
    StarOrbit = "星轨推衍",
    TouchWater = "蜻蜓点水",
    DoubleThunder = "轰雷掣电",
    CountershockMental = "反震心法",
    GoldChan = "金蝉脱壳",
    BeiGong = "杯弓蛇影",
    WorldCenterMental = "天元心法",
    XingDuan = "星弈·断",
    GuaQian = "乾卦",
    FiveThunder = "五雷轰顶",
    PurpleMana = "紫气东来",

    // #region 五行道盟

    // 炼器期
    Mu_yin = "木灵印",
    Mu_ya = "木灵·芽",
    Huo_yin = "火灵印",
    Huo_cuan = "火灵·窜",
    Tu_yin = "土灵印",
    Tu_sui = "土灵·碎",
    Jin_yin = "金灵印",
    Jin_zhen = "金灵·针",
    Shui_yin = "水灵印",
    Shui_tao = "水灵·涛",
    Wuxingc = "五行刺",

    // 筑基期
    Mu_fusu = "木灵·复苏",
    Mu_shuying = "木灵·疏影",
    Huo_juyan = "火灵·聚炎",
    Huo_chiyan = "火灵·赤焰",
    Tu_zhen = "土灵阵",
    Tu_qunshan = "土灵·群山",
    Jin_zhenArray = "金灵阵",
    Jin_chuanxin = "金灵·穿心",
    Shui_bolan = "水灵·波澜",
    Shui_xiongyong = "水灵·汹涌",
    Huntianyin = "浑天印",

    // 金丹期
    Mu_zhen = "木灵阵",
    Mu_Xunlin = "木灵·巡林",
    Huo_zhen = "火灵阵",
    Huo_honbao = "火灵·轰爆",
    Tu_yangchen = "土灵·扬尘",
    Tu_duanya = "土灵·断崖",
    Jin_xurui = "金灵·蓄锐",
    Jin_fengmang = "金灵·锋芒",
    Shui_zhen = "水灵阵",
    Shui_quanyong = "水灵·泉涌",
    Wuxingflow = "五行流转",

    // 元婴期
    Mu_anxiang = "木灵·暗香",
    Mu_meici = "木灵·玫刺",
    Huo_shunran = "火灵·瞬燃",
    Huo_zhuoxin = "火灵·灼心",
    Tu_juebi = "土灵·绝壁",
    Tu_liusha = "土灵·流沙",
    Jin_feisuo = "金灵·飞梭",
    Jin_tiegu = "金灵·铁骨",
    Shui_tenglang = "水灵·腾浪",
    Shui_qiandun = "水灵·潜遁",
    Hunyuansj = "混元碎击",

    // 化神期
    Mu_liufengfei = "木灵·柳纷飞",
    Huo_lieliaoyuan = "火灵·烈燎原",
    Tu_hebahuan = "土灵·合八荒",
    Jin_judiluo = "金灵·巨鼎落",
    Shui_nabaichuan = "水灵·纳百川",
    Hunyuan_wuji = "混元无极阵",
    WuXing_tiansuijue = "五行天髓诀",

    // #endregion

    // #region 阵法

    // 引雷阵
    YinLeiZhen = "引雷阵",
    // 碎杀阵
    SuiShaZhen = "碎杀阵",
    // 冲击阵纹
    ChongJiZhenWen = "冲击阵纹",



    // 龟甲阵
    GuiJiaZhen = "龟甲阵",
    // 邪蛊阵
    XieGuZhen = "邪蛊阵",
    // 疗愈阵纹
    LiaoYuZhenWen = "疗愈阵纹",



    // 聚灵阵
    JuLingZhen = "聚灵阵",
    // 周天剑阵
    ZhouTianJianZhen = "周天剑阵",
    // 辟邪阵纹
    PiXieZhenWen = "辟邪阵纹",



    // 天罡聚力阵
    TianGangJuLiZhen = "天罡聚力阵",
    // 八门金锁阵
    BaMenJinSuoZhen = "八门金锁阵",
    // 不动金刚阵
    BuDongJinGangZhen = "不动金刚阵",


    DecalEcho = "回响阵纹",
    ZhenMillionFlower = "万花迷魂阵",
    // 须弥阵纹
    XuMiZhenWen = "须弥阵纹",

    // #endregion

    // #region 丹

    // 地灵丹
    DiLingDan = "地灵丹",
    // 培元丹
    PeiYuanDan = "培元丹",
    // 小还丹
    XiaoHuanDan = "小还丹",


    // 锻体丹
    DuanTiDan = "锻体丹",
    // 飞云丹
    FeiYunDan = "飞云丹",
    // 驱邪丹
    QuXieDan = "驱邪丹",


    // 还魂丹
    HuanHunDan = "还魂丹",
    // 疗伤丹
    LiaoShangDan = "疗伤丹",
    // 神力丹
    ShenLiDan = "神力丹",


    // 大还丹
    DaHuanDan = "大还丹",
    // 聚灵丹
    JuLingDan = "聚灵丹",
    // 洗髓丹
    XiSuiDan = "洗髓丹",


    // 冰灵护体丹
    BingLingHuTiDan = "冰灵护体丹",
    // 锻体玄丹
    DuanTiXuanDan = "锻体玄丹",
    // 悟道丹
    WuDaoDan = "悟道丹",

    // #endregion

    // #region 符师

    // 奔雷符
    BenLeiFu = "奔雷符",
    // 护灵符
    HuLingFu = "护灵符",
    // 锐金符
    RuiJinFu = "锐金符",



    // 火云符
    HuoYunFu = "火云符",
    // 清心咒
    QingXinZhou = "清心咒",
    // 水气符
    ShuiQiFu = "水气符",



    // 寒冰咒
    HanBingZhou = "寒冰咒",
    // 吸灵符
    XiLingFu = "吸灵符",
    // 瘴气符
    ZhangQiFu = "瘴气符",



    // 聚气咒
    JuQiZhou = "聚气咒",
    // 扰心符
    RaoXinFu = "扰心符",
    // 弱体符
    RuoTiFu = "弱体符",



    // 镇魂封元符
    ZhenHunFengYuanFu = "镇魂封元符",
    // 千里神行符
    QianLiShenXingFu = "千里神行符",
    // 万邪入体咒
    WanXieRuTiZhou = "万邪入体咒",

    // #endregion

    // #region 角色卡
    Youranhl = "悠然葫芦",
    // #endregion

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

export type CardEffect = (me: Human, he: Human) => void;

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
    public get isMu(): boolean {
        return this.cardName.startsWith("木灵")
    }
    public get isShui(): boolean {
        return this.cardName.startsWith("水灵")
    }
    public get isJin(): boolean {
        return this.cardName.startsWith("金灵")
    }
    public get isHuo(): boolean {
        return this.cardName.startsWith("火灵")
    }
    public get isTu(): boolean {
        return this.cardName.startsWith("土灵")
    }
    public get isWuxing(): boolean {
        return this.isTu || this.isHuo || this.isJin || this.isShui || this.isMu;
    }
    // 持续卡?
    public get isKeeping(): boolean {
        return this.onGetIsKeeping();
    }
    init(level: CardLevel) {
        this._level = level;
        this._useNum = 0;
    };
    public decUseNum() {
        this._useNum--;
    }
    public effect(me: Human, he: Human) {
        const secondAct = this.onGetSecondAct();
        const starAct = this.onGetStarAct();
        const yunAct = this.onGetYunAct();
        const hurtAct = this.onGetHurtAct();
        const muAct = this.onGetMuAct();
        const huoAct = this.onGetHuoAct();
        const jinAct = this.onGetJinAct();
        const shuiAct = this.onGetShuiAct();
        const tuAct = this.onGetTuAct();
        const meCrazyMoveNum = me.GetBuff(BuffId.CrazyMoveZero)?.num ?? 0;
        const meStarPowerNum = me.GetBuff(BuffId.StarPower)?.num ?? 0;
        const meHuntianNum = me.GetBuff(BuffId.Huntianyin)?.num ?? 0;
        const meTuZhenNum = me.GetBuff(BuffId.TuZhen)?.num ?? 0;
        const meJinZhenNum = me.GetBuff(BuffId.JinZhen)?.num ?? 0;
        const meMuZhenNum = me.GetBuff(BuffId.MuZhen)?.num ?? 0;
        const meHuoZhenNum = me.GetBuff(BuffId.HuoZhen)?.num ?? 0;
        const meShuiZhenNum = me.GetBuff(BuffId.ShuiZhen)?.num ?? 0;
        const meRecord_AtkTime = me.GetBuff(BuffId.Record_AtkTime)?.num ?? 0;
        const meZhoutianjianNum = me.GetBuff(BuffId.Zhoutianjian)?.num ?? 0;
        const oldHeHp = he.hp;
        const onStar = me.CardList.IsOnStar();
        // 前处理
        if (this.isCrazy && meCrazyMoveNum > 0) {
            me.AddBuffById(BuffId.HpSteal, meCrazyMoveNum, BuffId.CrazyMoveZero);
        }
        if (meZhoutianjianNum > 0) {
            // 周天剑阵
            me.AddBuffById(BuffId.Power, BuffCfg.Zhoutianjian_ExtraPower, BuffId.Zhoutianjian)
        }
        if (onStar && meStarPowerNum > 0) {
            me.AddBuffById(BuffId.Power, meStarPowerNum, BuffId.StarPower);
        }
        if (this.isWuxing) {
            // 浑天印
            if (meHuntianNum > 0) {
                if (this.isMu) me.AddBuffById(BuffId.Mu, 1, BuffId.Huntianyin);
                if (this.isHuo) me.AddBuffById(BuffId.Huo, 1, BuffId.Huntianyin);
                if (this.isShui) me.AddBuffById(BuffId.Shui, 1, BuffId.Huntianyin);
                if (this.isJin) me.AddBuffById(BuffId.Jin, 1, BuffId.Huntianyin);
                if (this.isTu) me.AddBuffById(BuffId.Tu, 1, BuffId.Huntianyin);
                me.AddBuffById(BuffId.Huntianyin, -1, BuffId.Huntianyin + "·发");
            }
            // 五行
            if (this.isMu && meTuZhenNum > 0) {
                me.AddBuffById(BuffId.Shield, meTuZhenNum, BuffId.TuZhen);
            }
            if (this.isJin && meJinZhenNum > 0) {
                me.AddBuffById(BuffId.Sharp, meJinZhenNum, BuffId.JinZhen);
            }
            if (this.isMu && meMuZhenNum > 0) {
                me.AddHp(meMuZhenNum, BuffId.MuZhen);
            }
            if (this.isHuo && meHuoZhenNum > 0) {
                he.CutHp(meHuoZhenNum, BuffId.HuoZhen);
                he.CutMaxHp(meHuoZhenNum, BuffId.HuoZhen);
            }
            if (this.isShui && meShuiZhenNum > 0) {
                me.RecoverMana(meShuiZhenNum, BuffId.ShuiZhen);
            }
        }
        // 卡牌效果
        this.onEffect(me, he);
        if (starAct && onStar) {
            starAct(me, he);
        }
        if (secondAct) {
            if (this._useNum > 0) {
                secondAct(me, he);
            }
            var buff = me.GetBuff(BuffId.HuangQue);
            if (buff && buff.num > 0) {
                he.GetHit(buff.num, me, buff.id);
            }
        }
        if (yunAct && me.CheckBuff(BuffId.YunJian, 1)) {
            yunAct(me, he);
        }
        if (hurtAct && he.hp < oldHeHp) {
            hurtAct(me, he);
        }
        if (this.onGetIsCost() || this.onGetIsKeeping()) {
            if (!me.CheckBuff(BuffId.DecalEcho, 1)) {
                me.CardList.CostCur();
            }
        }
        if (this.onGetIsKeeping()) {
            me.AddBuffById(BuffId.Record_KeepingCardUseTime, 1, "KeepingCardUse" + LogEncode.Ignore);
        }
        if (muAct && me.isMu) {
            muAct(me, he);
        }
        if (tuAct && me.isTu) {
            tuAct(me, he);
        }
        if (huoAct && me.isHuo) {
            huoAct(me, he);
        }
        if (shuiAct && me.isShui) {
            shuiAct(me, he);
        }
        if (jinAct && me.isJin) {
            jinAct(me, he);
        }
        // 后处理
        const everAttack = me.NumOf(BuffId.Record_AtkTime) != meRecord_AtkTime
        if (this.cardName.startsWith("云剑")) {
            const yunSoftBuff = me.GetBuff(BuffId.YunSoft);
            yunSoftBuff && me.AddHp(yunSoftBuff.num, yunSoftBuff.id);
            me.AddBuff(BuffFactory.me.Produce(BuffId.YunJian, me, 1), this.cardName);
        } else {
            me.RemoveBuff(BuffId.YunJian, "断云");
        }
        if (this.isCrazy) {
            me.AddBuffById(BuffId.CrazySword, 1, "狂!");
            if (meCrazyMoveNum > 0) {
                me.AddBuffById(BuffId.HpSteal, -meCrazyMoveNum, BuffId.CrazyMoveZero);
            }
        }
        if (onStar && meStarPowerNum > 0) {
            me.AddBuffById(BuffId.Power, -meStarPowerNum, BuffId.StarPower);
        }
        if (meZhoutianjianNum > 0) {
            // 周天剑阵
            if (everAttack) {
                me.AddBuffById(BuffId.Zhoutianjian, -1, BuffId.Zhoutianjian)
            }
            me.AddBuffById(BuffId.Power, -BuffCfg.Zhoutianjian_ExtraPower, BuffId.Zhoutianjian);
        }
        if (this.isWuxing
            && !everAttack
            && me.CheckBuff(BuffId.Wuxingtiansui, 1)
            && !me.CheckBuff(BuffId.MoveAgainIng, 1)) {
            me.AddBuffById(BuffId.Wuxingtiansui, -1, "五行天髓·发");
            me.AddBuffById(BuffId.MoveAgain, 1, BuffId.Wuxingtiansui);
        }
        // 结束
        this._useNum++;
        me.EffectBuff(BES.AnyCardEffectOver);
    }
    // 获取卡牌的实际耗蓝
    public getMana(me: Human, he: Human): number {
        let mana = this.onGetMana(me);
        if (this.cardName.endsWith("灵剑") && me.CheckBuff(BuffId.BNLJ, 1)) {
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
    // 木灵效果
    protected onGetMuAct(): CardEffect {
        return null
    }
    // 水灵效果
    protected onGetShuiAct(): CardEffect {
        return null
    }
    // 火灵效果
    protected onGetHuoAct(): CardEffect {
        return null
    }
    // 金灵效果
    protected onGetJinAct(): CardEffect {
        return null
    }
    // 土灵效果
    protected onGetTuAct(): CardEffect {
        return null
    }

    protected _lvlVal<T>(normal: T, rare: T, legend: T): T {
        switch (this._level) {
            case CardLevel.Normal:
                return normal;
            case CardLevel.Rare:
                return rare;
            case CardLevel.Legend:
                return legend;
        }
    }
    protected _lvlMethod(normal: Function, rare: Function, legend: Function) {
        switch (this._level) {
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
    /**是否五行相生目标卡 */
    public amIWuxingGen(target: ACard) {
        if (this.isMu) return target.isMu || target.isHuo;
        if (this.isHuo) return target.isHuo || target.isTu;
        if (this.isTu) return target.isTu || target.isJin;
        if (this.isJin) return target.isJin || target.isShui;
        if (this.isShui) return target.isShui || target.isMu;
        return false;
    }

    public effectCardWuxing(me: Human, log: string) {
        if (this.isJin) me.AddBuffById(BuffId.Jin, 1, log);
        if (this.isMu) me.AddBuffById(BuffId.Mu, 1, log);
        if (this.isShui) me.AddBuffById(BuffId.Shui, 1, log);
        if (this.isHuo) me.AddBuffById(BuffId.Huo, 1, log);
        if (this.isTu) me.AddBuffById(BuffId.Tu, 1, log);
    }
}

export class HitCard extends ACard {
    cardState: CardState = CardState.LianQi;
    cardName: CardName = CardName.Hit;
    onEffect(me: Human, he: Human) {
        he.GetHit(3, me, this.cardName);
    }
}