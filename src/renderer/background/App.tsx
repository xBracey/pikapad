import { useCallback } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';

const calculateMove = (axis: number) => {
    if (Math.abs(axis) < 0.1) return 0;

    const isNegative = axis < 0;
    const move = Math.pow(axis * 10, 2);

    return isNegative ? -move : move;
};

function App(): JSX.Element {
    const leftClick = () => {
        window.electron.ipcRenderer.invoke('leftClick');
    };

    const keyboardOpen = () => {
        window.electron.ipcRenderer.invoke('openKeyboard');
    };

    const swipeScreen = (direction: 'left' | 'right') => () => {
        console.log('swipeScreen', direction);
        window.electron.ipcRenderer.invoke('swipeScreen', direction);
    };

    const { gamepadPressLoop } = useGamepadPress({
        4: swipeScreen('left'),
        5: swipeScreen('right'),
        17: keyboardOpen,
        0: leftClick
    });

    const gameLoop = useCallback((gamepad: Gamepad) => {
        gamepadPressLoop(gamepad);

        const xMove = calculateMove(gamepad.axes[0]);
        const yMove = calculateMove(gamepad.axes[1]);

        if (!xMove && !yMove) return;

        window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 0.25);
    }, []);

    useGamepadLoop(gameLoop, 120);

    return <div />;
}

export default App;
