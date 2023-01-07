export function last<T>(arr: Array<T>, offset: number = 0) {
    return arr[arr.length - 1 - offset];
}
