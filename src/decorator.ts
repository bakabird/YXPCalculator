// 装饰器
export function GenPush2Arr(tar: Array<any>) {
    return function (_class: any) {
        tar.push(_class)
    }
}

export function Keeping(_class: any) {
    _class.prototype.onGetIsKeeping = function () {
        return true
    }
}

export function Cost(_class: any) {
    _class.prototype.onGetIsCost = function () {
        return true
    }
}

export function Mana(mana: number) {
    return function (target: any) {
        target.prototype.onGetMana = function () {
            return mana;
        }
    }
}

