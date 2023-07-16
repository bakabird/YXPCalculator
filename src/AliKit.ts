import OSS from "ali-oss"
import RdmUtil from "./RdmUtil";
import PenUtil from "./PenUtil";
// @ts-ignore
import private from "./privatekey.json"
import Store from "electron-store"
import { StoreKey } from "./StoreKey";

const store = new Store<{
    [StoreKey.FeedbackRestTime]: number,
    [StoreKey.FeedbackNextRefreshTime]: number,
}>();
// @ts-ignore
const id = PenUtil.a(private.id)
// @ts-ignore
const secret = PenUtil.b(private.secret)


const client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-shenzhen',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: id,
    accessKeySecret: secret,
    // yourbucketname填写存储空间名称。
    bucket: 'snowball980914'
});

// async function putBuffer() {
//     try {
//         const result = await client.put('advise.' + Date.now(), new Buffer('缺少卡《锦衣玉食》.'));
//         console.log(result);
//     } catch (e) {
//         console.log(e);
//     }
// }

async function getBuffer(filename) {
    try {
        const result = await client.get(filename);
        // console.log(result.content.toString());
        return result.content.toString();
    } catch (e) {
        throw e;
    }
}

async function putBuffer(filename: string, buffer: Buffer) {
    try {
        const result = await client.put(filename, buffer);
        return result
    } catch (e) {
        throw e;
    }
}

export default class AliKit {
    private static _me: AliKit
    public static get me() {
        if (!this._me) {
            this._me = new AliKit()
        }
        return this._me;
    }
    private constructor() { }
    public get(arg: {
        filename: string
    }) {
        return getBuffer(arg.filename);
    }
    public post(arg: {
        item: string,
        content: string,
        attachment?: {
            fileExt: string,
            fileBuffer: ArrayBuffer
        },
    }) {
        const advFileName = `adv.${Date.now()}.${RdmUtil.randomString(3)}.${arg.item}.txt`
        let content = arg.content
        let picFileName = "";
        if (arg.attachment) {
            picFileName = `pic.${Date.now()}.${RdmUtil.randomString(3)}${arg.attachment.fileExt}`
            content += `\n\n${picFileName}`
            // console.log(picFileName);
        }
        return new Promise<void>((rso, rje) => {
            const refreshTime = store.get(StoreKey.FeedbackNextRefreshTime, 0);
            if (Date.now() > refreshTime) {
                store.set(StoreKey.FeedbackNextRefreshTime, Date.now() + 30 * 60 * 1000)
                store.set(StoreKey.FeedbackRestTime, 5);
            }
            const restTime = store.get(StoreKey.FeedbackRestTime, 5);
            // console.log(refreshTime, restTime);
            if (restTime < 1) {
                rje("每半个小时只能提交五次反馈噢！")
                return
            }
            store.set(StoreKey.FeedbackRestTime, restTime - 1);
            putBuffer(advFileName, Buffer.from(content))
                .then<void>(() => {
                    // console.log(picFileName) 
                    if (picFileName != "") {
                        // console.log(arg.attachment.fileBuffer.byteLength)
                        putBuffer(picFileName, Buffer.from(arg.attachment.fileBuffer))
                            .then(() => {
                                rso()
                            }).catch(e => {
                                rje(e)
                            })
                    } else {
                        rso()
                    }
                })
        })

    }
}