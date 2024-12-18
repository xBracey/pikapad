import { Store } from '../storage';

export const getMouseSpeed = () => {
    const mouseSpeed = Store.get('mouseSpeed') ?? 1;
    return mouseSpeed as number;
};

export const setMouseSpeed = (mouseSpeed: number) => {
    Store.set('mouseSpeed', mouseSpeed);
};

export const getScrollSpeed = () => {
    const scrollSpeed = Store.get('scrollSpeed') ?? 1;
    return scrollSpeed as number;
};

export const setScrollSpeed = (scrollSpeed: number) => {
    Store.set('scrollSpeed', scrollSpeed);
};
