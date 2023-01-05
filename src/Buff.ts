
import { extname } from "path";
import { Human } from "./Human";


//BuffEfectStage
export enum BES {
    RoundStart,
    BeforeHitOther,
    AnyCardEffectOver,
}

export enum BO {
    First = "第一",
    Second = "其次",
    Third = "中",
    Four = "倒二",
    Last = "倒数",
}

export enum BuffId {
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
}

export abstract class ABuff {
    abstract id: BuffId;
    protected _num: number;
    protected _owner: Human;
    public get num(): number {
        return this._num;
    }
    public ModNum(offset: number) {
        this._num += offset;
    }
    public init(owner: Human, num: number){
        this._owner = owner;
        this._num = num;
    };
    abstract getEffectOrder(stage: BES): BO;
    abstract effect(stage: BES);
    public toString(): string {
        return `${this.id}(${this._num}层)`
    }

    public static IsDebuff(buffId: BuffId) {
        return [BuffId.Posion].indexOf(buffId) != -1;
    }
}

export class MeiKaiBuff extends ABuff {
    id: BuffId = BuffId.MeiKai;
    getEffectOrder(stage: BES): BO {
        return BO.First;
    }
    effect(stage: BES) {
    }
}

export class ProtectBuff extends ABuff {
    id: BuffId = BuffId.Protect;
    getEffectOrder(stage: BES): BO {
        return BO.First;
    }
    effect(stage: BES) {
    }
}

export class PosionBuff extends ABuff {
    id = BuffId.Posion;
    getEffectOrder(stage: BES): BO {
        switch(stage) {
            case BES.RoundStart:
                return BO.Last;
            default:
                return BO.Third;
        }
    }
    effect(stage: BES) {
        switch(stage) {
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
        if(stage == BES.RoundStart) {
            return BO.First;
        }
        return BO.Last;
    }
    effect(stage: BES) {
        if(stage == BES.RoundStart) {
            var Buff = new PosionBuff();
            Buff.init(this._owner, this.num);
            this._owner.AddBuff(Buff, this.id);
        }
    }

    
}

export class ManaBuff extends ABuff {
    id: BuffId = BuffId.Mana;    
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
        
    }
}

export class MoveAgainBuff extends ABuff {
    id: BuffId = BuffId.MoveAgain;
    getEffectOrder(stage: BES): BO {
        return BO.First;
    }
    effect(stage: BES) {
    }
}

export class HuangQueBuff extends ABuff {
    id: BuffId = BuffId.HuangQue;
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
    }
}

export class YunJianBuff extends ABuff {
    id: BuffId = BuffId.YunJian;
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
    }
}

export class ShieldBuff extends ABuff {
    id: BuffId = BuffId.Shield;
    getEffectOrder(stage: BES): BO {
        return BO.First;
    }
    effect(stage: BES) {
        if(stage == BES.RoundStart) {
            this._owner.AddBuff(
                BuffFactory.me.Produce(this.id, this._owner, -Math.ceil(this.num / 2)), "回合削减")
        }
    }

}

export class PierceBuff extends ABuff {
    id: BuffId = BuffId.Pierce;
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
    }

}

export class SwordMenaingBuff extends ABuff {
    private _effectedNum: number = 0;
    id: BuffId = BuffId.SwordMenaing;
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
        if(stage == BES.BeforeHitOther) {
            this._effectedNum = this.num;
        } else if(stage == BES.AnyCardEffectOver) {
            if(this._effectedNum > 0) {
                this._owner.AddBuffById(this.id, -this._effectedNum, "剑意耗尽");
                this._effectedNum = 0;
            }
        }
    }

}

export class CrazySwordBuff extends ABuff {
    id: BuffId = BuffId.CrazySword;
    getEffectOrder(stage: BES): BO {
        return BO.Last;
    }
    effect(stage: BES) {
    }

}

var AllBuffType = [
    PosionBuff, ManaBuff, DCBuff, MeiKaiBuff, MoveAgainBuff,
    HuangQueBuff, ProtectBuff, YunJianBuff, ShieldBuff,
    PierceBuff, SwordMenaingBuff, CrazySwordBuff,
]

export class BuffFactory {
    private static _me: BuffFactory;
    public static get me(): BuffFactory {
        if(!BuffFactory._me) {
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