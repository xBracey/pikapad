import { BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';

export const createSettingsWindow = (): BrowserWindow => {
    // Create the browser window.
    const settingsWindow = new BrowserWindow({
        width: 500,
        height: 490,
        show: false,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: true,
        title: 'Settings',
        titleBarStyle: 'default',
        resizable: false
    });

    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings.html`);
    } else {
        settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'));
    }

    return settingsWindow;
};
