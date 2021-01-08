export enum NetworkType {
    Dev = "devnet",
    Main = "mainnet",
}
export enum LocalStorage {
    SavedNetwork = "selectedNetwork",
    DevAddresses = "devnetAddresses",
    MainAddresses = "mainnetAddresses",
    unit = "unit",
}

export enum NodeEndpoint {
    Devnet = "https://api.lb-0.h.chrysalis-devnet.iota.cafe/",
    Mainnet = "https://chrysalis-nodes.iota.cafe/",
}

export interface Address {
    address: string;
    balance: number;
}