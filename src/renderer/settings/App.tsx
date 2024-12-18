import { useCallback, useEffect, useState } from 'react';

type ButtonActions = 'leftClick' | 'rightClick' | 'swipeLeft' | 'swipeRight' | 'openKeyboard' | 'escape' | 'disableKeys';

function App(): JSX.Element {
    const [buttonMap, setButtonMap] = useState<Record<ButtonActions, number | number[]> | null>(null);

    useEffect(() => {
        window.electron.ipcRenderer.invoke('getButtonMap').then((buttonMap) => {
            setButtonMap(buttonMap);
        });
    }, []);

    return <div>Button map: {JSON.stringify(buttonMap)}</div>;
}

export default App;
