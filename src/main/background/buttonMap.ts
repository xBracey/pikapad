import { Store } from '../storage';
import { ButtonActions } from './types';

const defaultButtonMap: Record<ButtonActions, number | number[]> = {
    escape: 1,
    rightClick: 2,
    swipeLeft: 4,
    swipeRight: 5,
    openKeyboard: 9,
    leftClick: 0,
    disableKeys: [10, 11, 3]
};

export const getButtonMap = () => {
    const buttonMap: string = Store.get('buttonMap') ?? JSON.stringify(defaultButtonMap);
    return JSON.parse(buttonMap) as Record<ButtonActions, number | number[]>;
};

export const setButton = (button: number | number[], action: ButtonActions) => {
    const buttonMap = getButtonMap();
    buttonMap[action] = button;
    Store.set('buttonMap', JSON.stringify(buttonMap));
};
