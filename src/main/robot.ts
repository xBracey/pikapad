import { mouse, keyboard, Button } from '@nut-tree-fork/nut-js';

export const moveMouse = async (x: number, y: number, speed: number = 1) => {
    const mousePos = await mouse.getPosition();

    const newX = mousePos.x + x * speed;
    const newY = mousePos.y + y * speed;

    await mouse.move([{ x: newX, y: newY }]);
};

export const leftClick = () => {
    mouse.click(Button.LEFT);
};

export const rightClick = () => {
    mouse.click(Button.RIGHT);
};

export const keyPress = (key: string) => {
    keyboard.type(key);
};
