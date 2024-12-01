import { useCallback } from 'react';

const calculateMove = (axis: number) => {
    if (Math.abs(axis) < 0.1) return 0;

    const isNegative = axis < 0;
    const move = Math.pow(axis * 10, 2);

    return isNegative ? -move : move;
};

export const useAxis = (buttonsDown: number[], buttonMultiplier = 0.3, leftOrRightStick = 'left') => {
    const onGamepadAxis = useCallback(
        (gamepad: Gamepad) => {
            const dPadXAxis = (+buttonsDown.includes(15) - +buttonsDown.includes(14)) * buttonMultiplier;
            const dPadYAxis = (+buttonsDown.includes(13) - +buttonsDown.includes(12)) * buttonMultiplier;

            const xAxis = gamepad.axes[leftOrRightStick === 'left' ? 0 : 2] + dPadXAxis;
            const yAxis = gamepad.axes[leftOrRightStick === 'left' ? 1 : 3] + dPadYAxis;

            const xMove = calculateMove(xAxis);
            const yMove = calculateMove(yAxis);

            return { xMove, yMove };
        },
        [buttonsDown]
    );

    return onGamepadAxis;
};
