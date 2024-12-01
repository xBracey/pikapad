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
            const isLeftStick = leftOrRightStick === 'left';

            const xAxis = gamepad.axes[isLeftStick ? 0 : 2] + (isLeftStick ? dPadXAxis : 0);
            const yAxis = gamepad.axes[isLeftStick ? 1 : 3] + (isLeftStick ? dPadYAxis : 0);

            const xMove = calculateMove(xAxis);
            const yMove = calculateMove(yAxis);

            return { xMove, yMove };
        },
        [buttonsDown]
    );

    return onGamepadAxis;
};
