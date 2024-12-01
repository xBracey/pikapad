import { useEffect } from 'react';
import { useState } from 'react';
import { getAllKeys } from './onPress';
import { keysWithNoName } from './keysWithNoName';

export const useActivateKeyboard = (
    setNoNameKeyDimensions: (dimensions: Record<string, { x: number; y: number; width: number; height: number }>) => void
) => {
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const interval = hasLoaded
            ? null
            : setInterval(() => {
                  const keys = getAllKeys();
                  setHasLoaded(keys.length > 0 && keys.every((key) => !!key.getAttribute('data-skbtn')));
              }, 200);

        if (hasLoaded) {
            const keys = getAllKeys();
            const activeKey = keys.findIndex((key) => key.getAttribute('aria-active') === 'true');

            if (activeKey === -1) {
                const qKey = document.querySelector('[data-skbtn="q"]');
                qKey?.setAttribute('aria-active', 'true');
            }

            const newNoNameKeyDimensions: Record<string, { x: number; y: number; width: number; height: number }> = {};

            keysWithNoName.forEach((key) => {
                const keyElement = keys.find((k) => k.getAttribute('data-skbtnuid')!.split('-')[1] === key);
                if (keyElement) {
                    newNoNameKeyDimensions[key] = keyElement.getBoundingClientRect();
                }
            });

            setNoNameKeyDimensions(newNoNameKeyDimensions);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [hasLoaded]);
};
