import { useCallback, useState } from 'react';
import { useGamepadLoop } from '../utils/useGamepadLoop';

function App(): JSX.Element {
    const [buttonsDown, setButtonsDown] = useState<number[]>([]);

    const gameLoop = useCallback((gamepad: Gamepad) => {
        const buttonsDownLocal: number[] = [];

        Object.entries(gamepad.buttons).forEach(([key, button]) => {
            if (button.pressed) {
                buttonsDownLocal.push(parseInt(key));
            }
        });
        setButtonsDown(buttonsDownLocal);
    }, []);

    useGamepadLoop(gameLoop);

    return <div>Buttons down: {buttonsDown.join(', ')}</div>;
}

export default App;
