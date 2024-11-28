import { useEffect, useState } from 'react';

interface ToggleProps {
    label?: string;
    onChange: (checked: boolean) => void;
    defaultChecked?: boolean;
}

export const Toggle = ({ label, onChange, defaultChecked = false }: ToggleProps) => {
    const [checked, setChecked] = useState(defaultChecked);

    const handleToggle = () => {
        const newValue = !checked;
        setChecked(newValue);
        onChange(newValue);
    };

    useEffect(() => {
        if (defaultChecked !== checked) {
            setChecked(defaultChecked);
        }
    }, [defaultChecked]);

    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-sm">{label}</span>}
            <button
                role="switch"
                aria-checked={checked}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    checked ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};
