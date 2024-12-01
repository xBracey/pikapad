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

    const pressButton = (key: string) => () => {
        window.electron.ipcRenderer.invoke('keyPress', key);
    };

    const { gamepadPressLoop, buttonsDown } = useGamepadPress({
        1: pressButton('{escape}'),
        2: rightClick,
        4: swipeScreen('left'),
        5: swipeScreen('right'),
        9: keyboardOpen,
        0: leftClick
    });

    const onGamepadAxis = useAxis(buttonsDown, 0.5);
    const onGamepadAxisRight = useAxis(buttonsDown, 0.5, 'right');

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            gamepadPressLoop(gamepad);
            const { xMove, yMove } = onGamepadAxis(gamepad);
            const { xMove: xMoveRight, yMove: yMoveRight } = onGamepadAxisRight(gamepad);

            if (xMove || yMove) {
                window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 0.1);
            }

            if (xMoveRight || yMoveRight) {
                window.electron.ipcRenderer.invoke('scrollMouse', xMoveRight, yMoveRight, 0.1);
            }
        },
        [gamepadPressLoop, buttonsDown]
    );

    useGamepadLoop(gameLoop, 120);

    return <div />;
}

export default App;
