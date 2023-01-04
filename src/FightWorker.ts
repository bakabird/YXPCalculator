import WorkerMsg from "./WorkerMsg";
import {
    isMainThread, parentPort, workerData,
  } from 'node:worker_threads';
import { Fight } from "./Fight";
import { BestDmgAI } from "./BestDmgAI";
import { Human } from "./Human";

parentPort.on("message", (msg: WorkerMsg) => {
    if (msg.type == "task") {
        let {
            meManArg, meCardInfos, heManArg, heCardInfos, curDmgBest,
        }  = JSON.parse(msg.data);
        const fr = Fight.BuildRun2(meManArg, meCardInfos, heManArg, heCardInfos, fr=>BestDmgAI.me.cutCheck(fr,curDmgBest));
        const ret = new WorkerMsg("complete");
        ret.data = JSON.stringify(fr);
        parentPort.postMessage(ret);
    } else if (msg.type == "over") {
        process.exit(0);
    }
})
  