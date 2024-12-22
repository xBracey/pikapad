import { Button } from 'macpad-nut-js';
import { getKeyboardOpen, keyPress, mouseDoubleClick, mouseDown, mouseUp, swipeScreen } from '../robot';
import { Store } from '../storage';
import { getButtonMap } from './buttonMap';
import { ButtonActions } from './types';

const frequency = 30;
const doubleClickDelay = 250;

export const setDisableKeysWithValue = (value: boolean) => {
    Store.set('toggle', value);
};

const setDisableKeys = () => {
    Store.set('toggle', !Store.get('toggle'));
};

const isKeysDisabled = () => !(Store.get('toggle') ?? false);

const buttonPressMap: Record<
    Exclude<ButtonActions, 'openKeyboard'>,
    {
        func?: (...args: any[]) => void;
        onDown?: () => void;
        onUp?: () => void;
        doubleClick?: () => void;
        args?: any[];
    }
> = {
    leftClick: {
        onDown: mouseDown(Button.LEFT),
        onUp: mouseUp(Button.LEFT),
        doubleClick: mouseDoubleClick(Button.LEFT)
    },
    rightClick: {
        onDown: mouseDown(Button.RIGHT),
        onUp: mouseUp(Button.RIGHT),
        doubleClick: mouseDoubleClick(Button.RIGHT)
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
    private lastButtonClickMap: Record<ButtonActions, number> = {
        leftClick: 0,
        rightClick: 0,
        swipeLeft: 0,
        swipeRight: 0,
        escape: 0,
        disableKeys: 0,
        openKeyboard: 0
    };

    constructor(openKeyboard: () => void) {
        this.openKeyboard = openKeyboard;
        setInterval(() => {
            const buttonsJustPressed = this.buttonsDown.filter((button) => !this.previousButtonsDown.includes(button));

            this.checkButtonsDown(this.previousButtonsDown, this.buttonsDown);

            buttonsJustPressed.forEach((button) => this.buttonPress(button, this.buttonsDown));

            this.previousButtonsDown = this.buttonsDown;
        }, 1000 / frequency);
    }

    checkButtonsDown(previousButtonsDown: number[], buttonsDown: number[]) {
        if (previousButtonsDown.length === 0 && buttonsDown.length === 0) return;

        const buttonsJustPressedDown = buttonsDown.filter((button) => !previousButtonsDown.includes(button));

        buttonsJustPressedDown.forEach((button) => this.buttonPress(button, buttonsDown, 'down'));

        const buttonsJustPressedUp = previousButtonsDown.filter((button) => !buttonsDown.includes(button));
        buttonsJustPressedUp.forEach((button) => this.buttonPress(button, previousButtonsDown, 'up'));
    }

    buttonPress(button: number, buttonsToInclude: number[], state: 'click' | 'down' | 'up' = 'click') {
        const buttonMap = getButtonMap();

        const actionsRelevant = Object.fromEntries(Object.entries(buttonMap).filter(([_, value]) => value.includes(button)));

        const action = Object.keys(actionsRelevant).find((key) => {
            const value = buttonMap[key as keyof typeof buttonMap];
            return value.every((value) => buttonsToInclude.includes(value));
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
            if (state === 'click') {
                this.openKeyboard();
            }
        } else {
            const buttonPress = buttonPressMap[action];

            if (state === 'click') {
                if (this.lastButtonClickMap[action] && Date.now() - this.lastButtonClickMap[action] < doubleClickDelay) {
                    buttonPress.doubleClick?.();
                } else {
                    buttonPress.func?.(...(buttonPress.args ?? []));
                }
            }

            switch (state) {
                case 'down':
                    buttonPress.onDown?.();
                    break;
                case 'up':
                    buttonPress.onUp?.();
                    break;
            }
        }

        if (state === 'click') {
            this.lastButtonClickMap[action] = Date.now();
        }
    }

    setButtonsDown(buttonsDown: number[]) {
        this.buttonsDown = buttonsDown;
    }
}
