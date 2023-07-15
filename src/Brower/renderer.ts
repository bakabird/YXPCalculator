/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
namespace Share2Renderer {
    /**
     * SHARE CODE START
     */
    export enum Men {
        /**青莲剑宗 */
        QLJJ,
        /**五行道盟 */
        WXDM,
        /**七星阁 */
        QXG,
        /**无门派 */
        NON,
    }

    export enum Career {
        /**丹 */
        Dan,
        /**符 */
        Fu,
        /**琴 */
        Qin,
        /**画 */
        Hua,
        /**阵 */
        Zhen,
        /**植 */
        Zhi,
        /**无 */
        NON,
    }

    export enum Role {
        // 牧逸风
        Dyf,
        // 炎雪
        Yx,
        // 龙瑶
        Ly,
        // 林小月
        Lxy,
        // 谭舒雁
        Tsy,
        // 炎尘
        Yc,
        // 曜灵
        Yl,
        // 姜袭明
        Jxm,
        // 吾行之
        Wxz,
        // 杜伶鸳
        Dly,
        // 花沁蕊
        Hqr,
        // 慕虎
        Mh,
        /**无 */
        NON,
    }

    var JianRole = [
        Role.Dyf, Role.Yx, Role.Ly, Role.Lxy,
    ]
    var QiRole = [
        Role.Tsy, Role.Yc, Role.Yl, Role.Jxm
    ]
    var WuRole = [
        Role.Wxz, Role.Dly, Role.Hqr, Role.Mh
    ]

    export function getMenByRole(role: Role): Men {
        if (JianRole.includes(role)) return Men.QLJJ
        else if (QiRole.includes(role)) return Men.QXG
        else if (WuRole.includes(role)) return Men.WXDM
        return Men.NON;
    }

    export function countdown(num: number, deal: Function) {
        return function () {
            num--;
            if (num == 0) {
                deal();
            }
        }
    }

    /**
     * SHARE CODE END
     */
}
/**
 * SHARE CODE2 START
 */
interface Window {
    electronAPI: {
        searchCard(key: string, filter: {
            men: any,
            career: any,
            role: any
        }): Promise<Array<string>>;
        getAllCards(): Promise<Array<string>>;
        createReport(key: string, role: number, eKey: string, eRole: number, threadNum: number): void;
        feedback(item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer): Promise<void>;
        viewReport(fightReport: any): void;
        doDebug(): void;
        onProcessOver(callback: (evt: any, data: any) => void): void;
    };
}
/**
 * SHARE CODE2 END
 */
const Cfg = {
}
const Const = {
    FeedbackDefaultItem: "无",
    FeedbackLostCard: "缺卡",
    FeedbackContentMinLen: 3,
    FeedbackContentMaxLen: 250,
    MaxFileSize: 1024 * 2,
    CFFDotSize: 4,
    CFFMarginTop: 150,
}
/**
 *
 * @param {string|Blob|Array} data 数据源，可以是图片的base64、File等
 * @param {string} name 文件名
 * @param {object} options
 * @param {string} options.type MIME类型，尽量传入正确的类型
 * @param {string} options.encode 字符编码类型
 * @param {boolean} options.timestamp 是否在文件名后追加时间戳
 */
function download(
    data,
    name = '',
    { type = 'text/plain', encode = "utf-8", timestamp = false } = {}
) {
    return new Promise<void>((resolve, reject) => {
        if (!data) return

        try {
            let blob
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = name + (timestamp ? `_${Date.now()}` : '')

            if (/^https?|ftp|data:/.test(data)) {
                a.href = data
            } else {
                blob =
                    data instanceof Blob
                        ? data
                        : new Blob(data instanceof Array ? data : [data], {
                            type: type + (encode ? ';charset=' + encode : '')
                        })
                a.href = URL.createObjectURL(blob)
            }

            setTimeout(() => {
                a.click()
                setTimeout(() => {
                    a.remove()
                    resolve()
                    if (blob instanceof Blob) {
                        setTimeout(() => {
                            URL.revokeObjectURL(blob)
                        }, 1000)
                    }
                }, 1)
            }, 0)
        } catch (error) {
            reject(error)
        }
    })
}
class Eventer {
    private _listDict: Record<string, Array<(...arg: any) => void>> = {};
    public event(name: string, ...arg: any) {
        if (this._listDict[name]) {
            this._listDict[name].forEach(lis => lis(...arg));
        }
    }
    public add(event: string, listen: (...arg: any) => void) {
        if (!this._listDict[event]) {
            this._listDict[event] = [];
        }
        this._listDict[event].push(listen);
    }
}

