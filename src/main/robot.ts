import { mouse, keyboard, Button } from '@nut-tree-fork/nut-js';
import { Store } from './storage';

const getToggle = () => Store.get('toggle') ?? false;

export const moveMouse = async (x: number, y: number, speed: number = 1) => {
    if (!getToggle()) return;

    const mousePos = await mouse.getPosition();

    const newX = mousePos.x + x * speed;
    const newY = mousePos.y + y * speed;

    await mouse.move([{ x: newX, y: newY }]);
};

export const leftClick = () => {
    if (!getToggle()) return;

    mouse.click(Button.LEFT);
};

export const rightClick = () => {
    if (!getToggle()) return;

    mouse.click(Button.RIGHT);
};

export const keyPress = (key: string) => {
    console.log(key);

    if (!getToggle()) return;

    keyboard.type(key);
};
