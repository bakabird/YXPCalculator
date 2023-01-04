import CardSearcher from "./CardSearcher";
import WorkerMsg from "./WorkerMsg";

// Modules to control application life and create native browser window
const {
  Worker, isMainThread, parentPort, workerData
} = require('node:worker_threads');
const {app, Menu, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isMac = process.platform === 'darwin'

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

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function CreateReport (_, key:string, threadNum: number) {
  // Create the browser window.
  const reportWindow = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  const reportWorker = new Worker("./ReportWorker.js", {
    workerData: {
      cardKey: key,
      threadNum,
    }
  });
  reportWorker.on('message', (workerMsg: WorkerMsg)=>{
    switch(workerMsg.type) {
      case "process-over":
        reportWindow.webContents.send('Miri.ProcessOver', workerMsg.data);
        break;
    }
  });
  reportWorker.on('error', (err)=>{
    console.error(err);
  });
  reportWorker.on('exit', (code) => {
    if (code !== 0)
      new Error(`Worker stopped with exit code ${code}`)
  });


  // and load the index.html of the app.
  reportWindow.loadFile('report.html')
  // reportWindow.removeMenu();

  // Open the DevTools.
  // reportWindow.webContents.openDevTools()
}


function SearchCard(_event, inKey: string): Array<string> {
  return CardSearcher.me.Search(inKey);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("Miri.SearchCard", SearchCard)
  ipcMain.on("Main.Report", CreateReport)
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
