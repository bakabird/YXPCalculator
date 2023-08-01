
import BuffCfg from "./BuffCfg";
import { Human } from "./Human";
import { GenPush2Arr } from "./decorator";


//BuffEfectStage
export enum BES {
    RoundStart,
    RoundEnd,
    BeforeHitOther,
    // 【任意卡牌生效后】考虑 神来之笔/回响阵纹 的情况噢。
    AnyCardEffectOver,
    // 【任意卡牌行动后】
    AnyCardActionOver,
    MoveAgain,
    CALL_BY_CODE,
}

export enum BO {
    First = "第一",
    Second = "其次",
    Third = "中",
    Four = "倒二",
    Last = "倒数",
    None = "不生效",
}

export enum BuffId {
    MoveAgainIng = "再动进行中",
    Record_AtkTime = "攻击次数",
    Record_KeepingCardUseTime = "持续牌使用次数",
    Record_QinCardUseTime = "琴卡使用次数",
    Record_ShouPai = "手牌数",

    Mana = "灵气",
    MoveAgain = "再动",
    Shield = "护甲",
    Posion = "毒",
    MeiKai = "梅开",
    // 束缚
    Shufu = "束缚",
    HuangQue = "黄雀",
    Protect = "护体",
    YunJian = "云剑",
    Pierce = "无视防御",
    SwordMenaing = "剑意",
    CrazySword = "狂剑",
    YunSoft = "柔云",
    InternalShield = "内甲",
    Power = "攻",
    Depower = "减攻",
    ManaGatherSlow = "慢聚灵",
    ManaGather = "聚灵",
    BNLJ = "百鸟灵剑",
    WaterMoon = "水月",
    CrazyMoveZero = "狂零",
    HpSteal = "吸血",
    StarPower = "星力",
    Gua = "卦",
    Weak = "虚弱",
    Mind = "静气",
    Flaw = "破绽",
    Sixyao = "六爻",
    Countershock = "反震",
    XingDuan = "星断",
    DecalEcho = "回响阵纹",

    Mu = "木灵",
    Huo = "火灵",
    Shui = "水灵",
    Tu = "土灵",
    Jin = "金灵",

    TuZhen = "土灵阵",
    JinZhen = "金灵阵",
    MuZhen = "木灵阵",
    HuoZhen = "火灵阵",
    ShuiZhen = "水灵阵",

    WaterFlow = "水势",
    Sharp = "锋锐",
    BanSharp = "封印-锋锐",
    Suiyan = "碎岩",
    Duanya = "断崖", // 防减 成 攻击
    Quanyong = "泉涌",
    Tiegu = "铁骨", // 绝对值减伤
    Qiandun = "潜遁", // 百分比减伤
    Hebahuan = "合八荒",

    // #region 琴 
    // 逍遥
    Xiaoyao = "逍遥",
    // 幻音
    Huanyin = "幻音",
    // 断肠
    DuanChang = "断肠",
    // 狂舞
    Kuangwu = "狂舞",
    // 回春
    Huichun = "回春",
    // 天音困仙
    Tianyinkunxian = "天音困仙",
    // 幽绪乱心
    Youxuluaxin = "幽绪乱心",
    // #endregion

    // #region 阵
    // 引雷
    Yinlei = "引雷",
    // 碎杀
    Suisha = "碎杀",
    // 龟甲
    Guijia = "龟甲",
    // 邪蛊
    Xiegu = "邪蛊",
    // 聚灵
    Juling = "聚灵",
    // 周天剑
    Zhoutianjian = "周天剑",
    // 辟邪
    Pixie = "辟邪",
    // 聚力
    Juli = "聚力",
    // 八门金锁
    Bamenjinsuo = "八门金锁",
    // 不动金刚
    Budongjingang = "不动金刚",
    // 万花迷魂阵
    ZhenMillionFlower = "万花迷魂阵",
    // #endregion

    // #region 画
    // 灵感
    Linggan = "灵感",
    // 运笔如飞
    Yunbirufei = "运笔如飞",
    YunbirufeiWait = "运笔如飞·蓄",
    // 画龙点睛
    Hualongdianjing = "画龙点睛",

