import { BestDmgAI } from "./BestDmgAI";
import { CardListFactory } from "./CardListFactory";
import { Fight } from "./Fight";
import { FightReport } from "./FightReport";
import { MiriWorker } from "./Miri";
import PossibleCardSet from "./PossibleCardSet";
import { Sumamry } from "./Sumamry";
import WorkerMsg from "./WorkerMsg";

const {
    isMainThread, parentPort, workerData
  } = require('node:worker_threads');

const cardKey = workerData.cardKey;
const eCardKey = workerData.eCardKey;
const threadNum = workerData.threadNum;
const possibleSet = new PossibleCardSet(cardKey);
const sum: Sumamry = new Sumamry();
const heManArg = ["胖虎", 110, 100];
const meManArg = ["大雄", 110, 50];
const heCardInfos = CardListFactory.me.SplitCode(eCardKey);
const allMiri: Array<MiriWorker> = [];

function buildFightTurn(miri: MiriWorker) {
  const id = allMiri.length;
  allMiri.push(miri);
  const turn = (fr: FightReport)=>{
    sum.dmgBest = BestDmgAI.me.compare(fr, sum.dmgBest);
    const meCardInfos = possibleSet.Fetch();
    if(meCardInfos) {
      // console.log(id + " go work");
      miri.RunTask(JSON.stringify({
        meManArg, meCardInfos,
        heManArg, heCardInfos,
        curDmgBest: sum.dmgBest,
      }))
      possibleSet.MoveNext();
    } else {
      miri.end();
    }
  }
  miri.onComplete = turn;
  miri.onEnd = ()=> {
    if (!allMiri.find(i => !i.isOver)) {
      const msg = new WorkerMsg('process-over');
      msg.data = sum;
      parentPort.postMessage(msg);
      process.exit(0);
    }
  }
  return turn;
}

sum.cur = Fight.BuildRun2(meManArg, CardListFactory.me.SplitCode(cardKey), heManArg, heCardInfos);

for(var i = 0;i < threadNum;i++){
  buildFightTurn(new MiriWorker("./FightWorker.js"))(null);
}