function readKey(key: string, def: string): string {
    return localStorage.getItem(key) ?? def;
}

function saveKey(key: string, val: string) {
    localStorage.setItem(key, val);
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
            $(btn).on("click", () => {
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

class CardLibItemWrap {
    private _cardFace: JQuery<HTMLImageElement>;
    private _levelG: JQuery<HTMLElement>;
    private _level: number;
    public get level(): number {
        return this._level;
    }
    public set level(v: number) {
        this._level = v;
        this.uptFace();
    }
    constructor(private _node: JQuery<HTMLElement>, private _cardname: string) {
        this._levelG = _node.find(".levelG");
        this._cardFace = _node.find(".cardFace") as JQuery<HTMLImageElement>;
        _node.find("p").text(_cardname);
        const allLevelBtn = this._levelG.find("*");
        allLevelBtn.each((index, btn) => {
            const btnIndex = index;
            $(btn).on("click", () => {
                this.level = btnIndex;
            });
        })
        this.level = 0;
    }
    public uptFace() {
        this._cardFace.attr("src", `./img/${this._cardname}_${this._level + 1}级.png`);
        this._levelG.children().removeClass("on");
        $(this._levelG.children().get(this.level)).addClass("on");
    }
}

class CardListWrap {
    public eventer: Eventer = new Eventer();
    private _blue: JQuery<HTMLElement>;
    private _list: Array<CardWrap>;
    private _curTargetIndex: number = -1;
    constructor(private _node: JQuery<HTMLElement>, private _localKey: string) {
        this._blue = $(".Hub .Card");
        this._list = [];
    }
    public get key(): string {
        return this._list.reduce((p, c) => {
            return p + c.cardname + "," + c.level + ";"
        }, "")
    }
    public set key(v: string) {
        if (v == null) {
            this.each(c => {
                c.cardname = "普通攻击";
                c.level = 0;
            })
            return;
        }
        v.split(";").forEach((part, index) => {
            if (part == "" || index >= this._list.length) return
            const [cardName, level] = part.split(",");
            this._list[index].cardname = cardName;
            this._list[index].level = parseInt(level);
        })
    }
    public init() {
        for (var i = 0; i < 8; i++) {
            const item = this._blue.clone(false, false);
            const cardWrap = new CardWrap(item, i);
            this.add(cardWrap);
            this._node.append(item);
        }
    }
    public add(cardWrap: CardWrap) {
        cardWrap.eventer.add("clickFace", this.onClickFace.bind(this));
        cardWrap.eventer.add("uptFace", this.onUptFace.bind(this));
        this._list.push(cardWrap);
    }
    public each(walk: (card: CardWrap) => void) {
        this._list.forEach(walk);
    }
    public modCard(name: string) {
        if (this._curTargetIndex < 0) return;
        this._list[this._curTargetIndex].cardname = name;
        if (this._curTargetIndex + 1 < this._list.length) {
            this.onClickFace(this._curTargetIndex + 1);
        } else {
            this.onClickFace(0);
        }
    }
    public moveCard(step: number) {
        const absStep = Math.abs(step);
        const miniStep = step > 0 ? 1 : -1;
        let cur = this._curTargetIndex;
        for (var i = 0; i < absStep; i++) {
            const tar = (cur + miniStep) >= 0 ?
                ((cur + miniStep) % this._list.length) :
                (cur + miniStep + this._list.length);
            const curC = this._list[cur];
            const tarC = this._list[tar];
            const tmpN = tarC.cardname;
            const tmpL = tarC.level;
            tarC.cardname = curC.cardname;
            tarC.level = curC.level;
            curC.cardname = tmpN;
            curC.level = tmpL
            cur = tar;
        }
        this.onClickFace(cur);
    }
    public onClickFace(index: number) {
        this._curTargetIndex = index;
        this._list.forEach((i, iIdx) => {
            if (iIdx == index) {
                i.oShowArrow();
            } else {
                i.oHideArrow();
            }
        })
        this.eventer.event("clickFace", this);
    }
    public unclick() {
        this._curTargetIndex = -1;
        this._list.forEach(i => i.oHideArrow());
    }
    public read() {
        if (readKey(this._localKey, "") != "") {
            this.key = readKey(this._localKey, "");
        }
    }
    public onUptFace() {
        saveKey(this._localKey, this.key);
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
        _node.on("click", () => {
            this.choose();
        });
    }
    public choose() {
        this.eventer.event("chooseDown", this._cardName);
    }
}

class AvatarSelector {
    private _choosen: string;
    private _img: JQuery<HTMLImageElement>

    public get role(): Share2Renderer.Role {
        return Share2Renderer.Role[this._choosen];
    }

    public get men(): Share2Renderer.Men {
        return Share2Renderer.getMenByRole(this.role);
    }

    constructor(
        _node: JQuery<HTMLElement>,
        private _onChg: () => void,
    ) {
        const sotragekey = "avatar-choosen";
        const self = this;
        this._choosen = readKey(sotragekey, "Tsy")
        this._img = _node.find("img");

        _node.find(`option`).attr("label", function (i) {
            return this.innerText;
        });
        const choose = _node.find(`option[img=${this._choosen}]`)
        choose.attr("selected", "selected")
        this._img.attr("src", `img1/Role/${choose.attr('img')}.png`)
        _node.find("select").on("change", function () {
            const selected = this.selectedOptions[0];
            const img = selected.attributes["img"].value
            const label = self._choosen = img;
            self._img.attr("src", `img1/Role/${img}.png`)
            saveKey(sotragekey, label);
            self._onChg()
        })
    }
}

class CareerSelector {
    private _choosen: string;
    private _img: JQuery<HTMLImageElement>

    public get career(): Share2Renderer.Career {
        return Share2Renderer.Career[this._choosen];
    }

    constructor(
        _node: JQuery<HTMLElement>,
        private _onChg: () => void,
    ) {
        const sotragekey = "career-choosen";
        const self = this;
        this._choosen = readKey(sotragekey, "Qin")
        this._img = _node.find("img");

        _node.find(`option`).attr("label", function (i) {
            return this.innerText;
        });
        const choose = _node.find(`option[img=${this._choosen}]`)
        choose.attr("selected", "selected")
        this._img.attr("src", `img1/Career/${choose.attr('img')}.png`)
        _node.find("select").on("change", function () {
            const selected = this.selectedOptions[0];
            const img = selected.attributes["img"].value
            const label = self._choosen = img;
            self._img.attr("src", `img1/Career/${img}.png`)
            saveKey(sotragekey, label);
            self._onChg()
        })
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
    private _avatarSelector: AvatarSelector;
    private _careerSelector: CareerSelector;
    private _key: string;

    public get curRole() {
        return this._avatarSelector.role;
    }

    constructor(private _node: JQuery<HTMLElement>) {
        this._engRegxp = new RegExp('[A-z]');
        this._numRegxp = new RegExp("[0-9]");
        this._chooseCopy = $(".Hub .cardBtn");
        this._input = _node.find("input");
        this._selectionBox = _node.find(".selection");
        this._chooseList = []
        this._lastInputStr = "";
        this._key = "";
        this._avatarSelector = new AvatarSelector(_node.find(".avatar"), this._search.bind(this));
        this._careerSelector = new CareerSelector(_node.find(".career"), this._search.bind(this))
        this._input.on("input", this._onInput.bind(this))
        _node.find(".moveLeft").on("click", this._onMoveLeft.bind(this));
        _node.find(".moveRight").on("click", this._onMoveRight.bind(this));
    }
    private _onInput() {
        const val = this._input.val().toString();
        if (val.length > 0) {
            if (val.length > this._lastInputStr.length) {
                const lastInput = val[val.length - 1];
                if (this._engRegxp.test(lastInput)) {
                    this._key = val;
                    this._search();
                } else {
                    this._input.val(val.slice(0, val.length - 1));
                    if (this._numRegxp.test(lastInput)) {
                        const num = parseInt(lastInput) - 1;
                        this._chooseList[num]?.choose();
                    }
                }
            } else {
                this._key = val;
                this._search();
            }
        }
        this._lastInputStr = this._input.val().toString();
    }
    private _onMoveLeft() {
        this.eventer.event("move", -1);
    }
    private _onMoveRight() {
        this.eventer.event("move", 1);
    }
    private _search() {
        const key = this._key
        if (key == "") return;
        window.electronAPI.searchCard(key, {
            men: this._avatarSelector.men,
            role: this._avatarSelector.role,
            career: this._careerSelector.career
        }).then(rlt => {
            this.clear();
            rlt.forEach(name => {
                var node = this._chooseCopy.clone();
                var choose = new CardChooseWrap(node, name)
                choose.eventer.add("chooseDown", (name) => {
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

class CardLibWrap {
    private _body: JQuery<HTMLElement>;
    private _blue: JQuery<HTMLElement>;
    constructor(
        private _node: JQuery<HTMLElement>,
    ) {
        _node.children(".close").on("click", () => {
            this.hide();
        });
        _node.children(".feedback").on("click", () => {
            FeedbackWrap.last.show()
            FeedbackWrap.last.item.val(Const.FeedbackLostCard)
        });
        this._body = _node.children(".body")
        this._blue = $(".Hub .CardLibItem");
        window.electronAPI.getAllCards().then((allcards: Array<string>) => {
            allcards.forEach((card, idx) => {
                const item = this._blue.clone(false, false);
                new CardLibItemWrap(item, card);
                this._body.append(item);
            })
        })
    }

    public show() {
        this._node.removeClass("hide");
    }

    public hide() {
        this._node.addClass("hide");
    }
}

class FeedbackWrap {
    public static last: FeedbackWrap;

    public get item() {
        return this._node.find(".body form select")
    }

    private get _content() {
        return this._node.find(".body textarea")
    }

    private _cd: number
    private _tip: JQuery<HTMLElement>
    private _inputFile: JQuery<HTMLInputElement>
    private _previewImg: JQuery<HTMLImageElement>

    constructor(
        private _node: JQuery<HTMLElement>,
    ) {
        FeedbackWrap.last = this;
        this._cd = 0
        const tip = this._tip = _node.find(".body .tip")
        const inputFile = this._inputFile = _node.find(".body .file_upload input") as JQuery<HTMLInputElement>
        const previewImg = this._previewImg = _node.find(".body img") as JQuery<HTMLImageElement>
        _node.children(".close").on("click", () => {
            this.hide();
        });
        _node.find(".body .confirm").on("click", () => {
            if (this._cd > 0) {
                alert("请稍等片刻后重试~")
                return;
            }
            this._cd++;
            setTimeout(() => {
                this._cd--;
            }, 1333);
            if (this.item.val() == Const.FeedbackDefaultItem) {
                this.item
                    .css({
                        borderColor: "red"
                    })
                    .animate({
                        'borderWidth': '3px',
                    }, 500)
                    .animate({
                        'borderWidth': '1px',
                    }, 400, () => {
                        this.item.css({
                            borderColor: "black"
                        })
                    })
                return
            }
            const contentTip = this._checkContent();
            if (contentTip) {
                tip.text(contentTip)
                setInterval(() => {
                    tip.text("")
                }, 3000);
                this._content
                    .css({
                        borderColor: "red"
                    })
                    .animate({
                        'borderWidth': '3px',
                    }, 500)
                    .animate({
                        'borderWidth': '1px',
                    }, 400, () => {
                        this._content.css({
                            borderColor: "black"
                        })
                    })
                return;
            }
            const input = inputFile[0]
            if (input.files.length > 0) {
                const f = input.files[0]
                const reader = new FileReader();   // 读取文件并以数据 URI 形式保存在 result 属性中
                reader.readAsArrayBuffer(f);
                reader.onload = (e) => {
                    let rlt = e.target.result as ArrayBuffer;
                    console.log(f.name)
                    this._post(f.name, rlt);
                }   // 在文件加载失败后触发 error 事件
                reader.onerror = function (e) { }
            } else {
                this._post()
            }
        })
        inputFile.on("change", () => {
            const fileObj = inputFile[0].files[0]
            const fileSize = (fileObj.size / 1024) >> 0
            const reader = new FileReader();   // 读取文件并以数据 URI 形式保存在 result 属性中
            reader.readAsDataURL(fileObj);   // 在文件加载成功后触发 load 事件

            if (fileSize > Const.MaxFileSize) {
                this._inputFile.val("")
                alert(`请上传小于 ${Const.MaxFileSize / 1024}MB 的图片`)
                return;
            }

            // readAsBinaryString [file] 将文件读取为二进制码
            // readAsDataURL [file] 将文件读取为 DataURL
            // readAsText [file] 将文件读取为文本
            // readAsText：该方法有两个参数，其中第二个参数是文本的编码方式，默认值为 UTF-8。这个方法非常容易理解，将文件以文本方式读取，读取的结果即是这个文本文件中的内容。
            // readAsBinaryString：该方法将文件读取为二进制字符串，通常我们将它传送到后端，后端可以通过这段字符串存储文件。
            // readAsDataURL：这是例子程序中用到的方法，该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
            reader.onload = function (e) {
                let imgUrl = e.target.result as string;
                previewImg.attr("src", imgUrl);
            }   // 在文件加载失败后触发 error 事件
            reader.onerror = function (e) { }
        })
    }

    private _checkContent() {
        if (this._content.val().toString().length < Const.FeedbackContentMinLen) {
            return "反馈内容过短。"
        } else if (this._content.val().toString().length > Const.FeedbackContentMaxLen) {
            return "反馈内容过多。"
        }
    }

    private _post(fileName?: string, fileBianryStr?: ArrayBuffer) {
        LoadingWrap.last.show()
        this._cd++
        setTimeout(() => {
            this._cd--;
        }, 10 * 1000);
        const cd = Share2Renderer.countdown(2, () => {
            LoadingWrap.last.hide()
            this._clean()
            this.hide()
        })
        const item = this.item.val() as string;
        const content = this._content.val() as string
        window.electronAPI.feedback(item, content, fileName, fileBianryStr)
            .then(() => {
                alert("反馈成功")
                cd()
            })
            .catch(err => {
                alert("反馈失败\n" + err)
                cd();
            })
        setTimeout(() => {
            cd()
        }, 1111);
    }

    private _clean() {
        this._tip.val("");
        this._content.val("");
        this.item.val("")
        this._inputFile.val("")
        this._previewImg.removeAttr("src");
    }

    public show() {
        this._node.removeClass("hide");
    }

    public hide() {
        this._node.addClass("hide");
    }
}

class LoadingWrap {
    public static last: LoadingWrap;

    private _img: JQuery<HTMLImageElement>

    constructor(
        private _node: JQuery<HTMLElement>,
    ) {
        LoadingWrap.last = this;
        this._img = _node.find("img");
    }

    public show() {
        this._node.removeClass("hide");
        const longtime = 1000
        const roundtime = 2000
        this._img.animate({
            rotation: `+=${360 * longtime}deg`
        }, {
            duration: roundtime * longtime,
            easing: 'linear',
            step: function (now, fx) {
                $(this).css('transform', 'rotate(' + -now + 'deg)')
            }
        })
    }

    public hide() {
        this._node.addClass("hide");
        this._img.stop()
    }
}

class BarWrap {
    constructor(
        private _node: JQuery<HTMLElement>,
        private _fCardListWrap: CardListWrap,
        private _eCardListWrap: CardListWrap,
        private _libWrap: CardLibWrap,
        private _feedbackWrap: FeedbackWrap,
        private _cardSearch: CardSearchWrap,
    ) {
        _node.children(".analysis").on("click", () => {
            const threadNum = parseInt(_node.children("select")[0].value);
            window.electronAPI.createReport(
                this._fCardListWrap.key, this._cardSearch.curRole,
                this._eCardListWrap.key, Share2Renderer.Role.Dly, threadNum);
        });
        _node.children(".openCardlib").on("click", () => {
            this._libWrap.show();
        })
        _node.children(".feedback").on("click", () => {
            this._feedbackWrap.show();
        })
        _node.children(".fix").on("click", () => {
            localStorage.clear();
        });
        _node.children(".debug").on("click", () => {
            window.electronAPI.doDebug();
        })
        _node.children(".console").on("click", () => {
            ConsoleWrap.last.show();
        })
    }
}

class ECardBoxTitle {
    constructor(
        _node: JQuery<HTMLElement>,
        _eCardListWrap: CardListWrap,
    ) {
        _node.children(".cleanEnemyBox").on("click", () => {
            _eCardListWrap.key = null;
        })
    }
}

class ConsoleWrap {
    public static last: ConsoleWrap;

    private _code: string

    constructor(
        private _node: JQuery<HTMLElement>,
    ) {
        ConsoleWrap.last = this;
        const self = this
        _node.find("td").on("click", function () {
            // console.log(this.innerText)
            self._code += this.innerText
            self._checkCode()
        })
        _node.find(".back").on("click", () => {
            this.hide()
        })
    }

    private _checkCode() {
        if (this._code == "2138") {
            this._openCardFaceFactory()
        }
    }

    private _openCardFaceFactory() {
        this.hide();
        CardFaceFactoryWrap.last.show()
    }

    public show() {
        this._node.removeClass("hide");
        this._code = ""
    }

    public hide() {
        this._node.addClass("hide");
        this._code = ""
    }
}

class CardFaceFactoryWrap {
    public static last: CardFaceFactoryWrap;

    private _cutedImg1: JQuery<HTMLImageElement>
    private _cutedImg2: JQuery<HTMLImageElement>
    private _cutedImg3: JQuery<HTMLImageElement>
    private _previewImg: JQuery<HTMLImageElement>
    private _inputCardname: JQuery<HTMLInputElement>
    private _inputFile: JQuery<HTMLInputElement>
    private _inputX: JQuery<HTMLInputElement>
    private _inputY: JQuery<HTMLInputElement>
    private _dots: JQuery<HTMLElement>[]
    private _posArr: Array<Array<number>>
    private _cutTimer: NodeJS.Timer;

    private _left: number
    private _top: number
    private _width: number
    private _height: number
    private _gap: number
    private _scale: number

    private set Left(l: number) {
        this._left = l;
        this._sync()
    }

    private set Top(t: number) {
        this._top = t
        this._sync()
    }

    private set Width(w: number) {
        this._width = w
        this._sync()
    }

    private set Height(h: number) {
        this._height = h
        this._sync()
    }

    private set Gap(g: number) {
        this._gap = g
        this._sync()
    }

    private set Scale(s: number) {
        this._scale = s
        this._sync()
    }

    constructor(
        private _node: JQuery<HTMLElement>,
    ) {
        CardFaceFactoryWrap.last = this;
        this._dots = []
        this._posArr = []
        this._cutedImg1 = _node.find("#CFFCutedImg1") as JQuery<HTMLImageElement>
        this._cutedImg2 = _node.find("#CFFCutedImg2") as JQuery<HTMLImageElement>
        this._cutedImg3 = _node.find("#CFFCutedImg3") as JQuery<HTMLImageElement>
        this._inputCardname = _node.find("#cardname") as JQuery<HTMLInputElement>
        _node.find(".dot").each((idx, ele) => {
            this._dots.push($(ele));
        })
        const inputFile = this._inputFile = _node.find("#card") as JQuery<HTMLInputElement>
        const previewImg = this._previewImg = _node.find("#CFFPreviewImg") as JQuery<HTMLImageElement>
        const ctrl = _node.find(".ctrl")
        const inputX = this._inputX = ctrl.find(".x") as JQuery<HTMLInputElement>
        const inputY = this._inputY = ctrl.find(".y") as JQuery<HTMLInputElement>
        const inputW = ctrl.find(".w")
        const inputH = ctrl.find(".h")
        const inputGap = ctrl.find(".gap")
        const inputScale = ctrl.find(".scale")
        const inputExport = ctrl.find("#export")
        inputX.on("input", () => { this.Left = parseInt(inputX.val() as string) })
        inputY.on("input", () => { this.Top = parseInt(inputY.val() as string) })
        inputW.on("input", () => { this.Width = parseInt(inputW.val() as string) })
        inputH.on("input", () => { this.Height = parseInt(inputH.val() as string) })
        inputGap.on("input", () => { this.Gap = parseInt(inputGap.val() as string) })
        inputScale.on("input", () => { this.Scale = parseFloat(inputScale.val() as string) })
        inputFile.on("change", this._onInputFileChange.bind(this))
        previewImg.on("click", this._onClickPreviewImg.bind(this))
        inputExport.on("click", this._onInputExport.bind(this))
        this.Left = 0;
        this.Top = 0;
        this.Width = 206;
        this.Height = 345;
        this.Gap = 50;
        this.Scale = 1;
        inputX.val(this._left)
        inputY.val(this._top)
        inputW.val(this._width)
        inputH.val(this._height)
        inputGap.val(this._gap)
        inputScale.val(this._scale)
    }

    private _onInputFileChange() {
        const fileObj = this._inputFile[0].files[0]
        const previewImg = this._previewImg
        const reader = new FileReader();   // 读取文件并以数据 URI 形式保存在 result 属性中
        const self = this
        reader.readAsDataURL(fileObj);   // 在文件加载成功后触发 load 事件

        // readAsBinaryString [file] 将文件读取为二进制码
        // readAsDataURL [file] 将文件读取为 DataURL
        // readAsText [file] 将文件读取为文本
        // readAsText：该方法有两个参数，其中第二个参数是文本的编码方式，默认值为 UTF-8。这个方法非常容易理解，将文件以文本方式读取，读取的结果即是这个文本文件中的内容。
        // readAsBinaryString：该方法将文件读取为二进制字符串，通常我们将它传送到后端，后端可以通过这段字符串存储文件。
        // readAsDataURL：这是例子程序中用到的方法，该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
        reader.onload = function (e) {
            let imgUrl = e.target.result as string;
            previewImg.attr("src", imgUrl);
            self._cut()
        }   // 在文件加载失败后触发 error 事件
        reader.onerror = function (e) { }
    }

    /**
     * export three cuted image
     */
    private _onInputExport() {
        const cardname = this._inputCardname.val()
        if (cardname === "") {
            alert("尚未输入卡牌名")
            return
        }
        const cutedArr = [this._cutedImg1, this._cutedImg2, this._cutedImg3]
        cutedArr.forEach((cuted, index) => {
            if (cuted.attr("src").startsWith("data:")) {
                download(cuted.attr("src"), `${cardname}_${index + 1}级`)
            }
        })
    }

    private _onClickPreviewImg() {
        const ox = event.target["x"]
        const oy = event.target["y"]
        const ex = event["x"]
        const ey = event["y"]
        const x = ex - ox
        const y = ey - oy
        this._inputX.val(x)
        this._inputX.trigger("input")
        this._inputY.val(y)
        this._inputY.trigger("input")
    }

    private _sync() {
        const dotSize = Const.CFFDotSize;
        const marginTop = Const.CFFMarginTop;
        const s = this._scale
        let nextX = -(dotSize >> 1) + this._left * s
        let nextY = -(dotSize >> 1) + marginTop + this._top * s;
        const posArr = this._posArr = [];
        let rest = 5
        posArr.push([nextX, nextY])
        while (rest--) {
            if (rest % 2 == 0) {
                nextX += this._width * s;
                nextY += this._height * s
            } else {
                nextX += this._gap * s
                nextY -= this._height * s
            }
            posArr.push([nextX, nextY])
        }
        posArr.forEach((pos, idx) => {
            this._dots[idx].css("left", pos[0] + "px")
            this._dots[idx].css("top", pos[1] + "px")
        })
        clearTimeout(this._cutTimer)
        this._cutTimer = setTimeout(this._cut.bind(this), 100)
    }

    private _cut() {
        const preview = this._previewImg[0];
        if (!preview.src.startsWith("data:")) {
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const posArr = this._posArr
        const w = this._width;
        const h = this._height;
        const s = this._scale;
        const cutedImgs = [this._cutedImg1, this._cutedImg2, this._cutedImg3]
        canvas.width = w * s;
        canvas.height = h * s;
        for (var i = 0; i < 3; i++) {
            var [x, y] = posArr[i * 2]
            var [rbX, rbY] = posArr[i * 2 + 1]
            y -= Const.CFFMarginTop
            rbY -= Const.CFFMarginTop
            var __img = cutedImgs[i]
            var __w = rbX - x;
            var __h = rbY - y;
            ctx.drawImage(preview, x, y, __w, __h, 0, 0, __w, __h);
            __img.attr("src", canvas.toDataURL("image/png"));
        }
    }

    public show() {
        this._node.removeClass("hide");
    }

    public hide() {
        this._node.addClass("hide");
    }
}

const cardListWrap = new CardListWrap($(".FCardBox"), "fCardKey");
const eCardListWrap = new CardListWrap($(".ECardBox"), "eCardKey");
const searchWrap = new CardSearchWrap($(".CardSearch"));
const cardlibWrap = new CardLibWrap($(".CardLib"))
const feedbackWrap = new FeedbackWrap($(".Feedback"))
const loadingWrap = new LoadingWrap($(".Loading"))
const consoleWrap = new ConsoleWrap($(".Console"))
const cffWrap = new CardFaceFactoryWrap($(".CardFaceFactory"))
const bar = new BarWrap($(".Bar"), cardListWrap, eCardListWrap, cardlibWrap, feedbackWrap, searchWrap);
new ECardBoxTitle($(".enemyCardBoxTitle"), eCardListWrap);
let activeWrap: CardListWrap;
const onClickFace = (wrap: CardListWrap) => {
    if (activeWrap != wrap) {
        activeWrap?.unclick();
        activeWrap = wrap;
    }
}

cardListWrap.init();
eCardListWrap.init();
eCardListWrap.eventer.add("clickFace", onClickFace);
cardListWrap.eventer.add("clickFace", onClickFace);
cardListWrap.onClickFace(0);
searchWrap.eventer.add("chooseDown", (name: string) => {
    activeWrap.modCard(name);
});
searchWrap.eventer.add("move", (step: number) => {
    activeWrap.moveCard(step);
});
cardListWrap.read();
eCardListWrap.read();