    // #endregion

    // #region 植
    // 硬枝竹
    Yingzhizhu = "硬枝竹",
    // 叶盾花
    Yedunhua = "叶盾花",
    // 叶刃花
    Yerenhua = "叶刃花",
    // 冰封雪莲
    BingFengXueLian = "冰封雪莲",
    // 缚仙古藤
    FuXianGuTeng = "缚仙古藤",
    // 噬仙古藤
    ShiXianGuTeng = "噬仙古藤",
    // #endregion

    Huntianyin = "浑天印",
    Hunyuanwuji = "混元无极",
    Wuxingtiansui = "五行天髓",
    Huifu = "恢复",
    // 无极卦盘
    WujiGuapan = "无极卦盘",
    // 七星定魂
    QiXingDingHun = "七星定魂",
    // 星月折扇
    XingYueZheShan = "星月折扇",
    // 水灵·春雨
    ShuiLingChunYu = "水灵·春雨",
    // 锟铻金环
    KunWuJinHuan = "锟铻金环",
}

var AllBuffType = []
var Buff = GenPush2Arr(AllBuffType)

export abstract class ABuff {
    abstract id: BuffId;
    protected _num: number;
    protected _owner: Human;
    public get num(): number {
        return this._num;
    }
    public ModNum(offset: number) {
        if (offset == 0) return;
        this._num += offset;
    }
    public init(owner: Human, num: number) {
        this._owner = owner;
        this._num = num;
    };
    abstract getEffectOrder(stage: BES): BO;
    abstract effect(stage: BES);
    public toString(): string {
        return `${this.id}(${this._num}层)`
    }

    public static Debuffs: Array<BuffId> = [BuffId.Posion, BuffId.Weak, BuffId.Flaw, BuffId.Depower, BuffId.Shufu]

    public static IsDebuff(buffId: BuffId) {
        return this.Debuffs.indexOf(buffId) != -1;
    }
    public static IsActiveWuxing(buffId: BuffId) {
        return [BuffId.Jin, BuffId.Mu, BuffId.Shui, BuffId.Huo, BuffId.Tu].indexOf(buffId) != -1;
    }
}

abstract class EmptyBuff extends ABuff {
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class Record_AtkTime extends EmptyBuff {
    id: BuffId = BuffId.Record_AtkTime;
}

@Buff
export class Record_KeepingCardUseTime extends EmptyBuff {
    id: BuffId = BuffId.Record_KeepingCardUseTime;
}

@Buff
export class Record_QinCardUseTime extends EmptyBuff {
    id: BuffId = BuffId.Record_QinCardUseTime;
}

@Buff
export class Record_ShouPai extends EmptyBuff {
    id: BuffId = BuffId.Record_ShouPai;

}

@Buff
export class MeiKaiBuff extends ABuff {
    id: BuffId = BuffId.MeiKai;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class ProtectBuff extends ABuff {
    id: BuffId = BuffId.Protect;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}
@Buff
export class PosionBuff extends ABuff {
    id = BuffId.Posion;
    getEffectOrder(stage: BES): BO {
        switch (stage) {
            case BES.RoundStart:
                return BO.Last;
            default:
                return BO.None;
        }
    }
    effect(stage: BES) {
        switch (stage) {
            case BES.RoundStart:
                this._owner.CutHp(this.num, "毒发");
                break;
            default:
                break;
        }
    }
}
@Buff
export class ShuiLingChunYu extends ABuff {
    id = BuffId.ShuiLingChunYu;
    getEffectOrder(stage: BES): BO {
        switch (stage) {
            case BES.RoundStart:
                return BO.Last;
            default:
                return BO.None;
        }
    }
    effect(stage: BES) {
        switch (stage) {
            case BES.RoundStart:
                this._owner.AddBuffById(BuffId.WaterFlow, 1, this.id)
                break;
            default:
                break;
        }
    }
}
@Buff
export class KunWuJinHuan extends EmptyBuff {
    id: BuffId = BuffId.KunWuJinHuan;

}
@Buff
export class HuifuBuff extends ABuff {
    id = BuffId.Huifu;
    getEffectOrder(stage: BES): BO {
        switch (stage) {
            case BES.RoundStart:
                return BO.First;
            default:
                return BO.None;
        }
    }
    effect(stage: BES) {
        switch (stage) {
            case BES.RoundStart:
                this._owner.AddHp(this.num, this.id);
                this._owner.AddBuffById(this.id, -1, "消耗")
                break;
            default:
                break;
        }
    }
}
@Buff
export class DuanChang extends ABuff {
    id: BuffId = BuffId.DuanChang;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            var Buff = new PosionBuff();
            Buff.init(this._owner, this.num);
            this._owner.AddBuff(Buff, this.id);
        }
    }


}

