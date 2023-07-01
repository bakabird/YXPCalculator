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
        createReport(key: string, eKey: string, threadNum: number): void;
        feedback(item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer): Promise<void>;
        viewReport(fightReport: any): void;
        doDebug(): void;
        onProcessOver(callback: (evt: any, data: any) => void): void;
    };
}
/**
 * SHARE CODE2 END
 */
namespace Share2ReportRenderer {
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

namespace reportRenderer {
    class CardListWrap {
        private _cardBlue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._cardBlue = $(".Hub .Card");
        }
        public build(cards: Array<any>) {
            cards.forEach((v, i) => {
                var item = this._cardBlue.clone();
                item.children("img").attr("src", `./img/${v.name}_${v.level}级.png`);
                this._node.append(item);
            })
        }
    }

    class ReportDetailWrap {
        private _itemBlue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._itemBlue = $(".Hub .reportItem")
        }
        public build(fr) {
            var item = this._itemBlue.clone();
            item.children(".roundIdx").text("回合数");
            item.children(".useCard").text("使用卡牌");
            item.children(".meChg").text("己方生命变化")
            item.children(".meHp").text("己方生命")
            item.children(".heHp").text("敌方生命")
            item.children(".heChg").text("敌方生命变化")
            this._node.append(item);

            fr.meRoundHp.forEach((_, idx) => {
                var item = this._itemBlue.clone();
                item.children(".roundIdx").text(idx);
                if (fr.meUseCard.length > idx) {
                    item.children(".useCard").text(fr.meUseCard[idx].join(" "));
                }
                item.children(".meHp").text(`${fr.meRoundHp[idx]}/${fr.meRoundMaxHp[idx]}`)
                item.children(".heHp").text(`${fr.heRoundHp[idx]}/${fr.heRoundMaxHp[idx]}`)
                if (idx > 0) {
                    var meChg = fr.meRoundHp[idx] - fr.meRoundHp[idx - 1];
                    var meMaxChg = fr.meRoundMaxHp[idx] - fr.meRoundMaxHp[idx - 1];
                    var heChg = fr.heRoundHp[idx] - fr.heRoundHp[idx - 1];
                    var heMaxChg = fr.heRoundMaxHp[idx] - fr.heRoundMaxHp[idx - 1];
                    item.children(".meChg").text(`${meChg} | ${meMaxChg}`)
                    item.children(".heChg").text(`${heChg} | ${heMaxChg}`)
                }
                this._node.append(item);
            })
        }
    }

    class RecommendWrap {
        private _blue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._blue = $(".Hub .cards");
        }
        public build(aiRcmd) {
            var item = this._blue.clone();
            var list = new CardListWrap(item);
            list.build(aiRcmd.meCards);
            this._node.append(item);
            this._node.children(".view").on("click", () => {
                window.electronAPI.viewReport(aiRcmd);
            })
        }
        public hide() {
            this._node.addClass('hide');
        }
    }

    window.electronAPI.onProcessOver((_, sumamry) => {
        $(".waiting").addClass("hide");
        $(".body").removeClass("hide");
        var clw = new CardListWrap($(".body .cards"));
        var rdw = new ReportDetailWrap($(".body .curFightReport"))
        var rw = new RecommendWrap($(".rcmd"));
        clw.build(sumamry.cur.meCards);
        rdw.build(sumamry.cur);
        $(".fightLog").text(sumamry.cur.log);
        if (sumamry.dmgBest) {
            rw.build(sumamry.dmgBest);
        } else {
            rw.hide();
        }
    });
}
