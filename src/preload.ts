/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  searchCard: (key: string) => {
    return ipcRenderer.invoke('Miri.SearchCard', key)
  },
  createReport: (key: string, eKey: string, threadNum: number) => {
    ipcRenderer.send("Main.Report", key, eKey, threadNum);
  },
  onProcessOver: (callback) => {
    ipcRenderer.on("Miri.ProcessOver", callback);
  },
  doDebug: () => {
    ipcRenderer.send("Main.Debug");
  }
})

window.addEventListener('DOMContentLoaded', () => {
  
})
  