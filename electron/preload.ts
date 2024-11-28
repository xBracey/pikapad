import { ipcRenderer, contextBridge } from 'electron';

const getToken = () => ipcRenderer.invoke('getToken');

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
    getToken,
});
