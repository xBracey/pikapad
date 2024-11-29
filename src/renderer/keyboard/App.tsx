import { useCallback, useEffect, useRef, useState } from 'react';
import Keyboard, { KeyboardReactInterface } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { keyboardDownMap, keyboardUpMap } from './utils/keyboardUpMap';

export const App = (): JSX.Element => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const keyboardRef = useRef<KeyboardReactInterface | null>(null);

    const getAllKeys = useCallback(() => {
        return Array.from(document.querySelectorAll('.hg-button'));
    }, []);

    useEffect(() => {
        const interval = hasLoaded
            ? null
            : setInterval(() => {
                  const keys = getAllKeys();
                  setHasLoaded(keys.length > 0);
              }, 100);

        if (hasLoaded) {
            const keys = getAllKeys();
            const activeKey = keys.findIndex((key) => key.getAttribute('aria-active') === 'true');

            if (activeKey === -1) {
                const qKey = document.querySelector('[data-skbtn="q"]');
                qKey?.setAttribute('aria-active', 'true');
            }
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [hasLoaded]);

    const onDPadPress = (direction: 'up' | 'down' | 'left' | 'right') => () => {
        const keysArray = getAllKeys();
        const activeKey = keysArray.findIndex((key) => key.getAttribute('aria-active') === 'true');

        if (activeKey !== -1) {
            keysArray[activeKey].removeAttribute('aria-active');
        }

        const setVerticalActive = (direction: 'up' | 'down') => {
            const currentKey = keysArray[activeKey].getAttribute('data-skbtn')!;
            const currentId = keysArray[activeKey].getAttribute('data-skbtnuid')!;
            const key = currentKey === '{shift}' ? `${currentKey}#${currentId}` : currentKey;
            const nextKey = direction === 'up' ? keyboardUpMap[key] : keyboardDownMap[key];

            keysArray
                .find((key) => {
                    const button = key.getAttribute('data-skbtn');
                    const id = key.getAttribute('data-skbtnuid');

                    return button === '{shift}' ? `${button}#${id}` === nextKey : button === nextKey;
                })
                ?.setAttribute('aria-active', 'true');
        };

        switch (direction) {
            case 'up':
                setVerticalActive('up');
                break;
            case 'down':
                setVerticalActive('down');
                break;
            case 'left':
                keysArray[activeKey === 0 ? keysArray.length - 1 : activeKey - 1].setAttribute('aria-active', 'true');
                break;
            case 'right':
                keysArray[activeKey === keysArray.length - 1 ? 0 : activeKey + 1].setAttribute('aria-active', 'true');
                break;
        }
    };

    const onAPress = () => {
        const keys = getAllKeys();
        const keysArray = Array.from(keys);
        const activeKey = keysArray.findIndex((key) => key.getAttribute('aria-active') === 'true');

        keyboardRef.current?.handleButtonClicked(keysArray[activeKey].getAttribute('data-skbtn')!);
    };

    const { gamepadPressLoop } = useGamepadPress({
        15: onDPadPress('right'),
        14: onDPadPress('left'),
        13: onDPadPress('down'),
        12: onDPadPress('up'),
        0: onAPress
    });

    const gameLoop = useCallback((gamepad: Gamepad) => {
        gamepadPressLoop(gamepad);
    }, []);

    useGamepadLoop(gameLoop);

    const onKeyPress = (button: string) => {
        window.electron.ipcRenderer.invoke('keyPress', button, true);
    };

    return <Keyboard onKeyPress={onKeyPress} keyboardRef={(r) => (keyboardRef.current = r)} />;
};

export default App;
