import { useCallback, useEffect, useState } from 'react';

function App(): JSX.Element {
    const [connectedGamepad, setConnectedGamepad] = useState<Gamepad | null>(null);

    useEffect(() => {
        const gamepadEvent = (e: GamepadEvent) => {
            setConnectedGamepad(e.gamepad);
        };

        window.addEventListener('gamepadconnected', gamepadEvent);

        return () => {
            window.removeEventListener('gamepadconnected', gamepadEvent);
        };
    }, []);

    const gameLoop = useCallback(() => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) return;

        const gamepad = gamepads.find((g) => g?.index === connectedGamepad?.index);
        if (!gamepad) return;

        if (gamepad.buttons[0].pressed) {
            console.log(window.electron.ipcRenderer);
            window.electron.ipcRenderer.invoke('leftClick');
        }

        const xMove = Math.abs(gamepad.axes[0]) > 0.1 ? gamepad.axes[0] : 0;
        const yMove = Math.abs(gamepad.axes[1]) > 0.1 ? gamepad.axes[1] : 0;

        console.log(gamepad.axes, xMove, yMove);

        window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 20);

        Object.entries(gamepad.buttons).forEach(([key, button]) => {
            if (button.pressed) {
                console.log(`Button ${key} pressed`);
            }
        });
    }, [connectedGamepad]);

    useEffect(() => {
        const interval = setInterval(gameLoop, 1000 / 60);
        return () => clearInterval(interval);
    }, [gameLoop]);

    return <div>Hello World</div>;
}

export default App;
