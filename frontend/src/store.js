import create from 'zustand';

const useStore = create((set) => ({
    consoleOutput: [],
    addConsoleOutput: (output) => set((state) => ({consoleOutput: [...state.consoleOutput, output]})),
    clearConsole: () => set((state) => ({consoleOutput: []})),
    minecraftServerState: 'SERVER_STOPPED',
    setMinecraftServerState: (serverState) => set((state) => ({minecraftServerState: serverState})),
}));

export default useStore;