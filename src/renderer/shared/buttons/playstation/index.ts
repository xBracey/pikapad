import { Buttons } from '../types';
import Cross from './images/playstation_button_color_cross.png';
import Circle from './images/playstation_button_color_circle.png';
import Square from './images/playstation_button_color_square.png';
import Triangle from './images/playstation_button_color_triangle.png';
import select from './images/playstation3_button_select.png';
import start from './images/playstation3_button_start.png';
import up from './images/playstation_dpad_up_outline.png';
import down from './images/playstation_dpad_down_outline.png';
import left from './images/playstation_dpad_left_outline.png';
import right from './images/playstation_dpad_right_outline.png';
import l1 from './images/playstation_trigger_l1_alternative.png';
import r1 from './images/playstation_trigger_r1_alternative.png';
import l2 from './images/playstation_trigger_l2_alternative.png';
import r2 from './images/playstation_trigger_r2_alternative.png';
import l3 from './images/playstation_button_l3.png';
import r3 from './images/playstation_button_r3.png';

export const PlaystationButtonMap: Record<Buttons, string> = {
    [Buttons.LEFT_STICK]: l3,
    [Buttons.RIGHT_STICK]: r3,
    [Buttons.RIGHT_DOWN]: Triangle,
    [Buttons.RIGHT_RIGHT]: Circle,
    [Buttons.RIGHT_LEFT]: Square,
    [Buttons.RIGHT_UP]: Cross,
    [Buttons.LEFT_BUMPER]: l1,
    [Buttons.RIGHT_BUMPER]: r1,
    [Buttons.LEFT_TRIGGER]: l2,
    [Buttons.RIGHT_TRIGGER]: r2,
    [Buttons.SELECT]: select,
    [Buttons.START]: start,
    [Buttons.DPAD_UP]: up,
    [Buttons.DPAD_DOWN]: down,
    [Buttons.DPAD_LEFT]: left,
    [Buttons.DPAD_RIGHT]: right
};
