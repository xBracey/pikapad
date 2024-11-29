import { mouse, keyboard, Button, Key } from 'macpad-nut-js';
import { Store } from './storage';

keyboard.config.autoDelayMs = 0;

const getKeyboardOpen = () => Store.get('keyboardOpen') ?? false;

const disableKeys = () => {
    const isEnabled = Store.get('toggle') ?? false;
    const isKeyboardOpen = getKeyboardOpen();

    return !isEnabled || isKeyboardOpen;
};

export const moveMouse = async (x: number, y: number, speed: number = 1) => {
    if (disableKeys()) return;

    const mousePos = await mouse.getPosition();

    const newX = mousePos.x + x * speed;
    const newY = mousePos.y + y * speed;

    await mouse.move([{ x: newX, y: newY }]);
};

export const leftClick = () => {
    if (disableKeys()) return;

    mouse.click(Button.LEFT);
};

export const rightClick = () => {
    if (disableKeys()) return;

    mouse.click(Button.RIGHT);
};

export const keyPress = (key: string, fromKeyboard: boolean = false) => {
    if (disableKeys() && !fromKeyboard) return;

    keyboard.type(specialKeysMap[key] ?? key);
};

export const swipeScreen = async (direction: 'left' | 'right') => {
    if (disableKeys()) return;

    keyboard.moveSpace(direction === 'left');
};

const specialKeysMap = {
    '{bksp}': Key.Backspace,
    '{shift}': Key.LeftShift,
    '{tab}': Key.Tab,
    '{enter}': Key.Enter,
    '{lock}': Key.CapsLock,
    '{esc}': Key.Escape,
    '{space}': Key.Space
};
