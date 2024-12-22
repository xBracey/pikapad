import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { Store } from './storage';
import { createBackgroundWindow } from './windows/background';
import { createKeyboardWindow } from './windows/keyboard';
import gamepad from '../../resources/IconTemplate.png?asset';
import { Background, setDisableKeysWithValue } from './background';
import { keyPress, moveMouse, scrollMouse } from './robot';
import { createSettingsWindow } from './windows/settings';
import { getButtonMap, setButton } from './background/buttonMap';
import { setScrollSpeed } from './background/speeds';
import { getScrollSpeed } from './background/speeds';
import { setMouseSpeed } from './background/speeds';
import { ButtonActions } from './background/types';
import { getMouseSpeed } from './background/speeds';

const getKeyboardOpen = () => Store.get('keyboardOpen') ?? false;

let keyboardWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let background: Background | null = null;
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

    const openSettings = () => {
        settingsWindow?.destroy();
        settingsWindow = null;

        settingsWindow = createSettingsWindow();
    };

    background = new Background(openKeyboard);

    ipcMain.handle('moveMouse', (_, x: number, y: number, speed: number) => {
        moveMouse(x, y, speed);
    });

    ipcMain.handle('scrollMouse', (_, x: number, y: number, speed: number) => {
        scrollMouse(x, y, speed);
    });

    ipcMain.handle('openKeyboard', openKeyboard);

    ipcMain.handle('log', (_, message: string) => {
        console.log(message);
    });

    ipcMain.handle('keyPress', (_, key: string, fromKeyboard: boolean = false) => {
        keyPress(key, fromKeyboard);
    });

    ipcMain.handle('closeApp', () => {
        app.quit();
    });

    ipcMain.handle('getToggle', () => {
        return Store.get('toggle');
    });

    ipcMain.handle('setToggle', (_, toggle: boolean) => {
        Store.set('toggle', toggle);
    });

    ipcMain.handle('setButtonsDown', (_, buttonsDown: number[]) => {
        background!.setButtonsDown(buttonsDown);
    });

    ipcMain.handle('getControllerType', () => {
        return Store.get('controllerType') ?? 'xbox';
    });

    ipcMain.handle('setControllerType', (_, controllerType: string) => {
        Store.set('controllerType', controllerType);
    });

    ipcMain.handle('getButtonMap', () => {
        return getButtonMap();
    });

    ipcMain.handle('setButton', (_, button: number[], action: ButtonActions) => {
        setButton(button, action);
    });

    ipcMain.handle('getMouseSpeed', () => {
        return getMouseSpeed();
    });

    ipcMain.handle('setMouseSpeed', (_, mouseSpeed: number) => {
        setMouseSpeed(mouseSpeed);
    });

    ipcMain.handle('getScrollSpeed', () => {
        return getScrollSpeed();
    });

    ipcMain.handle('setScrollSpeed', (_, scrollSpeed: number) => {
        setScrollSpeed(scrollSpeed);
    });

    ipcMain.handle('setDisableKeys', (_, value: boolean) => {
        setDisableKeysWithValue(value);
    });

    createBackgroundWindow();

    const tray = new Tray(gamepad);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Settings', click: openSettings },
        { label: 'Close App', click: () => app.quit() }
    ]);
    tray.setContextMenu(contextMenu);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit();
});
