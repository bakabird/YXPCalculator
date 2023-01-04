import { FightReport } from "./FightReport";

export interface IBestAI {
    compare(a: FightReport, b: FightReport): FightReport;
    cutCheck(writingFr: FightReport, best: FightReport): boolean;
}
