/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

class Eventer {
    private _listDict: Record<string, Array<(...arg:any)=>void>> = {};
    public event(name: string, ...arg:any){
        if (this._listDict[name]) {
            this._listDict[name].forEach(lis => lis(...arg));
        }
    }
    public add(event: string, listen: (...arg: any)=>void) {
        if(!this._listDict[event]) {
            this._listDict[event] = [];
        }
        this._listDict[event].push(listen);
    }
}

function readLastKey() {
    return localStorage.getItem("lastKey");
}

function saveLastKey(key: string) {
    localStorage.setItem("lastKey", key);
}

class CardWrap {
    public eventer: Eventer = new Eventer();
    private _cardFace: JQuery<HTMLImageElement>;
    private _arrow: JQuery<HTMLElement>;
    private _levelG: JQuery<HTMLElement>;
    private _cardname: string;
    private _level: number;
    public get node() {
        return this._node;
    }
    public get level(): number {
        return this._level;
    }
    public set level(v: number) {
        this._level = v;
        this.uptFace();
    }
    public get cardname(): string {
        return this._cardname;
    }
    public set cardname(val: string) {
        this._cardname = val;
        this.uptFace();
    }
    constructor(private _node: JQuery<HTMLElement>, private _index: number) {
        this._level = 0;
        this._cardname = "";
        this._cardFace = _node.find(".cardFace") as JQuery<HTMLImageElement>;
        this._arrow = _node.find(".arrow");
        this._levelG = _node.find(".levelG");
        this.cardname = "普通攻击";
        this._cardFace.on("click", () => {
            this.eventer.event("clickFace", this._index);
        });
        const allLevelBtn = this._levelG.find("*");
        allLevelBtn.each((index, btn) => {
            const btnIndex = index;
            $(btn).on("click", ()=>{
                this.level = btnIndex;
            });
        })
    }
    public uptFace() {
        this._cardFace.attr("src", `./img/${this.cardname}_${this._level + 1}级.png`);
        this._levelG.children().removeClass("on");
        $(this._levelG.children().get(this.level)).addClass("on");
        this.eventer.event("uptFace");
    }
    public oShowArrow() {
        this._arrow.css("opacity", 1);
    }
    public oHideArrow() {
        this._arrow.css("opacity", 0);
    }
}

class CardListWrap {
    private _list: Array<CardWrap>;
    private _curTargetIndex: number = -1;
    constructor() {
        this._list = [];
    }
    public get key():string {
        return this._list.reduce((p,c)=>{
            return p + c.cardname + "," + c.level + ";"
        },"")
    }
    public set key(v: string) {
        v.split(";").forEach((part,index) => {
            if(part == "" || index >= this._list.length) return
            const [cardName,level] = part.split(",");
            this._list[index].cardname = cardName;
            this._list[index].level = parseInt(level);
        })
    }
    public add(cardWrap: CardWrap) {
        cardWrap.eventer.add("clickFace", this.onClickFace.bind(this));
        cardWrap.eventer.add("uptFace", this.onUptFace.bind(this));
        this._list.push(cardWrap);
    }
    public each(walk: (card: CardWrap)=>void) {
        this._list.forEach(walk);
    }
    public modCard(name: string) {
        if(this._curTargetIndex < 0) return;
        this._list[this._curTargetIndex].cardname = name;
        if(this._curTargetIndex + 1 < this._list.length) {
            this.onClickFace(this._curTargetIndex + 1);
        } else {
            this.onClickFace(0);
        }
    }
    public onClickFace(index: number) {
        this._curTargetIndex = index;
        this._list.forEach((i,iIdx) => {
            if(iIdx == index){
                i.oShowArrow();
            } else {
                i.oHideArrow();
            }
        })
    }
    public onUptFace() {
        saveLastKey(this.key);
    }
}

class CardChooseWrap {
    private _cardName: string;
    public eventer: Eventer = new Eventer();
    public get node(): JQuery<HTMLButtonElement> {
        return this._node;
    }
    constructor(private _node: JQuery<HTMLButtonElement>, cardName: string) {
        this._cardName = cardName;
        _node.text(cardName);
        _node.on("click", ()=>{
            this.choose();
        });
    }
    public choose() {
        this.eventer.event("chooseDown", this._cardName);
    }
}

class CardSearchWrap {
    public eventer: Eventer = new Eventer();
    private _selectionBox: JQuery<HTMLElement>;
    private _chooseCopy: JQuery<HTMLButtonElement>;
    private _input: JQuery<HTMLInputElement>;
    private _chooseList: Array<CardChooseWrap>;
    private _lastInputStr: string;
    private _engRegxp: RegExp;
    private _numRegxp: RegExp;
    constructor(private _node: JQuery<HTMLElement>) {
        this._engRegxp = new RegExp('[A-z]');
        this._numRegxp = new RegExp("[0-9]");
        this._chooseCopy = $(".Hub .cardBtn");
        this._input = _node.find("input");
        this._selectionBox = _node.find(".selection");
        this._chooseList = []
        this._lastInputStr = "";
        this._input.on("input", this._onInput.bind(this))
    }
    private _onInput() {
        const val = this._input.val().toString();
        if (val.length > 0) {
            if (val.length > this._lastInputStr.length) {
                const lastInput = val[val.length - 1];
                if (this._engRegxp.test(lastInput)) {
                    this._search(val);
                } else {
                    this._input.val(val.slice(0, val.length - 1));
                    if (this._numRegxp.test(lastInput)) {
                        const num = parseInt(lastInput) - 1;
                        this._chooseList[num]?.choose();
                    }
                }
            } else {
                this._search(val);
            }
        }
        this._lastInputStr = this._input.val().toString();
    }
    private _search(key: string) {
        if(key == "") return;
        window.electronAPI.searchCard(key).then(rlt => {
            this.clear();
            rlt.forEach(name => {
                var node = this._chooseCopy.clone();
                var choose = new CardChooseWrap(node, name)
                choose.eventer.add("chooseDown", (name)=>{
                    this.eventer.event("chooseDown", name)
                    this._input.val("");
                    this._onInput();
                })
                this._selectionBox.append(node);
                this._chooseList.push(choose);
            })
        });
    }
    public clear() {
        this._chooseList.forEach(wrap => {
            wrap.node.remove();
        })
        this._chooseList.length = 0;
    }
}


class BarWrap {
    constructor(
        private _node: JQuery<HTMLElement>, 
        private _cardListWrap: CardListWrap
    ) {
        _node.children(".analysis").on("click", ()=>{
            window.electronAPI.createReport(this._cardListWrap.key);
        });
        _node.children(".fix").on("click", ()=>{
            localStorage.clear();
        });
    }
}

var cardItem = $(".Hub .Card");   
var cardBox = $(".CardBox");
const cardListWrap = new CardListWrap();
const searchWrap = new CardSearchWrap($(".CardSearch"));
const bar = new BarWrap($(".Bar"), cardListWrap);
const lastKey = readLastKey()
for(var i = 0;i < 8;i++) {
    const item = cardItem.clone(false, false);
    const cardWrap = new CardWrap(item, i);
    cardListWrap.add(cardWrap);
    cardBox.append(item);
}
cardListWrap.onClickFace(0);
searchWrap.eventer.add("chooseDown", (name: string)=>{
    cardListWrap.modCard(name);
})
if(lastKey) {
    cardListWrap.key = lastKey;
}
