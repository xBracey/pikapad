import { useCallback, useEffect, useState } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { useAxis } from '../utils/useAxis';
import { getControllerType } from '../keyboard/utils/getControllerType';

function App(): JSX.Element {
    const [controllerType, setControllerType] = useState<string | null>(null);
    const { gamepadPressLoop, buttonsDown } = useGamepadPress({});

    useEffect(() => {
        window.electron.ipcRenderer.invoke('setButtonsDown', buttonsDown);
    }, [buttonsDown]);

    useEffect(() => {
        window.electron.ipcRenderer.invoke('setControllerType', controllerType);
    }, [controllerType]);

    const onGamepadAxis = useAxis(buttonsDown, 0.5);
    const onGamepadAxisRight = useAxis(buttonsDown, 0.5, 'right');

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            const newControllerType = getControllerType(gamepad);

            if (newControllerType !== controllerType) {
                setControllerType(newControllerType);
            }

            gamepadPressLoop(gamepad);
            const { xMove, yMove } = onGamepadAxis(gamepad);
            const { xMove: xMoveRight, yMove: yMoveRight } = onGamepadAxisRight(gamepad);

            if (xMove || yMove) {
                window.electron.ipcRenderer.invoke('moveMouse', xMove, yMove, 0.1);
            }

            if (xMoveRight || yMoveRight) {
                window.electron.ipcRenderer.invoke('scrollMouse', xMoveRight, yMoveRight, 0.03);
            }
        },
        [gamepadPressLoop, buttonsDown]
    );

    useGamepadLoop(gameLoop, 120);

    return <div />;
}

export default App;
