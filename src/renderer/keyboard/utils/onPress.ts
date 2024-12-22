import { RefObject } from 'react';
import { KeyboardReactInterface } from 'react-simple-keyboard';
import { keyboardDownMap, keyboardUpMap } from './keyboardMap';

export const getAllKeys = () => {
    return Array.from(document.querySelectorAll('.hg-button'));
};

export const onDPadPress = (direction: 'up' | 'down' | 'left' | 'right') => () => {
    const keysArray = getAllKeys();
    const activeKey = keysArray.findIndex((key) => key.getAttribute('aria-active') === 'true');

    if (activeKey !== -1) {
        keysArray[activeKey].removeAttribute('aria-active');
    } else {
        return;
    }

    const setVerticalActive = (direction: 'up' | 'down') => {
        const fullKey = keysArray[activeKey].getAttribute('data-skbtnuid')!;
        const key = fullKey.split('-')[1];
        const nextKey = direction === 'up' ? keyboardUpMap[key] : keyboardDownMap[key];

        keysArray.find((key) => key.getAttribute('data-skbtnuid')?.includes(nextKey))?.setAttribute('aria-active', 'true');
    };

    switch (direction) {
        case 'up':
            setVerticalActive('up');
            break;
        case 'down':
            setVerticalActive('down');
            break;
        case 'left':
            keysArray[activeKey === 0 ? keysArray.length - 1 : activeKey - 1].setAttribute('aria-active', 'true');
            break;
        case 'right':
            keysArray[activeKey === keysArray.length - 1 ? 0 : activeKey + 1].setAttribute('aria-active', 'true');
            break;
    }
};

export const onAPress = (keyboardRef: RefObject<KeyboardReactInterface>, setLastButtonClicked: (button: string) => void) => () => {
    const keys = getAllKeys();
    const keysArray = Array.from(keys);
    const activeKey = keysArray.findIndex((key) => key.getAttribute('aria-active') === 'true');

    setLastButtonClicked(keysArray[activeKey].getAttribute('data-skbtnuid')!.split('-')[1]);
    keyboardRef.current?.handleButtonClicked(keysArray[activeKey].getAttribute('data-skbtn')!);
};
