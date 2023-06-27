const aDict = {
    'a': 'q', 'q': 'a',
    'b': 'w', 'w': 'b',
    'c': 'e', 'e': 'c',
    'd': 'r', 'r': 'd',
}

const bDict = {
    'a': 'f', 'f': 'a',
    'b': 'g', 'g': 'b',
    'c': 'h', 'h': 'c',
    'd': 'j', 'j': 'd',
}

var tmpStrArr: Array<string> = []
var tmpChar = ""
function doByDict(dict: { [key: string]: string }, source: string) {
    tmpStrArr = []
    let chg = 0;
    for (let i = 0; i < source.length; i++) {
        const char = source[i];
        if (dict[char]) {
            tmpStrArr.push(dict[char]);
            chg++;
        } else {
            tmpStrArr.push(char)
        }
    }
    for (let i = 0; i < chg; i++) {
        const startI = i % source.length;
        const lastI = (source.length - 1) - i;
        tmpChar = tmpStrArr[startI]
        tmpStrArr[startI] = tmpStrArr[lastI]
        tmpStrArr[lastI] = tmpChar
    }
    return tmpStrArr.join("")
}


export default {
    a(source: string): string {
        return doByDict(aDict, source)
    },
    b(source: string): string {
        return doByDict(bDict, source)
    }
}