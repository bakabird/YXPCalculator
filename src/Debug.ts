import { BestDmgAI } from "./BestDmgAI";
import { CardName } from "./Card";
import { CardListFactory } from "./CardListFactory";
import { Fight } from "./Fight";
import { Role } from "./_share_code_";

function FormCode(codeArr: any[]) {
  return codeArr.reduce((p, c, i) => {
    if (i % 2 == 0) {
      return p + c + ",";
    } else {
      return p + c + ";";
    }
  }, "");
}

export function Debug() {
  var meManArg = ["阿梓", 100, 10, Role.Dly];
  var heManArg = ["SGR", 100, 0, Role.Lxy];
  var aCodeArr = [
    CardName.QiRecover, 2,
    CardName.MindMental, 2,
    CardName.QiRecover, 2,
    CardName.QiRecover, 1,
    CardName.DryTree, 1,
    CardName.QiRecover, 2,
    CardName.FeiTa, 2,
    CardName.PurpleMana, 2,
  ];
  var bCodeArr = [
    CardName.MindMental, 2,
    CardName.FeiTa, 2,
    CardName.QiRecover, 2,
    CardName.QiRecover, 2,
    CardName.PurpleMana, 2,
    CardName.QiRecover, 1,
    CardName.DryTree, 1,
    CardName.QiRecover, 2,
  ]
  var meCardInfos = CardListFactory.me.SplitCode(FormCode(aCodeArr));
  var heCardInfos = CardListFactory.me.SplitCode("");
  var a = Fight.BuildRun2(meManArg, meCardInfos, heManArg, heCardInfos);
  meCardInfos = CardListFactory.me.SplitCode(FormCode(bCodeArr))
  var b = Fight.BuildRun2(meManArg, meCardInfos, heManArg, heCardInfos, fr => {
    const ret = BestDmgAI.me.cutCheck(fr, a)
    // console.log(ret);
    return ret;
  })
  console.log(a);
  var best = BestDmgAI.me.compare(b, a);
  // console.log(best);
}
