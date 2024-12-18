import { mouse, keyboard, Button, Key, screen } from 'macpad-nut-js';
import { Store } from './storage';
import { getMouseSpeed, getScrollSpeed } from './background/speeds';

keyboard.config.autoDelayMs = 0;

export const getKeyboardOpen = () => Store.get('keyboardOpen') ?? false;

export const isKeysDisabled = () => {
    const isEnabled = Store.get('toggle') ?? false;
    const isKeyboardOpen = getKeyboardOpen();

    return !isEnabled || isKeyboardOpen;
};

export const moveMouse = async (x: number, y: number, speed: number = 1) => {
    if (isKeysDisabled()) return;

    const storeSpeed = getMouseSpeed();

    const screenWidth = await screen.width();
    const screenHeight = await screen.height();

    const mousePos = await mouse.getPosition();

    const newX = mousePos.x + x * speed * storeSpeed;
    const newY = mousePos.y + y * speed * storeSpeed;

    const clampedX = Math.max(0, Math.min(newX, screenWidth));
    const clampedY = Math.max(0, Math.min(newY, screenHeight));

    await mouse.move([{ x: clampedX, y: clampedY }]);
};

export const scrollMouse = async (x: number, y: number, speed: number = 0.5) => {
    if (isKeysDisabled()) return;

    const storeSpeed = getScrollSpeed();

    if (y > 0) {
        await mouse.scrollDown(Math.abs(y) * speed * storeSpeed);
    } else if (y < 0) {
        await mouse.scrollUp(Math.abs(y) * speed * storeSpeed);
    }

    if (x > 0) {
        await mouse.scrollRight(Math.abs(x) * speed * storeSpeed);
    } else if (x < 0) {
        await mouse.scrollLeft(Math.abs(x) * speed * storeSpeed);
    }
};

export const leftClick = () => {
    if (isKeysDisabled()) return;

    mouse.click(Button.LEFT);
};

export const rightClick = () => {
    if (isKeysDisabled()) return;

    mouse.click(Button.RIGHT);
};

export const keyPress = (key: string, fromKeyboard: boolean = false) => {
    if (isKeysDisabled() && !fromKeyboard) return;

    keyboard.type(specialKeysMap[key] ?? key);
};

export const swipeScreen = async (direction: 'left' | 'right') => {
    if (isKeysDisabled()) return;

    keyboard.moveSpace(direction === 'left');
};

const specialKeysMap = {
    '{bksp}': Key.Backspace,
    '{shift}': Key.LeftShift,
    '{tab}': Key.Tab,
    '{enter}': Key.Enter,
    '{lock}': Key.CapsLock,
    '{esc}': Key.Escape,
    '{space}': Key.Space,
    '{space}{space}{space}{space}': Key.Space,
    '{arrowright}': Key.Right,
    '{arrowleft}': Key.Left,
    '{escape}': Key.Escape
};