@Buff
export class ManaBuff extends ABuff {
    id: BuffId = BuffId.Mana;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class MoveAgainBuff extends ABuff {
    id: BuffId = BuffId.MoveAgain;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) return BO.First;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.RemoveBuff(this.id, "回合结束");
        }
    }
}

@Buff
export class MoveAgainIng extends EmptyBuff {
    id: BuffId = BuffId.MoveAgainIng;
}

@Buff
export class HuangQueBuff extends ABuff {
    id: BuffId = BuffId.HuangQue;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class YunJianBuff extends ABuff {
    id: BuffId = BuffId.YunJian;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class ShieldBuff extends ABuff {
    id: BuffId = BuffId.Shield;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            if (!this._owner.CheckBuff(BuffId.WaterMoon, 1)) {
                this._owner.AddBuff(
                    BuffFactory.me.Produce(this.id, this._owner, -Math.ceil(this.num / 2)), "回合削减")
            }
        }
    }

}

@Buff
export class PierceBuff extends ABuff {
    id: BuffId = BuffId.Pierce;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class SwordMenaingBuff extends ABuff {
    private _effectedNum: number = 0;
    id: BuffId = BuffId.SwordMenaing;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.BeforeHitOther) {
            return BO.Last;
        } else if (stage == BES.AnyCardEffectOver) {
            return BO.Last;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.BeforeHitOther) {
            this._effectedNum = this.num;
        } else if (stage == BES.AnyCardEffectOver) {
            if (this._effectedNum > 0) {
                this._owner.AddBuffById(this.id, -this._effectedNum, "剑意耗尽");
                this._effectedNum = 0;
            }
        }
    }

}

@Buff
export class CrazySwordBuff extends ABuff {
    id: BuffId = BuffId.CrazySword;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class YunSoftBuff extends ABuff {
    id: BuffId = BuffId.YunSoft;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class InternalShieldBuff extends ABuff {
    id: BuffId = BuffId.InternalShield;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.AddBuffById(BuffId.Shield, this._num, this.id);
            this._owner.RemoveBuff(this.id, "耗尽");
        }
    }

}

@Buff
export class PowerBuff extends ABuff {
    id: BuffId = BuffId.Power;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class DepowerBuff extends ABuff {
    id: BuffId = BuffId.Depower;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class ManaGatherSlowBuff extends ABuff {
    id: BuffId = BuffId.ManaGatherSlow;
    private _count: number = 0;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._count++;
            if (this._count >= 2) {
                this._owner.RecoverMana(this._num, this.id);
                this._count = 0;
            }
        }
    }
}

@Buff
export class ManaGatherBuff extends ABuff {
    id: BuffId = BuffId.ManaGather
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.RecoverMana(this._num, this.id);
        }
    }
}

@Buff
export class BNLJBuff extends ABuff {
    id: BuffId = BuffId.BNLJ;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class WaterMoonBuff extends ABuff {
    id: BuffId = BuffId.WaterMoon;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) return BO.Last;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }

}

@Buff
export class CrazyMoveZeroBuff extends ABuff {
    id: BuffId = BuffId.CrazyMoveZero;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class HpStealBuff extends ABuff {
    id: BuffId = BuffId.HpSteal;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class StarPowerBuff extends ABuff {
    id: BuffId = BuffId.StarPower;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class GuaBuff extends ABuff {
    id: BuffId = BuffId.Gua;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.CALL_BY_CODE) {
            this._owner.AddBuffById(this.id, -1, "卦象");
        }
    }
}

@Buff
export class WeakBuff extends ABuff {
    id: BuffId = BuffId.Weak;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) return BO.First;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.AddBuffById(this.id, -1, "回合结束");
        }
    }

}

