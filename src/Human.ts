import { ABuff, BES, BO, BuffFactory, BuffId, Qiandun } from "./Buff";
import BuffCfg from "./BuffCfg";
import { ACard } from "./Card";
import CardList from "./CardList";
import { Fight } from "./Fight";
import { FightConst } from "./FightConst";
import { FROption, FightReport } from "./FightReport";
import LogEncode from "./LogEncode";
import MenUtil from "./MenUtil";
import { Men, Role } from "./_share_code_";

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
    private _name: string;
    // 角色
    private _role: Role;

    private _fight: Fight;

    private _hpEverAdd: number;
    private _shieldEverCut: number;
    private _guaCostNum: number;
    private _fakeRdmRateCounter: number;
    private _connectingFr: FightReport;
    private _frOption: FROption;
    private _lastUseCard: ACard;

    constructor(name: string, hp: number, speed: number, role: Role) {
        this._name = name;
        this._maxHp = hp;
        this._speed = speed;
        this._role = role;
        this.Reset();
    }

    public Reset() {
        this._hp = this._maxHp;
        this._CardList = null;
        this._BuffList = [];
        this._guaCostNum = 0;
        this._hpEverAdd = 0;
        this._shieldEverCut = 0;
        this._fakeRdmRateCounter = FightConst.FAKE_START_RDMRATE;
        this._fight = null;
    }

    public get speed(): number {
        return this._speed;
    }

    public get name(): string {
        return this._name;
    }

    public get role(): Role {
        return this._role;
    }

    public get men(): Men {
        return MenUtil.MenOf(this._role);
    }

    public get guaCostNum(): number {
        return this._guaCostNum;
    }

    public get hpEverAdd(): number {
        return this._hpEverAdd;
    }

    public get shieldEverCut(): number {
        return this._shieldEverCut;
    }

    public get mana(): number {
        var manaBuff = this.GetBuff(BuffId.Mana)
        return manaBuff ? manaBuff.num : 0;
    }

    public get everAddHp(): boolean {
        return this._hpEverAdd > 0;
    }

    public get isMu(): boolean {
        return this.CheckBuff(BuffId.Mu, 1) || this._lastUseCard?.isMu || this._lastUseCard?.isShui;
    }

    public get isHuo(): boolean {
        return this.CheckBuff(BuffId.Huo, 1) || this._lastUseCard?.isHuo || this._lastUseCard?.isMu;
    }

    public get isShui(): boolean {
        return this.CheckBuff(BuffId.Shui, 1) || this._lastUseCard?.isShui || this._lastUseCard?.isJin;
    }

    public get isTu(): boolean {
        return this.CheckBuff(BuffId.Tu, 1) || this._lastUseCard?.isTu || this._lastUseCard?.isHuo;
    }

    public get isJin(): boolean {
        return this.CheckBuff(BuffId.Jin, 1) || this._lastUseCard?.isJin || this._lastUseCard?.isTu;
    }

    public get isWuxing(): boolean {
        return this.isMu || this.isJin || this.isShui || this.isHuo || this.isTu
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
        const mePixie = this.GetBuff(BuffId.Pixie);
        const isDebuff = ABuff.IsDebuff(buff.id);
        if (isDebuff && buff.num > 0 && mePixie.num > 0) {
            const costPixie = Math.min(buff.num, mePixie.num);
            buff.ModNum(-costPixie);
            this.AddBuffById(BuffId.Pixie, -costPixie, "抵消");
        }
        if (buff.num == 0) return;
        var findRlt = this._BuffList.find(b => b.id == buff.id);
        if (findRlt) {
            findRlt.ModNum(buff.num);
            this._onBuffChg(buff.id, buff.num);
            if (findRlt.num <= 0) {
                this.RemoveBuff(findRlt.id, log);
            }
        } else {
            this._BuffList.push(buff);
            this._onBuffChg(buff.id, buff.num);
        }
        const afterNum = this.NumOf(buff.id);
        if (afterNum > 0) {
            this._frOption.buffChg && this._connectingFr.apeendLog(
                `【${log}】${this._name} ${buff.num > 0 ? '+' : ''}${buff.num} 层${buff.id} [${afterNum}]`);
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
        } else if (buffId == BuffId.Shield) {
            if (chg < 0) {
                this._shieldEverCut += chg;
            }
            if (chg < 0 && this.CheckBuff(BuffId.Duanya, 1)) {
                this.GetAnother().SimpleGetHit(Math.abs(chg), BuffId.Duanya);
                this.AddBuffById(BuffId.Duanya, -1, "断崖·落")
            }
            if (chg < 0 && this.CheckBuff(BuffId.Hebahuan, 1)) {
                this.AddBuffById(BuffId.Hebahuan, -1, "合八荒·合")
                this.AddBuffById(BuffId.Shield, -chg, "合八荒");
            }
        } else if (this.CheckBuff(BuffId.Hunyuanwuji, 1) && ABuff.IsActiveWuxing(buffId)) {
            this.AddBuffById(BuffId.Hunyuanwuji, -1, "混元无极·发");
            this.AddBuffById(BuffId.MoveAgain, 1, BuffId.Hunyuanwuji)
        }
    }

    AddBuffById(buffId: BuffId, num: number, log: string) {
        if (num == 0) return;
        this.AddBuff(BuffFactory.me.Produce(buffId, this, num), log);
    }

    RemoveBuff(buffId: BuffId, log: string) {
        const orilen = this._BuffList.length;
        this._BuffList = this._BuffList.filter((b => b.id != buffId));
        if (this._BuffList.length !== orilen) {
            this._frOption.buffChg && this._connectingFr.apeendLog(
                `【${log}】${this._name} ${buffId} [移除]`);
        }
    }

    CheckBuff(buffId: BuffId, need: number): boolean {
        var buff = this.GetBuff(buffId);
        return buff && buff.num >= need;
    }

    GetBuff(buffId: BuffId) {
        var findRlt = this._BuffList.find(b => b.id == buffId);
        return findRlt;
    }

    NumOf(buffId: BuffId) {
        return this.GetBuff(buffId)?.num ?? 0;
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
        if (hurt <= 0) {
            console.trace("GetHit invalid arg");
            throw "GetHit invalid arg";
        }
        if (from.isDead) return 0;
        const fromWeak = from.GetBuff(BuffId.Weak);
        const fromPierce = from.GetBuff(BuffId.Pierce);
        const fromPower = from.GetBuff(BuffId.Power);
        const fromDepower = from.GetBuff(BuffId.Depower);
        const fromSwordMenaing = from.GetBuff(BuffId.SwordMenaing);
        const fromHpSteal = from.GetBuff(BuffId.HpSteal);
        const fromSharp = from.GetBuff(BuffId.Sharp);
        const fromBanSharp = from.GetBuff(BuffId.BanSharp);
        const fromSuiyan = from.GetBuff(BuffId.Suiyan)
        const fromQuanyong = from.GetBuff(BuffId.Quanyong);
        const fromSuiSha = from.GetBuff(BuffId.Suisha)
        const fromKuangwu = from.GetBuff(BuffId.Kuangwu)
        const meCountershock = this.GetBuff(BuffId.Countershock);
        const meFlaw = this.GetBuff(BuffId.Flaw);
        const meShield = this.GetBuff(BuffId.Shield);
        from.EffectBuff(BES.BeforeHitOther);
        if (from.isDead) return 0;
        if (fromSwordMenaing) {
            hurt += fromSwordMenaing.num;
        }
        if (fromPower) {
            hurt += fromPower.num;
        }
        if (fromKuangwu) {
            hurt += fromKuangwu.num;
        }
        if (fromSuiSha) {
            hurt += BuffCfg.SuiSha_ExtraPower;
        }
        if (fromDepower) {
            hurt = Math.max(1, hurt - fromDepower.num);
        }
        if (fromWeak) {
            hurt = Math.max(1, Math.floor(hurt * 0.6));
        }
        hurt = Qiandun.apply(this, hurt)
        if (meFlaw) {
            hurt = Math.floor(hurt * 1.4);
        }
        if (fromPierce) {
            from.AddBuff(BuffFactory.me.Produce(BuffId.Pierce, from, -1), log);
        } else if (meShield) {
            if (fromSuiyan || fromSuiSha) hurt *= 2;
            const shiledOut = Math.min(meShield.num, hurt);
            this.AddBuff(BuffFactory.me.Produce(BuffId.Shield, this, -shiledOut), log);
            hurt -= shiledOut;
            if (fromSuiyan || fromSuiSha) hurt = Math.ceil(hurt / 2);
        }
        if (hurt > 0) {
            if (!fromBanSharp) {
                if (fromSharp) {
                    hurt += fromSharp.num;
                    from.RemoveBuff(BuffId.Sharp, log);
                }
            }
            hurt = this.CutHp(hurt, log);
            if (fromHpSteal) {
                const steal = Math.floor(hurt * fromHpSteal.num / 100);
                if (steal > 0) {
                    from.AddHp(steal, fromHpSteal.id);
                }
            }
            if (fromQuanyong) {
                const waterflow = Math.floor(hurt / 5);
                if (waterflow > 0) {
                    from.AddBuffById(BuffId.WaterFlow, waterflow, BuffId.Quanyong);
                }
                from.AddBuffById(BuffId.Quanyong, -1, "激发")
            }
        }
        if (meCountershock) {
            from.SimpleGetHit(meCountershock.num, meCountershock.id);
        }
        from.AddBuffById(BuffId.Record_AtkTime, 1, "GetHit" + LogEncode.Ignore)
        if (fromSuiSha) from.AddBuffById(BuffId.Suisha, -1, "SuiShaHitOver")
        return Math.max(0, hurt);
    }

    /**
     * 只考虑自己的情况
     */
    public SimpleGetHit(hurt: number, log: string) {
        if (hurt <= 0) throw "SimpleGetHit invalid arg";
        const meFlaw = this.GetBuff(BuffId.Flaw);
        const meShield = this.GetBuff(BuffId.Shield);
        hurt = Qiandun.apply(this, hurt)
        if (meFlaw) {
            hurt = Math.floor(hurt * 1.4);
        }
        if (meShield) {
            const shiledOut = Math.min(meShield.num, hurt);
            this.AddBuff(BuffFactory.me.Produce(BuffId.Shield, this, -shiledOut), log);
            hurt -= shiledOut;
        }

        if (hurt > 0) {
            hurt = this.CutHp(hurt, log);
        }
        return Math.max(0, hurt);
    }

    //削减生命（不考虑护甲）
    public CutHp(hp: number, log: string): number {
        if (hp <= 0) throw "CutHp invalid arg";
        if (this.CheckBuff(BuffId.Tiegu, 1)) {
            hp = Math.max(1, hp - 5);
        }
        if (this.CheckBuff(BuffId.Protect, 1)) {
            this.AddBuff(BuffFactory.me.Produce(BuffId.Protect, this, -1), "扣血");
        } else {
            this._frOption.hpChg && this._connectingFr.apeendLog(
                `【${log}】${this._name} 扣血 ${hp}`);
            this._hp -= hp;
        }
        return hp;
    }

    public AddMaxHp(maxHp: number, log: string) {
        if (maxHp == 0) return;
        if (maxHp < 0) throw "AddMaxHp invalid arg";
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 加血上限 ${maxHp}`);
        this._maxHp += maxHp;
    }

    public CutMaxHp(cut: number, log: string) {
        if (cut == 0) return;
        if (cut < 0) throw "CutMaxHp invalid arg"
        this._frOption.hpChg && this._connectingFr.apeendLog(
            `【${log}】${this._name} 减血上限 ${cut}`);
        this._maxHp -= cut;
        this._hp = Math.min(this._hp, this._maxHp);
    }

    public AddHp(hp: number, log: string) {
        if (hp == 0) return;
        if (hp < 0) throw "AddHp invalid arg";
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
        var useLinggan = this.CheckBuff(BuffId.Linggan, 1);
        var card = this.GetCurCard();
        var cardmana = card.getMana(this, _target);
        do {
            if (this.CostMana(cardmana)) {
                this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
                card.effect(this, _target);
                this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
                if (this.isDead) break;
                if (useMeiKai) {
                    this._frOption.cardUseLog && this._connectingFr?.apeendLog(`【卡牌使用】${this.name} 使用 ${card.cardName}`);
                    card.effect(this, _target);
                    this._frOption.cardUse && this._connectingFr?.appendUse(card.cardName);
                    if (this.isDead) break;
                    this.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, this, -1), "梅开二度");
                }
                this._lastUseCard = card;
                this.ShiftCard();
            }
        } while (false)
        if (useLinggan) {
            this.AddBuffById(BuffId.Linggan, -1, BuffId.Linggan + "消耗");
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

    public appendLog(TAG: string, log: string) {
        this._connectingFr?.apeendLog(`【${TAG}】${this.name} ${log}`);
    }
}
