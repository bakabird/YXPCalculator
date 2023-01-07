import { ACard } from "./Card"
import { BES, BO, BuffId, ABuff, ManaBuff, BuffFactory } from "./Buff";
import CardList from "./CardList";
import { FightReport, FROption } from "./FightReport";

export class Human {
    //卡牌
    private _CardList: CardList;
    //Buff
    private _BuffList: ABuff[];
    // 总血量
    private _maxHp: number;
    // 血量
    private _hp: number;
    // 修为
    private _speed: number;
    // 名字
    private _name: string

    private _connectingFr: FightReport;
    private _frOption: FROption;

    constructor(name: string, hp: number, speed: number) {
        this._name = name;
        this._maxHp = hp;
        this._speed = speed;
        this.Reset();
    }

    public Reset() {
        this._hp = this._maxHp;
        this._CardList = null;
        this._BuffList = [];
    }

    public get speed(): number {
        return this._speed;
    }
    
    public get name(): string {
        return this._name;
    }

    public get mana(): number {
        var manaBuff = this.GetBuff(BuffId.Mana)
        return manaBuff ? manaBuff.num : 0;
    }

    public RecoverMana(num: number, log: string = "") {
        if(num == 0) return;
        if (log == "") {
            log = num > 0 ? "回蓝" : "耗蓝"
        }
        this.AddBuffById(BuffId.Mana, num, log);
    }

    // 如果消耗失败会自动恢复一点蓝
    //<retrun>是否成功消耗</return>
    public CostMana(num: number): boolean {
        if(this.mana >= num) {
            this.RecoverMana(-num);
            return true;
        }
        this.RecoverMana(1);
        return false;
    }

    //#region  Buff

    AddBuff(buff: ABuff, log: string) {
        var findRlt = this._BuffList.find(b => b.id == buff.id);
        this._frOption.buffChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} ${buff.num > 0 ? '+' : ''}${buff.num} 层${buff.id}`);
        if(findRlt) {
            findRlt.ModNum(buff.num);
            if(findRlt.num <= 0) {
                this.RemoveBuff(findRlt.id, "no");
            }
        } else {
            this._BuffList.push(buff);
        }
    }

    AddBuffById(buffId: BuffId, num: number, log: string) {
        if(num == 0) return;
        this.AddBuff(BuffFactory.me.Produce(buffId, this, num), log);
    }

    RemoveBuff(buffId: BuffId, log: string) {
        this._BuffList = this._BuffList.filter((b => b.id != buffId));
    }

    CheckBuff(buffId: BuffId, need: number): boolean {
        var buff = this.GetBuff(buffId);
        return buff && buff.num >= need;
    }

    GetBuff(buffId: BuffId) {
        var findRlt = this._BuffList.find(b => b.id == buffId);
        return findRlt;
    }

    EachBuff(walk: (buff: ABuff)=>void) {
        this._BuffList.forEach(buff => {
            walk(buff);
        });
    }

    EffectBuff(stage: BES) {
        var boArr = [BO.First, BO.Second, BO.Third, BO.Four, BO.Last];
        for (let index = 0; index < boArr.length; index++) {
            const bo = boArr[index];
            var tmp = this._BuffList.filter(b => b.getEffectOrder(stage) == bo);
            tmp.forEach(b => b.effect(stage));
        }
    }

    //#endregion

    //#region 修改血量

    public get hp() {
        return this._hp;
    }

    public get maxHp() {
        return this._maxHp;
    }

    /**
     * @return {number} how many hp actual hit
     */
    public GetHit(hurt: number, from: Human, log: string): number {
        if(hurt <= 0) throw "invalid arg";
        const fromPierce = from.GetBuff(BuffId.Pierce);
        const fromPower = from.GetBuff(BuffId.Power);
        const fromSM = from.GetBuff(BuffId.SwordMenaing);
        const fromHS = from.GetBuff(BuffId.HpSteal);
        const curShield = this.GetBuff(BuffId.Shield);
        from.EffectBuff(BES.BeforeHitOther);
        if(fromSM) {
            hurt += fromSM.num;
        }
        if(fromPower) {
            hurt += fromPower.num;
        }
        if(fromPierce) {
            from.AddBuff(BuffFactory.me.Produce(BuffId.Pierce, from, -1), log);
        } else if(curShield && curShield.num > 0) {
            const shiledOut = Math.min(curShield.num, hurt);
            this.AddBuff(BuffFactory.me.Produce(BuffId.Shield, this, -shiledOut), log);
            hurt -= shiledOut;
        } 
        if(hurt > 0) {
            this.CutHp(hurt, log);
            if(fromHS) {
                const steal = Math.floor(hurt * fromHS.num / 100);
                if(steal > 0) {
                    from.AddHp(steal, fromHS.id);
                }
            }
        }
        return Math.max(0, hurt);
    }

    //削减生命（不考虑护甲）
    public CutHp(hp: number, log: string) {
        if (hp <= 0) throw "invalid arg";
        
        if(this.CheckBuff(BuffId.Protect, 1)) {
            this.AddBuff(BuffFactory.me.Produce(BuffId.Protect, this, -1), "扣血");
        } else {
            this._frOption.hpChg && this._connectingFr.apeendLog(
                `【${log}】${this._name} 扣血 ${hp}`);
            this._hp -= hp;
        }
    }

    public AddMaxHp(maxHp: number, log:string) {
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 加血上限 ${maxHp}`);
        this._maxHp += maxHp;
    }

    public AddHp(hp: number, log: string) {
        if (hp <= 0) throw "invalid arg";
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 加血 ${hp}`);
        this._hp += hp;
        if (this._hp > this._maxHp) {
            this._hp = this._maxHp;
        }
    }

    //#endregion

    //#region Card About

    public get CardList(): CardList {
        return this._CardList;
    }

    public SetCardList(list: CardList) {
        this._CardList = list;
    }

    public EffectCard(_target: Human) {
        var useMeiKai = this.CheckBuff(BuffId.MeiKai, 1);
        var card = this.GetCurCard();
        var cardmana = card.getMana(this, _target);
        if(this.CostMana(cardmana)) {
            this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
            card.effect(this, _target);
            this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
            if(useMeiKai) {
                this.RecoverMana(cardmana, BuffId.MeiKai);
                this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
                card.effect(this, _target);
                this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
                this.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, this, -1), "梅开二度");
            }
            this.ShiftCard();
        }
    }

    public GetCurCard(): ACard {
        return this._CardList.GetCur();
    }

    //移动到下一张牌
    public ShiftCard() {
        this._CardList.PosShift();
    }

    //回退到上一张牌
    public BackCard() {
        this._CardList.PosBack();
    }

    //#endregion

    public connectReport(fr: FightReport, option: FROption) {
        this._connectingFr = fr;
        this._frOption = option;
    }
    public disconnectReport() {
        this._connectingFr = null;
    }
}
