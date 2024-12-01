import { useCallback } from 'react';

const calculateMove = (axis: number) => {
    if (Math.abs(axis) < 0.1) return 0;

    const isNegative = axis < 0;
    const move = Math.pow(axis * 10, 2);

    return isNegative ? -move : move;
};

export const useAxis = (buttonsDown: number[]) => {
    const onGamepadAxis = useCallback(
        (gamepad: Gamepad) => {
            const dPadXAxis = (+buttonsDown.includes(15) - +buttonsDown.includes(14)) * 0.3;
            const dPadYAxis = (+buttonsDown.includes(13) - +buttonsDown.includes(12)) * 0.3;

            const xAxis = gamepad.axes[0] + dPadXAxis;
            const yAxis = gamepad.axes[1] + dPadYAxis;

            const xMove = calculateMove(xAxis);
            const yMove = calculateMove(yAxis);

            return { xMove, yMove };
        },
        [buttonsDown]
    );

    return onGamepadAxis;
};
