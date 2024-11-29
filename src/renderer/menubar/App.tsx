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
        <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
            <Toggle label={isActive ? 'Turn Off' : 'Turn On'} onChange={handleToggle} defaultChecked={isActive} />

            <button onClick={() => window.electron.ipcRenderer.invoke('openLog')}>Open Log</button>
        </div>
    );
}

export default App;
