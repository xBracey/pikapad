export type ButtonActions = 'leftClick' | 'rightClick' | 'swipeLeft' | 'swipeRight' | 'openKeyboard' | 'escape' | 'disableKeys';
export type ButtonMap = Record<ButtonActions, number[]>;

export const ButtonActionsWithNames: Record<ButtonActions, string> = {
    leftClick: 'Left Mouse Click',
    rightClick: 'Right Mouse Click',
    swipeLeft: 'Swipe Screen Left',
    swipeRight: 'Swipe Screen Right',
    openKeyboard: 'Open Keyboard',
    escape: 'Escape Key',
    disableKeys: 'Disable Controller'
};
