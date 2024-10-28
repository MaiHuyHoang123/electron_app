import "reflect-metadata"
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DataSource } from "typeorm"
import User from "../entity/User"
import {getNumPosts, previewPost, getPosts, getListPost, deletePost, uploadPost} from "../service/PostService"
import Post from "../entity/Post"


const AppDataSource = new DataSource({
    type: "sqlite",
    database: "myDB.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, Post]
})

let databaseConnection

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    fullscreenable: true,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.maximize();

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.webContents.openDevTools()
  mainWindow.on('close', () => {
    closeDatabaseConnection();
  });
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  
  connectToDatabase()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


function connectToDatabase() {
  databaseConnection = AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
}

function closeDatabaseConnection() {
  if (databaseConnection) {
    AppDataSource.destroy()
      .then(() => {
        console.log("Data Source has been closed!")
      })
      .catch((err) => {
          console.error("Error during close Data Source", err)
      })
  }
}


ipcMain.handle('addUser', async (_, data) => {
  try{
    let user = new User()
    user.name = data.name
    user.email = data.email
    user.password = data.password
    await user.save()
    return true
  }catch(e){
    console.log("error: " + e);
    return false
  }
})

ipcMain.handle("getAllUser", async (_) => {
  try{
    const allUsers = await User.find()
    return allUsers
  }catch(e){
    console.log("error: " + e);
    return []
  }
})

ipcMain.handle("updateUser", async (_, args) => {
  try{
    const user = await User.findOneBy({ id: args.id })
    user.name = args.name
    user.email = args.email
    user.password = args.password
    await user.save()
    return true
  }catch(e){
    console.log("error: " + e);
    return false
  }
})

ipcMain.handle("deleteUser", async (_, id) => {
  try{
    const user = await User.findOneBy({ id })
    await user.remove()
    return true
  }catch(e){
    console.log("error: " + e);
    return false
  }
})

ipcMain.handle("crawlPosts", getNumPosts)
ipcMain.handle("crawlPost", getPosts)
ipcMain.handle("previewPost", previewPost)
ipcMain.handle("getListPost", getListPost)
ipcMain.handle("deletePost", deletePost)
ipcMain.handle("uploadPost", uploadPost)