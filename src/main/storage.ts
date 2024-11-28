import ElectronStore from 'electron-store';

export const Store = new ElectronStore<{ active: boolean }>({
    defaults: {
        active: true
    }
});
