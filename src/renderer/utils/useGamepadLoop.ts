import { useCallback, useEffect, useState } from 'react';

export const useGamepadLoop = (gameLoop: (connectedGamepad: Gamepad) => void) => {
    const [connectedGamepad, setConnectedGamepad] = useState<Gamepad | null>(null);

    useEffect(() => {
        const gamepadEvent = (e: GamepadEvent) => {
            setConnectedGamepad(e.gamepad);
        };

        window.addEventListener('gamepadconnected', gamepadEvent);

        return () => {
            window.removeEventListener('gamepadconnected', gamepadEvent);
        };
    }, []);

    const gameLoopBase = useCallback(
        (connectedGamepad: Gamepad | null) => {
            const gamepads = navigator.getGamepads();
            if (!gamepads) return;

            const gamepad = gamepads.find((g) => g?.index === connectedGamepad?.index);
            if (!gamepad) return;

            gameLoop(gamepad);
        },
        [gameLoop]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            gameLoopBase(connectedGamepad);
        }, 1000 / 60);

        return () => clearInterval(interval);
    }, [gameLoop, connectedGamepad]);
};
