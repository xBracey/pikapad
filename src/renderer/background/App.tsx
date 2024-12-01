import { useCallback } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { useAxis } from '../utils/useAxis';

function App(): JSX.Element {
    const leftClick = () => {
        window.electron.ipcRenderer.invoke('leftClick');
    };

    const rightClick = () => {
        window.electron.ipcRenderer.invoke('rightClick');
    };

    const keyboardOpen = () => {
        window.electron.ipcRenderer.invoke('openKeyboard');
    };

    const swipeScreen = (direction: 'left' | 'right') => () => {
        console.log('swipeScreen', direction);
        window.electron.ipcRenderer.invoke('swipeScreen', direction);
    };

    const { gamepadPressLoop, buttonsDown } = useGamepadPress({
        2: rightClick,
        4: swipeScreen('left'),
        5: swipeScreen('right'),
        9: keyboardOpen,
        0: leftClick
    });

    const onGamepadAxis = useAxis(buttonsDown);
    const onGamepadAxisRight = useAxis(buttonsDown, 0.3, 'right');

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            gamepadPressLoop(gamepad);
            const { xMove, yMove } = onGamepadAxis(gamepad);
            const { xMove: xMoveRight, yMove: yMoveRight } = onGamepadAxisRight(gamepad);

            if (xMove || yMove) {
                window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 0.25);
            }

            if (xMoveRight || yMoveRight) {
                window.electron.ipcRenderer.invoke('scrollMouse', xMoveRight, yMoveRight, 0.25);
            }
        },
        [gamepadPressLoop, buttonsDown]
    );

    useGamepadLoop(gameLoop, 120);

    return <div />;
}

export default App;
