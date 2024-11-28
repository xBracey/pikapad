import { useCallback, useEffect, useState } from 'react';

interface GamepadPressInputMap {
    [key: number]: () => void;
}

export const useGamepadPress = (input: GamepadPressInputMap) => {
    const [buttonsDown, setButtonsDown] = useState<number[]>([]);
    const [buttonsPressed, setButtonsPressed] = useState<number[]>([]);

    const gamepadPressLoop = useCallback((gamepad: Gamepad) => {
        const buttonsDownLocal: number[] = [];
        const buttonsUpLocal: number[] = [];

        Object.entries(gamepad.buttons).forEach(([key, button]) => {
            if (button.pressed) {
                buttonsDownLocal.push(parseInt(key));
            } else {
                buttonsUpLocal.push(parseInt(key));
            }
        });

        setButtonsDown(buttonsDownLocal);
        setButtonsPressed((pressed) => pressed.filter((button) => !buttonsUpLocal.includes(button)));
    }, []);

    useEffect(() => {
        const buttonsDownHaveNotBeenPressed = buttonsDown.filter((button) => !buttonsPressed.includes(button));

        if (buttonsDownHaveNotBeenPressed.length > 0) {
            buttonsDownHaveNotBeenPressed.forEach((button) => {
                input[button]?.();
            });
            setButtonsPressed(buttonsDown);
        }
    }, [buttonsDown]);

    return { buttonsDown, gamepadPressLoop };
};
