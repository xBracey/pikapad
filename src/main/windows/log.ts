import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';

export const createLogWindow = (): BrowserWindow => {
    // Create the browser window.
    const logWindow = new BrowserWindow({
        width: 200,
        height: 100,
        show: false,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: true
    });

    logWindow.on('ready-to-show', () => {
        logWindow.show();
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        logWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/logger.html`);
    } else {
        logWindow.loadFile(join(__dirname, '../renderer/logger.html'));
    }

    return logWindow;
};
