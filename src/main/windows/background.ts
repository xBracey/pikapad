import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';

export const createBackgroundWindow = (): void => {
    // Create the browser window.
    const backgroundWindow = new BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: false,
        resizable: false
    });

    backgroundWindow.on('ready-to-show', () => {
        backgroundWindow.show();
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        backgroundWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/background.html`);
    } else {
        backgroundWindow.loadFile(join(__dirname, '../renderer/background.html'));
    }
};
