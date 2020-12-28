<script lang="ts">
  import { onMount } from "svelte";

  import { Bech32Helper, SingleNodeClient } from "@iota/iota.js";

  enum NetworkType {
    Dev = "devnet",
    Main = "mainnet",
  }

  enum LocalStorage {
    SavedNetwork = "selectedNetwork",
    DevAddresses = "devnetAddresses",
    MainAddresses = "mainnetAddresses",
  }

  enum NodeEndpoint {
    Devnet = "https://api.lb-0.h.chrysalis-devnet.iota.cafe/",
    Mainnet = "https://chrysalis-nodes.iota.cafe/",
  }

  interface Address {
    address: string;
    balance: number;
  }

  let currentNetwork: NetworkType = JSON.parse(
    window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"'
  );
  let currentStorageKey: LocalStorage.DevAddresses | LocalStorage.MainAddresses;
  let addresses: Array<string> = [];
  let addressObjectList: Array<Address> = [];
  let address = "";
  let client = {
    devnet: new SingleNodeClient(NodeEndpoint.Devnet),
    mainnet: new SingleNodeClient(NodeEndpoint.Mainnet),
  };
  let currentClient: SingleNodeClient;

  onMount(async () => {
    addresses = JSON.parse(
      window.localStorage.getItem(currentStorageKey) || "[]"
    );
    addressObjectList = await retrieveBalances(addresses, currentClient);
  });

  $: {
    window.localStorage.setItem(
      LocalStorage.SavedNetwork,
      JSON.stringify(currentNetwork)
    );
    currentStorageKey =
      currentNetwork === NetworkType.Dev
        ? LocalStorage.DevAddresses
        : LocalStorage.MainAddresses;
    currentClient =
      currentNetwork === NetworkType.Dev ? client.devnet : client.mainnet;
    addresses = JSON.parse(
      window.localStorage.getItem(currentStorageKey) || "[]"
    );
  }

  $: (async () =>
    (addressObjectList = await retrieveBalances(addresses, currentClient)))();

  function isValidBech32(address: string): boolean {
    try {
      const humanReadablePart =
        currentNetwork === NetworkType.Dev
          ? Bech32Helper.BECH32_DEFAULT_HRP_DEV
          : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
      return !!Bech32Helper.fromBech32(address, humanReadablePart);
    } catch (e) {
      return false;
    }
  }

  async function retrieveBalance(
    address: string,
    client: SingleNodeClient
  ): Promise<Address> {
    const addressInfo = await client.address(address);
    return {
      address,
      balance: addressInfo.balance,
    };
  }

  async function retrieveBalances(
    addresses: string[],
    client: SingleNodeClient
  ): Promise<Address[]> {
    return Promise.all(
      addresses.map((address) => retrieveBalance(address, client))
    );
  }

  function handleSubmit() {
    if (isValidBech32(address) && !addresses.includes(address)) {
      addresses = [...addresses, address];
      window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
      address = "";
    }
  }

  function handleDelete(addressToRemove: String) {
    console.log(`handleDelete ${addressToRemove}`);
    addresses = addresses.filter((address) => addressToRemove !== address);
    window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
  }
  // TODO: Add a function to handle the change of network
  //TODO: createa a better UX
  //TODO: add a button to switch between networks
  //TODO: Mqtt to devnet and  mainnet
  //TODO: test fot all function
</script>

<form on:submit|preventDefault={handleSubmit}>
  <p>Select the Network</p>
  <div>
    <label>
      <input
        type="radio"
        bind:group={currentNetwork}
        name="network"
        value={NetworkType.Dev}
      />
      devnet
    </label>

    <label>
      <input
        type="radio"
        bind:group={currentNetwork}
        name="network"
        value={NetworkType.Main}
      />
      mainnet
    </label>
  </div>
  <input type="text" placeholder="Enter address" bind:value={address} />
  <button type="submit">Add</button>
</form>
<ul>
  {#each addressObjectList as { address, balance } (address)}
    <li>
      <button type="button" on:click={() => handleDelete(address)}
        >Delete</button
      >{address}
      <p>Balance: {balance}</p>
    </li>
  {/each}
</ul>

<style>
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 10px;
  }

  button {
    margin-top: 10px;
    color: white;
    background-color: #4caf50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
