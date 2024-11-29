import { app, BrowserWindow, ipcMain } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { moveMouse, leftClick, rightClick, keyPress, swipeScreen } from './robot';
import { Store } from './storage';
import { createBackgroundWindow } from './windows/background';
import './windows/menubar';
import { createKeyboardWindow } from './windows/keyboard';
import { createLogWindow } from './windows/log';

const getKeyboardOpen = () => Store.get('keyboardOpen') ?? false;

let keyboardWindow: BrowserWindow | null = null;
let logWindow: BrowserWindow | null = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    ipcMain.handle('moveMouse', (_, x: number, y: number, speed: number) => {
        moveMouse(x, y, speed);
    });

    ipcMain.handle('leftClick', () => {
        leftClick();
    });

    ipcMain.handle('rightClick', () => {
        rightClick();
    });

    ipcMain.handle('keyPress', (_, key: string, fromKeyboard: boolean = false) => {
        keyPress(key, fromKeyboard);
    });

    ipcMain.handle('getToggle', () => {
        return Store.get('toggle');
    });

    ipcMain.handle('setToggle', (_, toggle: boolean) => {
        Store.set('toggle', toggle);
    });

    ipcMain.handle('openKeyboard', () => {
        const keyboardOpen = getKeyboardOpen();

        if (keyboardOpen) {
            keyboardWindow?.close();
            keyboardWindow = null;
        } else {
            if (!keyboardWindow) {
                keyboardWindow = createKeyboardWindow();
            } else {
                keyboardWindow.show();
            }
        }

        Store.set('keyboardOpen', !keyboardOpen);
    });

    ipcMain.handle('openLog', () => {
        if (!logWindow) {
            logWindow = createLogWindow();
        } else {
            logWindow.show();
        }
    });

    ipcMain.handle('swipeScreen', (_, direction: 'left' | 'right') => {
        swipeScreen(direction);
    });

    createBackgroundWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createBackgroundWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit();
});
