import { FC } from 'react';

interface SliderProps {
    label: string;
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
}

const Slider: FC<SliderProps> = ({ label, value, setValue, min, max, step }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-100">{label}</label>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setValue(Math.max(min, value - step))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-gray-700 text-gray-100 hover:bg-gray-600"
                >
                    -
                </button>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                    onClick={() => setValue(Math.min(max, value + step))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-gray-700 text-gray-100 hover:bg-gray-600"
                >
                    +
                </button>
            </div>
            <span className="text-sm text-gray-200">{value.toFixed(1)}</span>
        </div>
    );
};

export default Slider;
