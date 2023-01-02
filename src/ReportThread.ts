import { Miri } from "./Miri";
import WorkerMsg from "./WorkerMsg";

const {
    isMainThread, parentPort, workerData
  } = require('node:worker_threads');

const cardKey = workerData.cardKey;
const miri = new Miri(cardKey);

miri.onmessage((type, data)=>{
    var msg = new WorkerMsg(type);
    msg.data = data;
    parentPort.postMessage(msg);
})

miri.Go();
