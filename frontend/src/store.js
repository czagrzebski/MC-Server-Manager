import create from 'zustand';

const useStore = create((set) => ({
    consoleOutput: [],
    addConsoleOutput: (output) => set((state) => ({consoleOutput: [...state.consoleOutput, output]})),
    clearConsole: () => set((state) => ({consoleOutput: []})),
    minecraftServerState: 'Offline',
    setMinecraftServerState: (serverState) => set((state) => ({minecraftServerState: serverState})),
}));

export default useStore;