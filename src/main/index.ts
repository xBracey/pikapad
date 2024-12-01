import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { moveMouse, leftClick, rightClick, keyPress, swipeScreen, scrollMouse } from './robot';
import { Store } from './storage';
import { createBackgroundWindow } from './windows/background';
import { createKeyboardWindow } from './windows/keyboard';
import { createLogWindow } from './windows/log';
import gamepad from '../../resources/IconTemplate.png?asset';

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

    const openKeyboard = async () => {
        const keyboardOpen = getKeyboardOpen();

        if (keyboardOpen) {
            keyboardWindow?.close();
            keyboardWindow = null;
        } else {
            if (!keyboardWindow) {
                keyboardWindow = await createKeyboardWindow();
            } else {
                keyboardWindow.show();
            }
        }

        Store.set('keyboardOpen', !keyboardOpen);
    };

    ipcMain.handle('openKeyboard', openKeyboard);

    const openLog = () => {
        if (!logWindow) {
            logWindow = createLogWindow();
        } else {
            logWindow.show();
        }
    };

    ipcMain.handle('openLog', openLog);

    ipcMain.handle('swipeScreen', (_, direction: 'left' | 'right') => {
        swipeScreen(direction);
    });

    ipcMain.handle('log', (_, message: string) => {
        console.log(message);
    });

    ipcMain.handle('closeApp', () => {
        app.quit();
    });

    ipcMain.handle('scrollMouse', (_, x: number, y: number, speed: number = 1) => {
        scrollMouse(x, y, speed);
    });

    createBackgroundWindow();

    const tray = new Tray(gamepad);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Toggle On', click: () => Store.set('toggle', true) },
        { label: 'Toggle Off', click: () => Store.set('toggle', false) },
        { label: 'Open Keyboard', click: openKeyboard },
        { label: 'Close App', click: () => app.quit() },
        { label: 'Open Logger', click: openLog }
    ]);
    tray.setContextMenu(contextMenu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit();
});
