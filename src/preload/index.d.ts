import { ElectronAPI } from '@electron-toolkit/preload'
type UserAPI = {
  addUser: (name: string, email: string, password: string) => boolean,
  getAllUser: () => Array
}
declare global {
  interface Window {
    electron: ElectronAPI
    user_api: UserAPI
  }
}