@Buff
export class YingzhizhuBuff extends ABuff {
    id: BuffId = BuffId.Yingzhizhu;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) return BO.Last;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            const atk = Math.floor(this._owner.NumOf(BuffId.Shield) / BuffCfg.Yingzhizhu_shiled2atk) * this._num;
            if (atk > 0) {
                this._owner.GetAnother().SimpleGetHit(atk, BuffId.Yingzhizhu);
            }
        }
    }

}

@Buff
export class Yedunhua extends EmptyBuff {
    id: BuffId = BuffId.Yedunhua;
}

@Buff
export class Yerenhua extends EmptyBuff {
    id: BuffId = BuffId.Yerenhua;
}

@Buff
export class MindBuff extends ABuff {
    id: BuffId = BuffId.Mind;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class FlawBuff extends ABuff {
    id: BuffId = BuffId.Flaw;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) return BO.First;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.AddBuffById(this.id, -1, "回合结束");
        }
    }

}

@Buff
export class SixyaoBuff extends ABuff {
    id: BuffId = BuffId.Sixyao;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class CountershockBuff extends ABuff {
    id: BuffId = BuffId.Countershock;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class XingDuanBuff extends ABuff {
    id: BuffId = BuffId.XingDuan;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.Last;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            while (this._num--) {
                this._owner.ShiftCard();
            }
            this._owner.RemoveBuff(this.id, this.id);
        }
    }

}

@Buff
export class DecalEchoBuff extends ABuff {
    id: BuffId = BuffId.DecalEcho;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class ZhenMillionFlowerBuff extends ABuff {
    id: BuffId = BuffId.ZhenMillionFlower;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            const he = this._owner.GetAnother();
            he.AddBuffById(BuffId.Depower, 1, this.id);
            const num = he.NumOf(BuffId.Depower);
            if (num > 0) {
                he.CutHp(num, this.id);
                this._owner.AddHp(num, this.id);
            }
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }

}

@Buff
export class MuBuff extends ABuff {
    id: BuffId = BuffId.Mu;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }
}

@Buff
export class TuBuff extends ABuff {
    id: BuffId = BuffId.Tu;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class HuoBuff extends ABuff {
    id: BuffId = BuffId.Huo;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class ShuiBuff extends ABuff {
    id: BuffId = BuffId.Shui;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }
}

@Buff
export class JinBuff extends ABuff {
    id: BuffId = BuffId.Jin;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

@Buff
export class WaterFlowBuff extends ABuff {
    id: BuffId = BuffId.WaterFlow;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.First;
        } else {
            return BO.None;
        }
    }
    effect(stage: BES) {
        if (this._num > 0) {
            if (stage == BES.RoundEnd) {
                this._owner.GetAnother().SimpleGetHit(this._num, this.id);
            }
        }
    }

}

