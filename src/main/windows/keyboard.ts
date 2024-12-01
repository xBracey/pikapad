import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { mouse } from 'macpad-nut-js';

export const createKeyboardWindow = async (): Promise<BrowserWindow> => {
    const mousePos = await mouse.getPosition();

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
        resizable: false,
        alwaysOnTop: true,
        x: mousePos.x - 250,
        y: mousePos.y + 10
    });

    keyboardWindow.on('ready-to-show', () => {
        keyboardWindow.showInactive();
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
