import { ACard } from "./Card"
import { BES, BO, BuffId, ABuff, ManaBuff, BuffFactory } from "./Buff";
import { Debug } from "./Debug";
import CardList from "./CardList";


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

    public RecoverMana(num: number) {
        if(num == 0) return;
        var manaBuff = new ManaBuff();
        manaBuff.init(this, num);
        this.AddBuff(manaBuff);
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

    AddBuff(buff: ABuff) {
        var findRlt = this._BuffList.find(b => b.id == buff.id);
        Debug.debug(`【Buff增加】${this._name} ${buff.num} 层${buff.id}`);
        if(findRlt) {
            findRlt.ModNum(buff.num);
            if(findRlt.num <= 0) {
                this.RemoveBuff(findRlt.id);
            }
        } else {
            this._BuffList.push(buff);
        }
    }

    RemoveBuff(buffId: BuffId) {
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

    public CutHp(hp: number, log: string) {
        if (hp <= 0) throw "invalid arg";
        
        if(this.CheckBuff(BuffId.Protect, 1)) {
            this.AddBuff(BuffFactory.me.Produce(BuffId.Protect, this, -1));
        } else {
            Debug.debug(`【${log}】${this._name} 扣血 ${hp}`);
            this._hp -= hp;
        }
    }

    public AddHp(hp: number, log: string) {
        if (hp <= 0) throw "invalid arg";
        Debug.debug(`【${log}】${this._name} 加血 ${hp}`);
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
        if(this.CostMana(card.mana)) {
            card.effect(this, _target);
            if(useMeiKai) {
                this.RecoverMana(card.mana);
                card.effect(this, _target);
                this.AddBuff(BuffFactory.me.Produce(BuffId.MeiKai, this, -1));
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

    public reportStatu() {
        return;
        var buffStatu = this._BuffList.reduce((p,c) => {
            return p + "    " + c.toString() + "\n";
        }, "");
        console.log(`    【人物状态】${this.name} ${this.hp}/${this.maxHp}`)
        console.log(`    【卡组】${this._CardList.toString()}`)
        console.log(buffStatu)
    }
}
