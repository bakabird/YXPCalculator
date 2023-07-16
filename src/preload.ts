import { SearchFilter } from "./CardSearcher";

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  searchCard: (key: string, filter: SearchFilter) => {
    return ipcRenderer.invoke('Miri.SearchCard', key, filter)
  },
  getAllCards: () => {
    return ipcRenderer.invoke('Main.GetAllCards')
  },
  getCfg: () => {
    return ipcRenderer.invoke('Main.GetCfg');
  },
  feedback: (item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer) => {
    return ipcRenderer.invoke('Main.Feedback', item, content, fileName, fileBuffer)
  },
  createReport: (key: string, role: number, eKey: string, eRole: number, threadNum: number) => {
    ipcRenderer.send("Main.Report", key, role, eKey, eRole, threadNum);
  },
  viewReport: (fightReport: any) => {
    ipcRenderer.send("Main.ViewReport", fightReport)
  },
  doDebug: () => {
    ipcRenderer.send("Main.Debug");
  },
  onProcessOver: (callback) => {
    ipcRenderer.on("Miri.ProcessOver", callback);
  },
})

window.addEventListener('DOMContentLoaded', () => {

})