@Buff
export class SharpBuff extends ABuff {
    id: BuffId = BuffId.Sharp;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class BanSharp extends ABuff {
    id: BuffId = BuffId.BanSharp;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class TuZhenBuff extends ABuff {
    id: BuffId = BuffId.TuZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class JinZhenBuff extends ABuff {
    id: BuffId = BuffId.JinZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class MuZhenBuff extends ABuff {
    id: BuffId = BuffId.MuZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

@Buff
export class HuoZhenBuff extends ABuff {
    id: BuffId = BuffId.HuoZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

@Buff
export class ShuiZhenBuff extends ABuff {
    id: BuffId = BuffId.ShuiZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

@Buff
export class Huntianyin extends ABuff {
    id: BuffId = BuffId.Huntianyin;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class Suiyan extends ABuff {
    id: BuffId = BuffId.Suiyan;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

@Buff
export class Duanya extends ABuff {
    id: BuffId = BuffId.Duanya;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

@Buff
export class Quanyong extends EmptyBuff { id: BuffId = BuffId.Quanyong; }

@Buff
export class Tiegu extends ABuff {
    id: BuffId = BuffId.Tiegu;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }

}

@Buff
export class Qiandun extends ABuff {
    id: BuffId = BuffId.Qiandun;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }
    public static apply(me: Human, hurt: number) {
        const meQiandun = me.GetBuff(BuffId.Qiandun);
        if (meQiandun) {
            return Math.max(1, Math.floor(hurt * 0.6));
        } else {
            return hurt;
        }
    }
}

@Buff
export class Yinlei extends ABuff {
    id: BuffId = BuffId.Yinlei;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.First
        } else {
            return BO.None
        }
    }
    effect(stage: BES) {
        if (this._num > 0) {
            if (stage == BES.RoundEnd) {
                this._owner.GetAnother().SimpleGetHit(BuffCfg.YinLei_Hurt, this.id);
                this.ModNum(-1);
            }
        }
    }

}

@Buff
export class Guijia extends ABuff {
    id: BuffId = BuffId.Guijia;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.First
        } else {
            return BO.None
        }
    }
    effect(stage: BES) {
        if (this._num > 0) {
            if (stage == BES.RoundEnd) {
                this._owner.AddBuffById(BuffId.Shield, BuffCfg.Guijia_Shield, BuffId.Guijia);
                this.ModNum(-1);
            }
        }
    }

}

@Buff
export class Xiegu extends ABuff {
    id: BuffId = BuffId.Xiegu;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First
        } else {
            return BO.None
        }
    }
    effect(stage: BES) {
        if (this._num > 0) {
            if (stage == BES.RoundStart) {
                this._owner
                    .GetAnother()
                    .AddBuffById(BuffId.Posion, BuffCfg.Xiegu_Poison, BuffId.Xiegu);
                this.ModNum(-1);
            }
        }
    }

}

@Buff
export class WujiGuapan extends ABuff {
    id: BuffId = BuffId.WujiGuapan;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First
        }
        return BO.None
    }
    effect(stage: BES) {
        if (this._num > 0) {
            if (stage == BES.RoundStart) {
                this._owner.AddBuffById(BuffId.Gua, this._num, this.id);
            }
        }
    }
}

@Buff
export class Juling extends ABuff {
    id: BuffId = BuffId.Juling;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First
        } else {
            return BO.None
        }
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            if (this._num > 0) {
                this._owner.RecoverMana(BuffCfg.Juling_Mana)
                this.ModNum(-1);
            }
        }
    }

}

export class Juli extends ABuff {
    id: BuffId = BuffId.Juli;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.First;
        } else {
            return BO.None
        }
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            if (this._num > 0) {
                this._owner.AddBuffById(BuffId.Power, BuffCfg.Juli_Power, BuffId.Juli);
                this.ModNum(-1);
            }
        }
    }

}

@Buff
export class Bamenjinsuo extends ABuff {
    id: BuffId = BuffId.Bamenjinsuo;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.MoveAgain) {
            return BO.Third;
        } else {
            return BO.None;
        }
    }
    effect(stage: BES) {
        if (stage == BES.MoveAgain) {
            this._owner.SimpleGetHit(BuffCfg.Bamenjinsuo_Hurt, this.id);
            this.ModNum(-1);
        }
    }

}

@Buff
export class Budongjingang extends ABuff {
    id: BuffId = BuffId.Budongjingang;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.AddBuffById(BuffId.Shield, BuffCfg.Budongjingang_Shield, this.id)
            if (this._owner.CheckBuff(BuffId.MoveAgainIng, 1)) {
                this._owner.AddMaxHp(BuffCfg.Budongjingang_Hp, this.id)
                this._owner.AddHp(BuffCfg.Budongjingang_Hp, this.id);
            }
            this.ModNum(-1)
        }
    }

}

@Buff
export class Huanyin extends ABuff {
    id: BuffId = BuffId.Huanyin;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundStart) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundStart) {
            this._owner.CutHp(this._num, this.id);
            this._owner.AddBuffById(BuffId.Shield, this._num, this.id);
        }
    }

}

@Buff
export class Huichun extends ABuff {
    id: BuffId = BuffId.Huichun;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.AddMaxHp(this._num, this.id);
            this._owner.AddHp(this._num, this.id);
        }
    }

}

