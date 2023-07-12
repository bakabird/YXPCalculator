import { Men, Role } from "./_share_code_";

export default {
    MenOf(role: Role) {
        switch (role) {
            // 牧逸风
            case Role.Dyf:
                return Men.QLJJ
            // 炎雪
            case Role.Yx:
                return Men.QLJJ
            // 龙瑶
            case Role.Ly:
                return Men.QLJJ
            // 林小月
            case Role.Lxy:
                return Men.QLJJ
            // 谭舒雁
            case Role.Tsy:
                return Men.QXG
            // 炎尘
            case Role.Yc:
                return Men.QXG
            // 曜灵
            case Role.Yl:
                return Men.QXG
            // 姜袭明
            case Role.Jxm:
                return Men.QXG
            // 吾行之
            case Role.Wxz:
                return Men.WXDM
            // 杜伶鸳
            case Role.Dly:
                return Men.WXDM
            // 花沁蕊
            case Role.Hqr:
                return Men.WXDM
            // 慕虎
            case Role.Mh:
                return Men.WXDM
            /**无 */
            case Role.NON:
                return Men.NON;
        }
    }
}