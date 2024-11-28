export const keyboardUpMap: Record<string, string> = {
    // Row 1
    '`': '.com',
    '1': '.com',
    '2': '@',
    '3': '@',
    '4': '@',
    '5': '{space}',
    '6': '{space}',
    '7': '{space}',
    '8': '{space}',
    '9': '{space}',
    '0': '{space}',
    '-': '{space}',
    '=': '{space}',
    '{bksp}': '{space}',
    // Row 2
    '{tab}': '`',
    q: '1',
    w: '3',
    e: '4',
    r: '5',
    t: '6',
    y: '7',
    u: '8',
    i: '9',
    o: '-',
    p: '=',
    '[': '{bksp}',
    ']': '{bksp}',
    '\\': '{bksp}',
    // Row 3
    '{lock}': '{tab}',
    a: 'q',
    s: 'w',
    d: 'e',
    f: 'r',
    g: 't',
    h: 'y',
    j: 'u',
    k: 'i',
    l: 'o',
    ';': 'p',
    "'": '[',
    '{enter}': ']',
    // Row 4
    '{shift}#default-r3b0': '{lock}',
    z: 'a',
    x: 's',
    c: 'd',
    v: 'f',
    b: 'g',
    n: 'j',
    m: 'k',
    ',': 'l',
    '.': ';',
    '/': "'",
    '{shift}#default-r3b11': '{enter}',
    // Row 5
    '.com': '{shift}#default-r3b0',
    '@': 'x',
    '{space}': 'n'
};

export const keyboardDownMap: Record<string, string> = {
    // Row 1
    '`': '{tab}',
    '1': 'q',
    '2': 'q',
    '3': 'w',
    '4': 'e',
    '5': 'r',
    '6': 't',
    '7': 'y',
    '8': 'u',
    '9': 'i',
    '0': 'i',
    '-': 'o',
    '=': 'p',
    '{bksp}': ']',
    // Row 2
    '{tab}': '{lock}',
    q: 'a',
    w: 's',
    e: 'd',
    r: 'f',
    t: 'g',
    y: 'h',
    u: 'j',
    i: 'k',
    o: 'l',
    p: ';',
    '[': "'",
    ']': '{enter}',
    '\\': '{enter}',
    // Row 3
    '{lock}': '{shift}#default-r3b0',
    a: 'z',
    s: 'x',
    d: 'c',
    f: 'v',
    g: 'b',
    h: 'b',
    j: 'n',
    k: 'm',
    l: ',',
    ';': '.',
    "'": '/',
    '{enter}': '{shift}#default-r3b11',
    // Row 4
    '{shift}#default-r3b0': '.com',
    z: '.com',
    x: '@',
    c: '{space}',
    v: '{space}',
    b: '{space}',
    n: '{space}',
    m: '{space}',
    ',': '{space}',
    '.': '{space}',
    '/': '{space}',
    '{shift}#default-r3b11': '{space}',
    // Row 5
    '.com': '`',
    '@': '3',
    '{space}': '{bksp}'
};
