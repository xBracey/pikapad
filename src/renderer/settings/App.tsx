import { useCallback, useEffect, useState } from 'react';
import Slider from './components/Slider';
import { ButtonTypes } from '../shared/buttons/types';
import { ButtonActions, ButtonMap } from './types';
import { ButtonList } from './components/ButtonList';
import { useGamepadLoop } from '../utils/useGamepadLoop';
import { useGamepadPress } from '../utils/useGamepadPress';

function App(): JSX.Element {
    const [mouseSpeed, setMouseSpeedState] = useState<number>(1);
    const [scrollSpeed, setScrollSpeedState] = useState<number>(1);
    const [buttonMap, setButtonMap] = useState<ButtonMap | null>(null);
    const [controllerType, setControllerType] = useState<ButtonTypes>(ButtonTypes.XBOX);

    const { gamepadPressLoop, buttonsDown } = useGamepadPress({});

    const gameLoop = useCallback(
        (gamepad: Gamepad) => {
            gamepadPressLoop(gamepad);
        },
        [buttonsDown]
    );

    useGamepadLoop(gameLoop, 60);

    const [activeTab, setActiveTab] = useState<'mouse' | 'buttons'>('mouse');

    const setMouseSpeed = (mouseSpeed: number) => {
        setMouseSpeedState(mouseSpeed);
        window.electron.ipcRenderer.invoke('setMouseSpeed', mouseSpeed);
    };

    const setScrollSpeed = (scrollSpeed: number) => {
        setScrollSpeedState(scrollSpeed);
        window.electron.ipcRenderer.invoke('setScrollSpeed', scrollSpeed);
    };

    const setButton = (button: number | number[], action: ButtonActions) => {
        window.electron.ipcRenderer.invoke('setButton', button, action);

        setButtonMap((prevButtonMap) => {
            if (!prevButtonMap) return null;
            const newButtonMap = { ...prevButtonMap, [action]: button };
            return newButtonMap;
        });
    };

    const onTabChange = (tab: 'mouse' | 'buttons') => () => {
        setActiveTab(tab);
    };

    useEffect(() => {
        window.electron.ipcRenderer.invoke('getButtonMap').then(setButtonMap);
        window.electron.ipcRenderer.invoke('getControllerType').then(setControllerType);
        window.electron.ipcRenderer.invoke('getMouseSpeed').then(setMouseSpeedState);
        window.electron.ipcRenderer.invoke('getScrollSpeed').then(setScrollSpeedState);
    }, []);

    if (!buttonMap) return <div className="flex flex-col gap-2 px-4 h-screen w-screen bg-slate-800 text-white">Loading</div>;

    return (
        <div className="flex flex-col gap-2 px-4 h-screen w-screen bg-slate-800 text-white overflow-auto">
            <h1 className="text-xl font-bold my-1.5 mt-3 text-center">PikaPad Settings</h1>

            <div className="flex w-full">
                <button
                    className={` px-4 py-2 rounded-l-md flex-1 hover:bg-slate-600 transition-all ${activeTab === 'mouse' ? 'bg-slate-900' : 'bg-slate-500'}`}
                    onClick={onTabChange('mouse')}
                >
                    Mouse
                </button>
                <button
                    className={`px-4 py-2 rounded-r-md flex-1 hover:bg-slate-600 transition-all ${activeTab === 'buttons' ? 'bg-slate-900' : 'bg-slate-500'}`}
                    onClick={onTabChange('buttons')}
                >
                    Buttons
                </button>
            </div>

            {activeTab === 'mouse' && (
                <>
                    <div className="flex flex-col gap-6 w-full mt-6">
                        <Slider label="Mouse speed" value={mouseSpeed} setValue={setMouseSpeed} min={0.1} max={5} step={0.1} />
                        <Slider label="Scroll speed" value={scrollSpeed} setValue={setScrollSpeed} min={0.1} max={5} step={0.1} />
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto flex-1 w-full">
                        <h3 className="text-lg font-bold text-center">Test Scroll Speed</h3>

                        {Array.from({ length: 100 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-full h-10 min-h-10 bg-slate-700 rounded-md text-center flex items-center justify-center"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'buttons' && (
                <ButtonList controllerType={controllerType} buttonMap={buttonMap} setButton={setButton} buttonsDown={buttonsDown} />
            )}
        </div>
    );
}

export default App;