@Buff
export class Youxuluaxin extends ABuff {
    id: BuffId = BuffId.Youxuluaxin;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.BeforeHitOther) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.BeforeHitOther) {
            this._owner.CutHp(this._num, this.id);
        }
    }

}

@Buff
export class YunbirufeiWait extends ABuff {
    id: BuffId = BuffId.YunbirufeiWait;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.AnyCardActionOver) {
            return BO.Third;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.AnyCardActionOver) {
            this._owner.AddBuffById(BuffId.Yunbirufei, this._num, this.id);
            this._owner.RemoveBuff(this.id, "耗尽");
        }
    }

}

@Buff
export class Yunbirufei extends ABuff {
    id: BuffId = BuffId.Yunbirufei;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.AnyCardActionOver) {
            return BO.First;
        }
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.AnyCardActionOver) {
            this._owner.AddBuffById(BuffId.MoveAgain, 1, this.id);
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }

}

@Buff
export class Suisha extends EmptyBuff { id: BuffId = BuffId.Suisha; }
@Buff
export class Hebahuan extends EmptyBuff { id: BuffId = BuffId.Hebahuan; }
@Buff
export class Hunyuanwuji extends EmptyBuff { id: BuffId = BuffId.Hunyuanwuji; }
@Buff
export class Wuxingtiansui extends EmptyBuff { id: BuffId = BuffId.Wuxingtiansui; }
@Buff
export class Zhoutianjian extends EmptyBuff { id: BuffId = BuffId.Zhoutianjian; }
@Buff
export class Shufu extends ABuff {
    id: BuffId = BuffId.Shufu;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.RoundEnd) return BO.Last;
        return BO.None;
    }
    effect(stage: BES) {
        if (stage == BES.RoundEnd) {
            this._owner.AddBuffById(this.id, -1, this.id);
        }
    }
}
@Buff
export class Pixie extends EmptyBuff { id: BuffId = BuffId.Pixie }
@Buff
export class Xiaoyao extends EmptyBuff {
    id: BuffId = BuffId.Xiaoyao;
}
@Buff
export class Kuangwu extends EmptyBuff {
    id: BuffId = BuffId.Kuangwu;

}
@Buff
export class Tianyinkunxian extends EmptyBuff {
    id: BuffId = BuffId.Tianyinkunxian;

}
@Buff
export class Hualongdianjing extends EmptyBuff {
    id: BuffId = BuffId.Hualongdianjing;
}
@Buff
export class BingFengXueLian extends EmptyBuff {
    id: BuffId = BuffId.BingFengXueLian;
}
@Buff
export class FuXianGuTeng extends EmptyBuff {
    id: BuffId = BuffId.FuXianGuTeng;
}
@Buff
export class QiXingDingHun extends EmptyBuff {
    id: BuffId = BuffId.QiXingDingHun;
}
@Buff
export class XingyueZheshan extends EmptyBuff {
    id: BuffId = BuffId.XingYueZheShan;
}
@Buff
export class ShiXianGuTeng extends ABuff {
    id: BuffId = BuffId.ShiXianGuTeng;
    getEffectOrder(stage: BES): BO {
        if (stage == BES.MoveAgain) {
            return BO.Third;
        } else {
            return BO.None;
        }
    }
    effect(stage: BES) {
        if (stage == BES.MoveAgain) {
            this._owner.CutHp(this._num, this.id);
            this._owner.GetAnother().AddHp(this._num, this.id);
        }
    }

}


export class BuffFactory {
    private static _me: BuffFactory;
    public static get me(): BuffFactory {
        if (!BuffFactory._me) {
            BuffFactory._me = new BuffFactory();
        }
        return BuffFactory._me;
    }

    private _dict: {};
    private constructor() {
        this._dict = {};
        AllBuffType.forEach((buffType) => {
            var buffInstance = new buffType();
            this._dict[buffInstance.id] = buffType;
        })
    }

    public Produce(buffId: BuffId, owner: Human, num: number): ABuff {
        var buff = new this._dict[buffId]() as ABuff;
        buff.init(owner, num);
        return buff;
    }
}