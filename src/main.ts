// Modules to control application life and create native browser window
import log from 'electron-log/main';
// Optional, initialize the logger for any renderer process
log.transports.file.resolvePathFn = () => path.join(__dirname, '../tmp/app.log');
log.initialize({ preload: true, spyRendererConsole: true });
console.log = log.log;
console.warn = log.warn;
console.info = log.info;
console.error = log.error;
console.debug = log.debug;
const {
  Worker, isMainThread, parentPort, workerData
} = require('node:worker_threads');
const { app, Menu, BrowserWindow, ipcMain } = require('electron')
import AliKit from "./AliKit";
import { CardListFactory, CardRecord } from "./CardListFactory";
import CardSearcher, { SearchFilter } from "./CardSearcher";
import { Debug } from "./Debug";
import { FightReport } from "./FightReport";
import { Sumamry } from "./Sumamry";
import WorkerMsg from "./WorkerMsg";
import path from 'path'
import { IHumanData, IRenderWorkerData, Role } from "./_share_code_";
const isMac = process.platform === 'darwin'

// // 返回运行文件所在的目录
// console.log('__dirname : ' + __dirname)
// // __dirname : /Desktop
// // 当前命令所在的目录
// console.log('resolve   : ' + path.resolve('./'))
// // resolve   : /workspace
// // 当前命令所在的目录
// console.log('cwd       : ' + process.cwd())
// // cwd       : /workspace


const icon = path.join(__dirname, '../Icon.png')

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      { role: 'toggleDevTools' },
      { role: 'reload' },
      { role: 'forceReload' },
      isMac ? { role: 'close' } : { role: 'quit' },
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 920,
    height: 920,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function CreateReport(_, me: IHumanData, he: IHumanData, threadNum: number) {
  console.log("CreateReport", me, he, threadNum);
  // Create the browser window.
  const reportWindow = new BrowserWindow({
    width: 800,
    height: 900,
    icon,
    webPreferences: {
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  const workerData: IRenderWorkerData = {
    me,
    he,
    threadNum,
  }
  const reportWorker = new Worker(path.join(__dirname, './ReportWorker.js'), { workerData });
  reportWorker.on('message', (workerMsg: WorkerMsg) => {
    switch (workerMsg.type) {
      case "process-over":
        console.log("process-over", workerMsg.data);
        reportWindow.webContents.send('Miri.ProcessOver', workerMsg.data);
        break;
    }
  });
  reportWorker.on('error', (err) => {
    console.error(err);
  });
  reportWorker.on('exit', (code) => {
    console.log(`Worker stopped with exit code ${code}`);
    if (code !== 0)
      new Error(`Worker stopped with exit code ${code}`)
  });

  // and load the index.html of the app.
  reportWindow.loadFile('report.html')
  // reportWindow.removeMenu();

  // Open the DevTools.
  // reportWindow.webContents.openDevTools()
}

function Relaunch() {
  app.relaunch();
  app.exit();
}

function ViewReport(_, fightReport: FightReport) {
  // Create the browser window.
  const reportWindow = new BrowserWindow({
    width: 800,
    height: 900,
    icon,
    webPreferences: {
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  const patchySumary = new Sumamry();
  patchySumary.cur = fightReport;
  // and load the index.html of the app.
  reportWindow.loadFile('report.html')
  setTimeout(() => {
    reportWindow.webContents.send('Miri.ProcessOver', patchySumary);
  }, 700)
  // reportWindow.removeMenu();
  // Open the DevTools.
  // reportWindow.webContents.openDevTools()
}

function GetAllCards(): Array<string> {
  let list: Array<string> = [];
  CardListFactory.me.EachRecord((record: CardRecord) => {
    list.push(record.name)
  });
  return list;
}

function Feedback(_, item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer) {
  return new Promise<void>((rso, rje) => {
    AliKit.me.post({
      item,
      content,
      attachment: !fileName ? null : {
        fileExt: path.extname(fileName),
        fileBuffer,
      }
    }).then(() => {
      rso()
    }).catch((err) => {
      rje(err)
    })
  })
}

function GetCfg(_event) {
  return new Promise<any>((rso, rje) => {
    AliKit.me.get({
      filename: "Cfg.json"
    }).then((content) => {
      rso(JSON.parse(content));
    }).catch(err => {
      rje(err);
    });
  })
}

function SearchCard(_event, inKey: string, filter: SearchFilter): Array<string> {
  return CardSearcher.me.Search(inKey, filter);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("Miri.SearchCard", SearchCard)
  ipcMain.handle("Main.GetAllCards", GetAllCards)
  ipcMain.handle("Main.Feedback", Feedback)
  ipcMain.handle("Main.GetCfg", GetCfg)
  ipcMain.on("Main.Relaunch", Relaunch)
  ipcMain.on("Main.Report", CreateReport)
  ipcMain.on("Main.ViewReport", ViewReport)
  ipcMain.on("Main.Debug", Debug)
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
