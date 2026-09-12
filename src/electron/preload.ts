import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  readConfig: (devicePath: string) => ipcRenderer.invoke('read-config', devicePath),
  writeConfig: (devicePath: string, configPath: string) => ipcRenderer.invoke('write-config', devicePath, configPath),
  exportToJson: (configPath: string) => ipcRenderer.invoke('export-json', configPath),
  importFromJson: (jsonPath: string) => ipcRenderer.invoke('import-json', jsonPath),
});
