import { KeyboardLayoutObject } from 'react-simple-keyboard';

/**
 * Layout: English
 */
export default <KeyboardLayoutObject>{
    default: [
        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        '{tab} q w e r t y u i o p [ ] \\',
        "{lock} a s d f g h j k l ; ' {enter}",
        '{shift} z x c v b n m , . / {shift}',
        '.com @ {space}{space}{space}{space} {arrowleft} {arrowright}'
    ],
    shift: [
        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
        '{tab} Q W E R T Y U I O P { } |',
        '{lock} A S D F G H J K L : " {enter}',
        '{shift} Z X C V B N M < > ? {shift}',
        '.com @ {space}{space}{space}{space} {arrowleft} {arrowright}'
    ]
};
