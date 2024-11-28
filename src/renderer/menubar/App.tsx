import { useEffect, useState } from 'react';
import { Toggle } from './components/Toggle';

function App(): JSX.Element {
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        window.electron.ipcRenderer.invoke('getToggle').then((result: boolean) => {
            setIsActive(result);
        });
    }, []);

    const handleToggle = (checked: boolean) => {
        setIsActive(checked);
        window.electron.ipcRenderer.invoke('setToggle', checked);
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Toggle label={isActive ? 'Turn Off' : 'Turn On'} onChange={handleToggle} defaultChecked={isActive} />

            <button onClick={() => window.electron.ipcRenderer.invoke('openKeyboard')}>Open Keyboard</button>
        </div>
    );
}

export default App;
