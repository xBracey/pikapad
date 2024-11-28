import { useCallback } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';

function App(): JSX.Element {
    const gameLoop = useCallback((gamepad: Gamepad) => {
        if (gamepad.buttons[0].pressed) {
            console.log(window.electron.ipcRenderer);
            window.electron.ipcRenderer.invoke('leftClick');
        }

        const xMove = Math.abs(gamepad.axes[0]) > 0.1 ? gamepad.axes[0] : 0;
        const yMove = Math.abs(gamepad.axes[1]) > 0.1 ? gamepad.axes[1] : 0;

        console.log(gamepad.axes, xMove, yMove);

        window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 20);

        // Object.entries(gamepad.buttons).forEach(([key, button]) => {
        //     if (button.pressed) {
        //         console.log(`Button ${key} pressed`);
        //     }
        // });
    }, []);

    useGamepadLoop(gameLoop);

    return <div />;
}

export default App;
