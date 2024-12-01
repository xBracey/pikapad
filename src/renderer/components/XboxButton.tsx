export type XboxLetter = 'A' | 'B' | 'X' | 'Y';

const letterToHexColor = (letter: XboxLetter) => {
    switch (letter) {
        case 'A':
            return '#00FF00';
        case 'B':
            return '#FF0000';
        case 'X':
            return '#8282f9';
        case 'Y':
            return '#FFFF00';
    }
};

export const XboxButton = ({ letter }: { letter: XboxLetter }) => {
    return (
        <div
            className="w-6 h-6 text-black flex items-center justify-center rounded-full border-2 border-black"
            style={{ backgroundColor: letterToHexColor(letter) }}
        >
            {letter}
        </div>
    );
};
