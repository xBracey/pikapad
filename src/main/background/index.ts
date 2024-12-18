import { getKeyboardOpen, keyPress, leftClick, rightClick, swipeScreen } from '../robot';
import { Store } from '../storage';
import { getButtonMap } from './buttonMap';
import { ButtonActions } from './types';

const frequency = 30;

const setDisableKeys = () => {
    Store.set('toggle', !Store.get('toggle'));
};

const isKeysDisabled = () => !(Store.get('toggle') ?? false);

const buttonPressMap: Record<
    Exclude<ButtonActions, 'openKeyboard'>,
    {
        func: (...args: any[]) => void;
        args?: any[];
    }
> = {
    leftClick: {
        func: leftClick
    },
    rightClick: {
        func: rightClick
    },
    swipeLeft: {
        func: swipeScreen,
        args: ['left']
    },
    swipeRight: {
        func: swipeScreen,
        args: ['right']
    },
    escape: {
        func: keyPress,
        args: ['{escape}']
    },
    disableKeys: {
        func: setDisableKeys
    }
};

export class Background {
    private previousButtonsDown: number[] = [];
    private buttonsDown: number[] = [];
    private openKeyboard: () => void;

    constructor(openKeyboard: () => void) {
        this.openKeyboard = openKeyboard;
        setInterval(() => {
            const buttonsJustPressed = this.buttonsDown.filter((button) => !this.previousButtonsDown.includes(button));

            buttonsJustPressed.forEach((button) => this.buttonPress(button));

            this.previousButtonsDown = this.buttonsDown;
        }, 1000 / frequency);
    }

    buttonPress(button: number) {
        const buttonMap = getButtonMap();

        const action = Object.keys(buttonMap).find((key) => {
            const value = buttonMap[key as keyof typeof buttonMap];
            if (typeof value === 'number') return value === button;

            return value.every((value) => this.buttonsDown.includes(value));
        });

        const keysDisabled = isKeysDisabled();
        const keyboardOpen = getKeyboardOpen();

        const keysDisabledOrKeyboardOpen = keysDisabled || keyboardOpen;

        // Disable all keys if keys are disabled or keyboard is open
        if (keysDisabledOrKeyboardOpen && action !== 'openKeyboard' && action !== 'disableKeys') return;

        // Disable keyboard if keys are disabled
        if (keysDisabled && action === 'openKeyboard') return;

        // Disable disable keys if keyboard is open
        if (keyboardOpen && action === 'disableKeys') return;

        if (!action) return;

        if (action === 'openKeyboard') {
            this.openKeyboard();
        } else {
            const buttonPress = buttonPressMap[action];
            buttonPress.func(...(buttonPress.args ?? []));
        }
    }

    setButtonsDown(buttonsDown: number[]) {
        this.buttonsDown = buttonsDown;
    }
}
