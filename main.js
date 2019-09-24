// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1560,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      // preload: path.join(__dirname, 'preload.js')
      preload: path.join(__dirname, './build/renderer.js')
    }
  })
  console.log('jsw', process.argv[2])
  // and load the index.html of the app.
  if (process.argv[2]) {
    // 窗口加载url react调试用
    mainWindow.loadURL('http://localhost:3000/index.html')
    console.log('使用远程url')

    // Open the DevTools.
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    // 正式
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('./build/index.html')
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
