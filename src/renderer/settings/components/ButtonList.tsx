import { useEffect, useMemo, useState } from 'react';
import { ButtonMap } from '../../shared/buttons';
import { Buttons, ButtonTypes } from '../../shared/buttons/types';
import { ButtonActions, ButtonActionsWithNames, ButtonMap as ButtonMapType } from '../types';

const acceptedButtons = [
    Buttons.RIGHT_DOWN,
    Buttons.RIGHT_UP,
    Buttons.RIGHT_LEFT,
    Buttons.RIGHT_RIGHT,
    Buttons.LEFT_BUMPER,
    Buttons.RIGHT_BUMPER,
    Buttons.LEFT_STICK,
    Buttons.RIGHT_STICK,
    Buttons.SELECT,
    Buttons.START
];

interface ButtonListProps {
    controllerType: ButtonTypes;
    buttonMap: ButtonMapType;
    setButton: (button: number | number[], action: ButtonActions) => void;
    buttonsDown: number[];
}

export const ButtonList = ({ controllerType, buttonMap, setButton, buttonsDown }: ButtonListProps) => {
    const [addButtonPressed, setAddButtonPressed] = useState<false | string>(false);

    const buttonMapConfig = useMemo(() => ButtonMap[controllerType], [controllerType]);

    useEffect(() => {
        if (addButtonPressed && buttonsDown.length > 0) {
            const button = buttonsDown[0];
            if (!acceptedButtons.includes(button)) return;

            onChange(addButtonPressed as ButtonActions, button);
            onChange(addButtonPressed as ButtonActions, button);
            setAddButtonPressed(false);

            setTimeout(() => {
                window.electron.ipcRenderer.invoke('setDisableKeys', true);
            }, 250);
        }
    }, [buttonsDown]);

    const onChange = (key: string, value: number) => {
        if (key === 'leftClick') {
            return;
        }

        const existingButtons = buttonMap[key as ButtonActions];
        const values = [...new Set([...existingButtons, value])];

        setButton(values, key as ButtonActions);
    };

    const onAddButtonClick = (key: string) => () => {
        setAddButtonPressed(key);
        window.electron.ipcRenderer.invoke('setDisableKeys', false);
    };

    const onRemoveButtonClick = (key: string, button: number) => () => {
        const existingButtons = buttonMap[key as ButtonActions];
        const values = existingButtons.filter((value) => value !== button);
        setButton(values, key as ButtonActions);
    };

    return (
        <div className="flex flex-col justify-center w-full">
            {addButtonPressed && (
                <div className="flex flex-col justify-center w-screen h-screen absolute top-0 left-0 z-50">
                    <div className="absolute inset-0 bg-black/75 z-10" />

                    <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
                        <p className="text-center text-slate-900 bg-white px-4 py-2 rounded-md">
                            Press a button to add it to {ButtonActionsWithNames[addButtonPressed as ButtonActions]}
                        </p>
                    </div>
                </div>
            )}

            {Object.entries(ButtonActionsWithNames).map(([key, value]) => {
                return (
                    <div className="flex border-b last:border-b-0 border-slate-300 py-1 items-center justify-between" key={key}>
                        <p className="w-36">{value}</p>

                        <div className="flex flex-1 justify-center items-center gap-1">
                            {buttonMap[key].map((button) => (
                                <div key={button} className="flex items-center justify-center relative">
                                    <img src={buttonMapConfig[button]} alt={button} className="w-10 h-10" />

                                    {key !== 'leftClick' && (
                                        <button
                                            className="text-xs bg-slate-950 rounded-full w-4 h-4 absolute top-0 right-0 flex flex-col items-center justify-center"
                                            onClick={onRemoveButtonClick(key, button)}
                                        >
                                            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-0.5">x</p>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onAddButtonClick(key)}
                            disabled={!!addButtonPressed || key === 'leftClick'}
                        >
                            Add Button
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
