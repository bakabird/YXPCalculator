import { Human } from "./Human";
import { BestDmgAI } from "./BestDmgAI"
import { CardListFactory } from "./CardListFactory";
import { Sumamry } from "./Sumamry";
import { Fight } from "./Fight";
import WorkerMsg from "./WorkerMsg";
import { FightReport } from "./FightReport";
const {
    Worker, isMainThread, parentPort, workerData
  } = require('node:worker_threads');

// export class Miri {
//     private _worker: MiriWorker;
//     private _onMsg: (msgType: string, msgData: any)=>void;
//     constructor(public cardCode: string) {
//         this._worker = new MiriWorker("./MiriWorker.js");
//     }

//     public onmessage(onMsg: (msgType: string, msgData: any)=>void) {
//         this._onMsg = onMsg;
//     }

//     public async Go() {
//         var heCardInfos = CardListFactory.me.SplitCode("");
//         var sum: Sumamry = new Sumamry();
//         var he: Human = new Human("胖虎", 110, 0);
//         var me: Human = new Human("大雄", 110, 50);
//         var meCardInfos = CardListFactory.me.SplitCode(this.cardCode);
//         var dmgAI = new BestDmgAI(this.cardCode);
//         var lock = new SimpleLock();
//         sum.cur = Fight.BuildRun(me, meCardInfos, he, heCardInfos);;
//         meCardInfos = dmgAI.Fetch()
//         this._worker.onComplete = (fr) => {
//             lock.wait(back => {
//                 dmgAI.Compare(fr);
//                 back();
//             })
//         }
//         while (meCardInfos) {
//             var fr: FightReport;
//             if(this._worker.isIdle) {
//                 this._worker.RunTask({
//                     me, meCardInfos, he, heCardInfos
//                 });
//                 dmgAI.MoveNext();
//             } else {
//                 fr = Fight.BuildRun(me, meCardInfos, he, heCardInfos, dmgAI.CutCheck.bind(dmgAI))
//                 await new Promise<void>(rso => {
//                     lock.wait(back => {
//                         dmgAI.Compare(fr);
//                         dmgAI.MoveNext();
//                         back();
//                         rso();
//                     })
//                 })
//             }
//             meCardInfos = dmgAI.Fetch();
//         }
//         dmgAI
//         // console.log(dmgAI.cutCount);
//         // sum.dmgAI = dmgAI.best;
//         // this._onMsg("process-over", sum);
//     }

// }

class SimpleLock {
    private _isLock: boolean;
    private _next: Array<(back:Function)=>void>;
    constructor() {
        this._next = [];
        this._isLock = false;
    }
    public wait(callback: (back:Function)=>void) {
        if(this._isLock) {
            this._next.push(callback);
        } else {
            callback(this._back.bind(this));
        }
    }
    private _back() {
        if(this._next.length > 0) {
            const next = this._next.shift();
            next(this._back.bind(this));
        }
    }
    
}

export class MiriWorker {
    public onComplete: (fr: FightReport)=>void;
    public onEnd: ()=>void;
    private _statu: "working" | "idle" | "over";
    private _inst: Worker;
    public get inst(): Worker {
        return this._inst;
    };
    public get isIdle() {
        return this._statu == "idle"
    }
    public get isWorking() {
        return this._statu == "working"
    }
    public get isOver() {
        return this._statu == "over";
    }
    constructor(filepath: string) {
        this._statu = "idle"
        const worker = new Worker(filepath, {});
        worker.on('message', (msg: WorkerMsg)=>{
            if(msg.type == "complete") {
                this._statu = "idle";
                this.onComplete  && this.onComplete(JSON.parse(msg.data));
            }
        });
        worker.on('error', (err) => {
            console.error(err);
            throw err;
        });
        worker.on('exit', (code) => {
            if (code !== 0){
                throw (new Error(`Worker stopped with exit code ${code}`));
            }
            this.onEnd && this.onEnd();
        });
        this._inst = worker;
    }
    public RunTask(taskData) {
        if(this.isWorking) throw "already working";
        const msg = new WorkerMsg("task");
        msg.data = taskData;
        this._inst.postMessage(msg);
        this._statu = "working";
    }
    public end(): void {
        if(!this.isIdle) throw "not idle";
        const msg = new WorkerMsg("over");
        this._inst.postMessage(msg);
        this._statu = "over";
    }
}
