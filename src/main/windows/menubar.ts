import { is } from '@electron-toolkit/utils';
import { menubar } from 'menubar';
import { join } from 'path';

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
            : join(__dirname, '../renderer/menubar.html'),
    icon: './resources/gamepad.png'
});
