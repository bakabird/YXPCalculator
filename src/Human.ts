import { ACard, CardName } from "./Card"
import { BES, BO, BuffId, ABuff, ManaBuff, BuffFactory } from "./Buff";
import CardList from "./CardList";
import { FightReport, FROption } from "./FightReport";
import { FightConst } from "./FightConst";
import { Fight } from "./Fight";

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

    private _fight: Fight;
    private _hpEverAdd: number;
    private _guaCostNum: number;
    private _fakeRdmRateCounter: number;
    private _connectingFr: FightReport;
    private _frOption: FROption;
    private _lastUseCard: ACard;

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
        this._guaCostNum = 0;
        this._hpEverAdd = 0;
        this._fakeRdmRateCounter = FightConst.FAKE_START_RDMRATE;
        this._fight = null;
    }

    public get speed(): number {
        return this._speed;
    }

    public get name(): string {
        return this._name;
    }

    public get guaCostNum(): number {
        return this._guaCostNum;
    }

    public get hpEverAdd(): number {
        return this._hpEverAdd;
    }

    public get mana(): number {
        var manaBuff = this.GetBuff(BuffId.Mana)
        return manaBuff ? manaBuff.num : 0;
    }

    public get isMu(): boolean {
        return this.CheckBuff(BuffId.Mu, 1) || this._lastUseCard.isMu;
    }

    public get isHuo(): boolean {
        return this.CheckBuff(BuffId.Huo, 1) || this._lastUseCard.isHuo;
    }

    public get isShui(): boolean {
        return this.CheckBuff(BuffId.Shui, 1) || this._lastUseCard.isShui;
    }

    public get isTu(): boolean {
        return this.CheckBuff(BuffId.Tu, 1) || this._lastUseCard.isTu;
    }

    public get isJin(): boolean {
        return this.CheckBuff(BuffId.Jin, 1) || this._lastUseCard.isJin;
    }

    public SetFight(fight: Fight) {
        this._fight = fight;
    }

    public GetAnother(): Human {
        return this._fight.GetAnother(this);
    }

    public RecoverMana(num: number, log: string = "") {
        if (num == 0) return;
        if (log == "") {
            log = num > 0 ? "回蓝" : "耗蓝"
        }
        this.AddBuffById(BuffId.Mana, num, log);
    }

    // 如果消耗失败会自动恢复一点蓝
    //<retrun>是否成功消耗</return>
    public CostMana(num: number): boolean {
        if (this.mana >= num) {
            this.RecoverMana(-num);
            return true;
        }
        this.RecoverMana(1);
        return false;
    }

    //#region Buff

    AddBuff(buff: ABuff, log: string) {
        var findRlt = this._BuffList.find(b => b.id == buff.id);
        this._frOption.buffChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} ${buff.num > 0 ? '+' : ''}${buff.num} 层${buff.id}`);
        if (findRlt) {
            findRlt.ModNum(buff.num);
            this._onBuffChg(buff.id, buff.num);
            if (findRlt.num <= 0) {
                this.RemoveBuff(findRlt.id, "no");
            }
        } else {
            this._BuffList.push(buff);
            this._onBuffChg(buff.id, buff.num);
        }
    }

    private _onBuffChg(buffId: BuffId, chg: number) {
        if (buffId == BuffId.Mana) {
            if (chg > 0 && this.CheckBuff(BuffId.Mind, 1)) {
                this.AddHp(this.GetBuff(BuffId.Mind).num * chg, BuffId.Mind);
            }
        } else if (buffId == BuffId.Gua) {
            if (chg > 0 && this.CheckBuff(BuffId.Sixyao, 1)) {
                this.GetAnother().SimpleGetHit(this.GetBuff(BuffId.Sixyao).num * chg, BuffId.Sixyao);
            }
        }
    }

    AddBuffById(buffId: BuffId, num: number, log: string) {
        if (num == 0) return;
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

    EachBuff(walk: (buff: ABuff) => void) {
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

    public get isDead() {
        return this._hp < 1;
    }

    /**
     * 考虑各种情况
     * @return {number} how many hp actual hit
     */
    public GetHit(hurt: number, from: Human, log: string): number {
        if (hurt <= 0) throw "invalid arg";
        const fromWeak = from.GetBuff(BuffId.Weak);
        const fromPierce = from.GetBuff(BuffId.Pierce);
        const fromPower = from.GetBuff(BuffId.Power);
        const fromDepower = from.GetBuff(BuffId.Depower);
        const fromSwordMenaing = from.GetBuff(BuffId.SwordMenaing);
        const fromHpSteal = from.GetBuff(BuffId.HpSteal);
        const fromSharp = from.GetBuff(BuffId.Sharp);
        const meCountershock = this.GetBuff(BuffId.Countershock);
        const meFlaw = this.GetBuff(BuffId.Flaw);
        const meShield = this.GetBuff(BuffId.Shield);
        from.EffectBuff(BES.BeforeHitOther);
        if (fromSwordMenaing) {
            hurt += fromSwordMenaing.num;
        }
        if (fromPower) {
            hurt += fromPower.num;
        }
        if (fromDepower) {
            hurt = Math.max(1, hurt - fromDepower.num);
        }
        if (fromWeak) {
            hurt = Math.max(1, Math.floor(hurt * 0.6));
        }
        if (meFlaw) {
            hurt = Math.floor(hurt * 1.4);
        }
        if (fromPierce) {
            from.AddBuff(BuffFactory.me.Produce(BuffId.Pierce, from, -1), log);
        } else if (meShield) {
            const shiledOut = Math.min(meShield.num, hurt);
            this.AddBuff(BuffFactory.me.Produce(BuffId.Shield, this, -shiledOut), log);
            hurt -= shiledOut;
        }
        if (hurt > 0) {
            if (fromSharp) {
                hurt += fromSharp.num;
                from.RemoveBuff(BuffId.Sharp, log);
            }
            this.CutHp(hurt, log);
            if (fromHpSteal) {
                const steal = Math.floor(hurt * fromHpSteal.num / 100);
                if (steal > 0) {
                    from.AddHp(steal, fromHpSteal.id);
                }
            }
        }
        if (meCountershock) {
            from.SimpleGetHit(meCountershock.num, meCountershock.id);
        }
        return Math.max(0, hurt);
    }

    /**
     * 只考虑自己的情况
     */
    public SimpleGetHit(hurt: number, log: string) {
        if (hurt <= 0) throw "invalid arg";
        const meFlaw = this.GetBuff(BuffId.Flaw);
        const meShield = this.GetBuff(BuffId.Shield);
        if (meFlaw) {
            hurt = Math.floor(hurt * 1.4);
        }
        if (meShield) {
            const shiledOut = Math.min(meShield.num, hurt);
            this.AddBuff(BuffFactory.me.Produce(BuffId.Shield, this, -shiledOut), log);
            hurt -= shiledOut;
        }
        if (hurt > 0) {
            this.CutHp(hurt, log);
        }
        return Math.max(0, hurt);
    }

    //削减生命（不考虑护甲）
    public CutHp(hp: number, log: string) {
        if (hp <= 0) throw "invalid arg";

        if (this.CheckBuff(BuffId.Protect, 1)) {
            this.AddBuff(BuffFactory.me.Produce(BuffId.Protect, this, -1), "扣血");
        } else {
            this._frOption.hpChg && this._connectingFr.apeendLog(
                `【${log}】${this._name} 扣血 ${hp}`);
            this._hp -= hp;
        }
    }

    public AddMaxHp(maxHp: number, log: string) {
        if (maxHp == 0) return;
        if (maxHp < 0) throw "invalid arg";
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 加血上限 ${maxHp}`);
        this._maxHp += maxHp;
    }

    public CutMaxHp(cut: number, log: string) {
        if (cut == 0) return;
        if (cut < 0) throw "invalid arg"
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 减血上限 ${cut}`);
        this._maxHp -= cut;
        this._hp = Math.min(this._hp, this._maxHp);
    }

    public AddHp(hp: number, log: string) {
        if (hp == 0) return;
        if (hp < 0) throw "invalid arg";
        const newHp = Math.min(this._hp + hp, this._maxHp);
        this._hpEverAdd += newHp - this._hp;
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 加血 ${hp}，实际加 ${newHp - this._hp}`);
        this._hp = newHp;
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
        if (this.CostMana(cardmana)) {
            this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
            card.effect(this, _target);
            this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
            if (this.isDead) return;
            if (useMeiKai) {
                this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
                card.effect(this, _target);
                this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
                if (this.isDead) return;
                this.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, this, -1), "梅开二度");
            }
            this._lastUseCard = card;
            this.ShiftCard();
        }
    }

    public GetCurCard(): ACard {
        return this._CardList.GetCur();
    }

    public MakeStar(posOffsetCur: number) {
        if (this._CardList.MakeStar(posOffsetCur)) {
            this.RecoverMana(1, "星位激活");
        }
    }

    public MakeAllStar() {
        var i = this._CardList.size;
        while (i--) {
            this._CardList.MakeStar(i);
        }
    }

    public Gua(min: number, max: number): number {
        const gua = this.GetBuff(BuffId.Gua);
        let rdm = FightConst.TRUE_RANDOM ? Math.random() : 0.5;
        if (gua) {
            gua.effect(BES.CALL_BY_CODE);
            this._guaCostNum++;
            rdm = 1;
        }
        return min + Math.floor((max - min) * rdm);
    }

    public GuaRate(rate: number): boolean {
        const gua = this.GetBuff(BuffId.Gua);
        if (!FightConst.TRUE_RANDOM) {
            if (gua) {
                gua.effect(BES.CALL_BY_CODE);
                this._guaCostNum++;
                return true;
            } else {
                this._fakeRdmRateCounter += rate;
                if (this._fakeRdmRateCounter >= 1) {
                    this._fakeRdmRateCounter -= 1;
                    return true;
                }
            }
        } else {
            let rdm = Math.random();
            if (gua) {
                gua.effect(BES.CALL_BY_CODE);
                this._guaCostNum++;
                rdm = 0;
            }
            if (rdm < rate) return true;
        }
        return false;
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

    public appendLog(log: string) {
        this._connectingFr?.apeendLog(`【${this.name}】${log}`);
    }
}
