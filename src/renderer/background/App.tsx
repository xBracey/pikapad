import { useCallback } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { useAxis } from '../utils/useAxis';

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

    const { gamepadPressLoop, buttonsDown } = useGamepadPress({
        4: swipeScreen('left'),
        5: swipeScreen('right'),
        17: keyboardOpen,
        0: leftClick
    });

    const onGamepadAxis = useAxis(buttonsDown);

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            gamepadPressLoop(gamepad);
            const { xMove, yMove } = onGamepadAxis(gamepad);

            gamepad.mapping;

            if (!xMove && !yMove) return;

            window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 0.25);
        },
        [gamepadPressLoop, buttonsDown]
    );

    useGamepadLoop(gameLoop, 120);

    return <div />;
}

export default App;
