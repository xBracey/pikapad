import { useCallback, useEffect, useRef, useState } from 'react';
import Keyboard, { KeyboardReactInterface } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { useAxis } from '../utils/useAxis';
import { getAllKeys, onAPress, onDPadPress } from './utils/onPress';
import { useActivateKeyboard } from './utils/useActivateKeyboard';
import keyNavigation from 'simple-keyboard-key-navigation';
import { Backspace, CapsLock, Enter, Shift, Space, Tab } from '../components/Icons';
import { XboxButton } from '../components/XboxButton';
import { keysWithNoName } from './utils/keysWithNoName';
import { KeyboardButton } from '../components/KeyboardButton';
import ltButton from '../assets/lt.png';
import rtButton from '../assets/rt.png';

interface Dimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

const DIRECTION_THRESHOLD = 300;

const dimensionsToStyle = (dimensions: Dimensions) =>
    dimensions
        ? {
              top: dimensions.y,
              left: dimensions.x,
              width: dimensions.width,
              height: dimensions.height
          }
        : {};

export const App = (): JSX.Element => {
    const [layout, setLayout] = useState<'default' | 'shift'>('default');
    const keyboardRef = useRef<KeyboardReactInterface | null>(null);
    const lastButtonClicked = useRef<string | null>(null);
    const [noNameKeyDimensions, setNoNameKeyDimensions] = useState<Record<string, Dimensions>>({});
    const xDirectionAmount = useRef(0);
    const yDirectionAmount = useRef(0);

    const onExtraButtonPress = (buttonId: string) => () => {
        const keys = getAllKeys();

        // Set the last button clicked to the currently active key
        const activeKey = keys.findIndex((key) => key.getAttribute('aria-active') === 'true');
        lastButtonClicked.current = keys[activeKey].getAttribute('data-skbtnuid')!.split('-')[1];

        const key = keys.find((key) => key.getAttribute('data-skbtnuid')!.split('-')[1] === buttonId);

        if (!key) return;

        const keyCode = key.getAttribute('data-skbtn');

        key.setAttribute('aria-active', 'true');

        if (keyCode) {
            onKeyPress(keyCode);
        }

        setTimeout(() => {
            key.setAttribute('aria-active', 'false');
        }, 100);
    };

    const { gamepadPressLoop, buttonsDown } = useGamepadPress({
        15: onDPadPress('right'),
        14: onDPadPress('left'),
        13: onDPadPress('down'),
        12: onDPadPress('up'),
        0: onAPress(keyboardRef, (button) => (lastButtonClicked.current = button)),
        1: onExtraButtonPress('r0b13'),
        6: onExtraButtonPress('r2b0'),
        2: onExtraButtonPress('r2b12'),
        7: onExtraButtonPress('r3b11'),
        3: onExtraButtonPress('r4b2')
    });

    const onGamepadAxis = useAxis(buttonsDown, 0.4);

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            gamepadPressLoop(gamepad);

            const { xMove, yMove } = onGamepadAxis(gamepad);

            if (!xMove && !yMove) {
                xDirectionAmount.current = 0;
                yDirectionAmount.current = 0;
            }

            xDirectionAmount.current += xMove;
            yDirectionAmount.current += yMove;

            if (xDirectionAmount.current > DIRECTION_THRESHOLD) {
                onDPadPress('right')();
                xDirectionAmount.current = 0;
            } else if (xDirectionAmount.current < -DIRECTION_THRESHOLD) {
                onDPadPress('left')();
                xDirectionAmount.current = 0;
            } else if (yDirectionAmount.current > DIRECTION_THRESHOLD) {
                onDPadPress('down')();
                yDirectionAmount.current = 0;
            } else if (yDirectionAmount.current < -DIRECTION_THRESHOLD) {
                onDPadPress('up')();
                yDirectionAmount.current = 0;
            }
        },
        [gamepadPressLoop, buttonsDown]
    );

    useGamepadLoop(gameLoop);
    useActivateKeyboard(setNoNameKeyDimensions);

    const onKeyPress = (button: string) => {
        if (button === '{shift}' || button === '{lock}') {
            setLayout(layout === 'default' ? 'shift' : 'default');
        } else {
            window.electron.ipcRenderer.invoke('keyPress', button, true);
        }
    };

    useEffect(() => {
        const keys = getAllKeys();
        keys.forEach((key) => {
            const keySuffix = key.getAttribute('data-skbtnuid')!.split('-')[1];
            if (keySuffix === lastButtonClicked.current) {
                key.setAttribute('aria-active', 'true');
            }

            if (keysWithNoName.includes(keySuffix)) {
                key.classList.add('no-name');
            }
        });
    }, [layout]);

    return (
        <div className="relative overflow-hidden">
            <Keyboard
                onKeyPress={onKeyPress}
                keyboardRef={(r) => (keyboardRef.current = r)}
                layoutName={layout}
                modules={[keyNavigation]}
            />
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r0b13'])}>
                <Backspace className="w-6 h-6" />
                <XboxButton letter="B" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r1b0'])}>
                <Tab className="w-4 h-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r2b0'])}>
                <CapsLock className="w-4 h-4" />
                <img src={ltButton} alt="LT" className="w-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r2b12'])}>
                <Enter className="w-4 h-4" />
                <XboxButton letter="X" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r3b0'])}>
                <Shift className="w-4 h-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r3b11'])}>
                <Shift className="w-4 h-4" />
                <img src={rtButton} alt="RT" className="w-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r4b2'])}>
                <Space className="w-4 h-4" />
                <XboxButton letter="Y" />
            </KeyboardButton>
        </div>
    );
};

export default App;
