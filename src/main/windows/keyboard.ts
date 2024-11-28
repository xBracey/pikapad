import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';

export const createKeyboardWindow = (): BrowserWindow => {
    // Create the browser window.
    const keyboardWindow = new BrowserWindow({
        width: 500,
        height: 230,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: false,
        resizable: false
    });

    keyboardWindow.on('ready-to-show', () => {
        keyboardWindow.show();
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        keyboardWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/keyboard.html`);
    } else {
        keyboardWindow.loadFile(join(__dirname, '../renderer/keyboard.html'));
    }

    return keyboardWindow;
};
