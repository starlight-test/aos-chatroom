export declare global {
    var arweaveWallet: {
        addToken: () => {};
        connect: (permissions: string[]) => Promise;
        decrypt: () => {};
        disconnect: () => {};
        dispatch: () => {};
        encrypt: () => {};
        events: { all: Map, on: Function, off: Function, emit: Function }
        getActiveAddress: () => Promise;
        getActivePublicKey: () => Promise;
        getAllAddresses: () => Promise;
        getArweaveConfig: () => {};
        getPermissions: () => {};
        getWalletNames: () => {};
        isTokenAdded: () => {};
        privateHash: () => {};
        sign: () => {};
        signDataItem: () => {};
        signMessage: () => {};
        signature: () => {};
        verifyMessage: () => {};
        walletName: string
        walletVersion: string
    } | undefined
}