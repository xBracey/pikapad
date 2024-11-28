import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { moveMouse, leftClick, rightClick, keyPress } from './robot';
import { Menu } from 'electron/main';
import { menubar } from 'menubar';

menubar({
    browserWindow: {
        width: 300,
        height: 150,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: false,
        resizable: false
    },
    index: is.dev && process.env['ELECTRON_RENDERER_URL'] ? process.env['ELECTRON_RENDERER_URL'] : undefined,
    icon: './resources/gamepad.png'
});

function createWindow(): void {
    // Create the browser window.
    const backgroundWindow = new BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
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
}

const dockMenu = Menu.buildFromTemplate([
    {
        label: 'Quit',
        click: () => app.quit(),
        accelerator: 'CmdOrCtrl+Q'
    }
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    app.dock.setMenu(dockMenu);

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

    ipcMain.handle('keyPress', (_, key: string) => {
        keyPress(key);
    });

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    app.quit();
});
