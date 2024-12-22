import { Buttons } from '../types';
import A from './images/xbox_button_color_a.png';
import B from './images/xbox_button_color_b.png';
import X from './images/xbox_button_color_x.png';
import Y from './images/xbox_button_color_y.png';
import menu from './images/xbox_button_menu.png';
import view from './images/xbox_button_view.png';
import up from './images/xbox_dpad_up_outline.png';
import down from './images/xbox_dpad_down_outline.png';
import left from './images/xbox_dpad_left_outline.png';
import right from './images/xbox_dpad_right_outline.png';
import lb from './images/xbox_lb.png';
import rb from './images/xbox_rb.png';
import ls from './images/xbox_ls.png';
import rs from './images/xbox_rs.png';
import lt from './images/xbox_lt.png';
import rt from './images/xbox_rt.png';

export const XboxButtonMap: Record<Buttons, string> = {
    [Buttons.RIGHT_DOWN]: A,
    [Buttons.RIGHT_RIGHT]: B,
    [Buttons.RIGHT_LEFT]: X,
    [Buttons.RIGHT_UP]: Y,
    [Buttons.LEFT_BUMPER]: lb,
    [Buttons.RIGHT_BUMPER]: rb,
    [Buttons.LEFT_TRIGGER]: lt,
    [Buttons.RIGHT_TRIGGER]: rt,
    [Buttons.SELECT]: menu,
    [Buttons.START]: view,
    [Buttons.LEFT_STICK]: ls,
    [Buttons.RIGHT_STICK]: rs,
    [Buttons.DPAD_UP]: up,
    [Buttons.DPAD_DOWN]: down,
    [Buttons.DPAD_LEFT]: left,
    [Buttons.DPAD_RIGHT]: right
};
