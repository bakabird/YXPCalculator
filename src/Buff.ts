
import { Human } from "./Human";


//BuffEfectStage
export enum BES {
    RoundStart,
    RoundEnd,
    BeforeHitOther,
    AnyCardEffectOver,
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

    Mana = "灵气",
    MoveAgain = "再动",
    Shield = "护甲",
    Posion = "毒",
    DC = "断肠",
    MeiKai = "梅开",
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
    ZhenMillionFlower = "万花迷魂阵",

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

    // #region 阵
    // 引雷
    Yinlei = "引雷",
    // 碎杀
    Suisha = "碎杀",
    // #endregion

    Huntianyin = "浑天印",
    Hunyuanwuji = "混元无极",
    Wuxingtiansui = "五行天髓",
}

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

    public static IsDebuff(buffId: BuffId) {
        return [BuffId.Posion, BuffId.Weak, BuffId.Flaw].indexOf(buffId) != -1;
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

export class Record_AtkTime extends EmptyBuff {
    id: BuffId = BuffId.Record_AtkTime;
}

export class Record_KeepingCardUseTime extends EmptyBuff {
    id: BuffId = BuffId.Record_KeepingCardUseTime;
}

export class MeiKaiBuff extends ABuff {
    id: BuffId = BuffId.MeiKai;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

export class ProtectBuff extends ABuff {
    id: BuffId = BuffId.Protect;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

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

export class DCBuff extends ABuff {
    id: BuffId = BuffId.DC;
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

export class ManaBuff extends ABuff {
    id: BuffId = BuffId.Mana;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

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

export class MoveAgainIng extends EmptyBuff {
    id: BuffId = BuffId.MoveAgainIng;
}

export class HuangQueBuff extends ABuff {
    id: BuffId = BuffId.HuangQue;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

export class YunJianBuff extends ABuff {
    id: BuffId = BuffId.YunJian;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

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

export class PierceBuff extends ABuff {
    id: BuffId = BuffId.Pierce;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

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

export class CrazySwordBuff extends ABuff {
    id: BuffId = BuffId.CrazySword;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

export class YunSoftBuff extends ABuff {
    id: BuffId = BuffId.YunSoft;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

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

export class PowerBuff extends ABuff {
    id: BuffId = BuffId.Power;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

export class DepowerBuff extends ABuff {
    id: BuffId = BuffId.Depower;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

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

export class BNLJBuff extends ABuff {
    id: BuffId = BuffId.BNLJ;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

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

export class CrazyMoveZeroBuff extends ABuff {
    id: BuffId = BuffId.CrazyMoveZero;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

export class HpStealBuff extends ABuff {
    id: BuffId = BuffId.HpSteal;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class StarPowerBuff extends ABuff {
    id: BuffId = BuffId.StarPower;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

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

export class MindBuff extends ABuff {
    id: BuffId = BuffId.Mind;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

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

export class SixyaoBuff extends ABuff {
    id: BuffId = BuffId.Sixyao;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class CountershockBuff extends ABuff {
    id: BuffId = BuffId.Countershock;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

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

export class DecalEchoBuff extends ABuff {
    id: BuffId = BuffId.DecalEcho;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

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
            this._owner.GetAnother().AddBuffById(BuffId.Depower, 1, this.id)
            this._owner.AddBuffById(this.id, -1, "消耗");
        }
    }

}

export class MuBuff extends ABuff {
    id: BuffId = BuffId.Mu;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }
}
export class TuBuff extends ABuff {
    id: BuffId = BuffId.Tu;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}
export class HuoBuff extends ABuff {
    id: BuffId = BuffId.Huo;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}
export class ShuiBuff extends ABuff {
    id: BuffId = BuffId.Shui;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }
}
export class JinBuff extends ABuff {
    id: BuffId = BuffId.Jin;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }
}

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

export class SharpBuff extends ABuff {
    id: BuffId = BuffId.Sharp;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

export class BanSharp extends ABuff {
    id: BuffId = BuffId.BanSharp;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}

export class TuZhenBuff extends ABuff {
    id: BuffId = BuffId.TuZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class JinZhenBuff extends ABuff {
    id: BuffId = BuffId.JinZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class MuZhenBuff extends ABuff {
    id: BuffId = BuffId.MuZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

export class HuoZhenBuff extends ABuff {
    id: BuffId = BuffId.HuoZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

export class ShuiZhenBuff extends ABuff {
    id: BuffId = BuffId.ShuiZhen;
    getEffectOrder(stage: BES): BO {
        return BO.None
    }
    effect(stage: BES) {
    }

}

export class Huntianyin extends ABuff {
    id: BuffId = BuffId.Huntianyin;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class Suiyan extends ABuff {
    id: BuffId = BuffId.Suiyan;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {

    }

}

export class Duanya extends ABuff {
    id: BuffId = BuffId.Duanya;
    getEffectOrder(stage: BES): BO {
        return BO.None;
    }
    effect(stage: BES) {
    }

}



export class Quanyong extends EmptyBuff { id: BuffId = BuffId.Quanyong; }

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

export class Yinlei extends ABuff {
    id: BuffId = BuffId.Yinlei;
    private _hurt: number = 4;
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
                this._owner.GetAnother().SimpleGetHit(this._hurt, this.id);
                this.ModNum(-1);
            }
        }
    }

}

export class Suisha extends EmptyBuff { id: BuffId = BuffId.Suisha; }

export class Hebahuan extends EmptyBuff { id: BuffId = BuffId.Hebahuan; }
export class Hunyuanwuji extends EmptyBuff { id: BuffId = BuffId.Hunyuanwuji; }
export class Wuxingtiansui extends EmptyBuff { id: BuffId = BuffId.Wuxingtiansui; }


var AllBuffType = [
    Record_AtkTime, Record_KeepingCardUseTime, MoveAgainIng,
    PosionBuff, ManaBuff, DCBuff, MeiKaiBuff, MoveAgainBuff,
    HuangQueBuff, ProtectBuff, YunJianBuff, ShieldBuff,
    PierceBuff, SwordMenaingBuff, CrazySwordBuff, YunSoftBuff,
    InternalShieldBuff, PowerBuff, BNLJBuff, ManaGatherBuff,
    ManaGatherSlowBuff, WaterMoonBuff, CrazyMoveZeroBuff, HpStealBuff,
    StarPowerBuff, GuaBuff, WeakBuff, MindBuff, FlawBuff, SixyaoBuff,
    CountershockBuff, XingDuanBuff, DecalEchoBuff, ZhenMillionFlowerBuff,
    DepowerBuff, Suiyan, BanSharp,
    MuBuff, JinBuff, ShuiBuff, HuoBuff, TuBuff,
    TuZhenBuff, JinZhenBuff, MuZhenBuff, HuoZhenBuff, ShuiZhenBuff,
    WaterFlowBuff, SharpBuff, Duanya, Tiegu, Quanyong, Qiandun, Hebahuan,
    Huntianyin, Hunyuanwuji, Wuxingtiansui,
    Yinlei, Suisha,
]

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