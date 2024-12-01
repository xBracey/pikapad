import { mouse, keyboard, Button, Key, screen } from 'macpad-nut-js';
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

    const screenWidth = await screen.width();
    const screenHeight = await screen.height();

    const mousePos = await mouse.getPosition();

    const newX = mousePos.x + x * speed;
    const newY = mousePos.y + y * speed;

    const clampedX = Math.max(0, Math.min(newX, screenWidth));
    const clampedY = Math.max(0, Math.min(newY, screenHeight));

    await mouse.move([{ x: clampedX, y: clampedY }]);
};

export const scrollMouse = async (x: number, y: number, speed: number = 0.5) => {
    if (disableKeys()) return;

    await mouse.scrollDown(y * speed);
    await mouse.scrollRight(x * speed);
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
