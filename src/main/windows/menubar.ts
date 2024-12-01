import { is } from '@electron-toolkit/utils';
import { menubar } from 'menubar';
import { join } from 'path';
import gamepad from '../../../resources/gamepad.png?asset';

menubar({
    browserWindow: {
        width: 300,
        height: 150,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        frame: false,
        resizable: false
    },
    index:
        is.dev && process.env['ELECTRON_RENDERER_URL']
            ? `${process.env['ELECTRON_RENDERER_URL']}/menubar.html`
            : `file://${join(__dirname, '../renderer/menubar.html')}`,
    icon: gamepad
});
