import ElectronStore from 'electron-store';

export const Store = new ElectronStore<{ token: string }>();
