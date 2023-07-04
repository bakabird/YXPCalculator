// 装饰器
export function GenPush2Arr(tar: Array<any>) {
    return function (_class: any, arg1: any) {
        tar.push(_class)
    }
}

export function Keeping(_class: any, arg: any) {
    _class.prototype.onGetIsKeeping = function () {
        return true
    }
}