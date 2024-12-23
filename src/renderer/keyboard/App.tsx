import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Keyboard, { KeyboardReactInterface } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';
import { useAxis } from '../utils/useAxis';
import { getAllKeys, onAPress, onDPadPress } from './utils/onPress';
import { useActivateKeyboard } from './utils/useActivateKeyboard';
import { ArrowLeft, ArrowRight, Backspace, CapsLock, Enter, Shift, Space, Tab } from './components/Icons';
import { XboxButton } from './components/XboxButton';
import { keysWithNoName } from './utils/keysWithNoName';
import { KeyboardButton } from './components/KeyboardButton';
import ltButton from '../public/lt.png';
import rtButton from '../public/rt.png';
import lbButton from '../public/lb.png';
import rbButton from '../public/rb.png';
import fullLayout from './utils/layout';
import { ButtonMap } from '../shared/buttons';
import { Buttons } from '../shared/buttons/types';

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
    const [controllerType, setControllerType] = useState<'xbox' | 'playstation'>('xbox');

    useEffect(() => {
        window.electron.ipcRenderer.invoke('getControllerType').then(setControllerType);
    }, []);

    const buttonMapConfig = useMemo(() => ButtonMap[controllerType], [controllerType]);

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
        1: onExtraButtonPress('r2b12'),
        2: onExtraButtonPress('r0b13'),
        6: onExtraButtonPress('r2b0'),
        7: onExtraButtonPress('r3b11'),
        3: onExtraButtonPress('r4b2'),
        4: onExtraButtonPress('r4b3'),
        5: onExtraButtonPress('r4b4')
    });

    const onGamepadAxis = useAxis(buttonsDown, 0.4);

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            const keys = getAllKeys();
            if (!keyboardRef.current || keys.length === 0) return;

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
        [gamepadPressLoop, buttonsDown, keyboardRef]
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
            <Keyboard onKeyPress={onKeyPress} keyboardRef={(r) => (keyboardRef.current = r)} layoutName={layout} layout={fullLayout} />
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r0b13'])}>
                <Backspace className="w-6 h-6" />
                <img src={buttonMapConfig[Buttons.RIGHT_LEFT]} alt="B" className="w-8 -mx-2" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r1b0'])}>
                <Tab className="w-4 h-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r2b0'])}>
                <CapsLock className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.LEFT_TRIGGER]} alt="LT" className="w-8 -mx-2" style={{ filter: 'invert(1)' }} />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r2b12'])}>
                <Enter className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.RIGHT_RIGHT]} alt="B" className="w-8 -mx-2" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r3b0'])}>
                <Shift className="w-4 h-4" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r3b11'])}>
                <Shift className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.RIGHT_TRIGGER]} alt="RT" className="w-8 -mx-2" style={{ filter: 'invert(1)' }} />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r4b2'])}>
                <Space className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.RIGHT_UP]} alt="Y" className="w-8 -mx-2" />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r4b3'])}>
                <ArrowLeft className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.LEFT_BUMPER]} alt="LB" className="w-8 -mx-2" style={{ filter: 'invert(1)' }} />
            </KeyboardButton>
            <KeyboardButton style={dimensionsToStyle(noNameKeyDimensions['r4b4'])}>
                <ArrowRight className="w-4 h-4" />
                <img src={buttonMapConfig[Buttons.RIGHT_BUMPER]} alt="RB" className="w-8 -mx-2" style={{ filter: 'invert(1)' }} />
            </KeyboardButton>
        </div>
    );
};

export default App;
