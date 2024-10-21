import "reflect-metadata"
import { contextBridge  } from 'electron'
import { electronAPI } from "@electron-toolkit/preload";


console.log('Preload script loaded successfully');

// Custom APIs for renderer
const user_api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('user_api', user_api)
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.user_api = user_api
}
