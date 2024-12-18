export const getControllerType = (gamepad: Gamepad) => {
    const idLowercase = gamepad.id.toLowerCase();

    if (idLowercase.includes('xbox')) return 'xbox';
    if (idLowercase.includes('playstation') || idLowercase.includes('dualshock') || idLowercase.includes('sony')) return 'playstation';

    return 'unknown';
};
