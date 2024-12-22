import { XboxButtonMap } from './xbox';
import { PlaystationButtonMap } from './playstation';
import { ButtonTypes } from './types';
import { SharedButtonIcons } from './shared';

export const ButtonMap = {
    [ButtonTypes.XBOX]: XboxButtonMap,
    [ButtonTypes.PLAYSTATION]: PlaystationButtonMap
};

export const AxisMap = {
    [ButtonTypes.XBOX]: SharedButtonIcons,
    [ButtonTypes.PLAYSTATION]: SharedButtonIcons
};
