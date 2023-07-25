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

export interface IHumanData {
    cardKey: string;
    role: Role;
    hp: number,
    xiuwei: number
}

export interface IRenderWorkerData { 
    me: IHumanData,
    he: IHumanData,
    threadNum: number
}

var JianRole =  [
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
