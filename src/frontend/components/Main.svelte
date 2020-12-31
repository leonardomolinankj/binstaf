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

  const isValidBech32 = (address: string): boolean => {
    try {
      const humanReadablePart =
        currentNetwork === NetworkType.Dev
          ? Bech32Helper.BECH32_DEFAULT_HRP_DEV
          : Bech32Helper.BECH32_DEFAULT_HRP_MAIN;
      return !!Bech32Helper.fromBech32(address, humanReadablePart);
    } catch (e) {
      return false;
    }
  };

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

  const onSubmit = () => {
    if (isValidBech32(address) && !addresses.includes(address)) {
      addresses = [...addresses, address];
      window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
      address = "";
    }
  };

  const onDelete = (addressToRemove: String) => {
    console.log(`onDelete ${addressToRemove}`);
    addresses = addresses.filter((address) => addressToRemove !== address);
    window.localStorage.setItem(currentStorageKey, JSON.stringify(addresses));
  };
</script>

<form class="" on:submit|preventDefault={onSubmit}>
  <h1 class="">Select Your IOTA Network</h1>
  <div class="grid justify-items-center">
    <input
      type="radio"
      bind:group={currentNetwork}
      name="network"
      value={NetworkType.Dev}
    />
    Devnet

    <input
      class="radio radio-lg bg-[#111f3b]"
      type="radio"
      bind:group={currentNetwork}
      name="network"
      value={NetworkType.Main}
    />
    Mainnet
  </div>
  <input
    class="w-5/6 px-3 py-2 m-3"
    type="text"
    placeholder="Enter address"
    bind:value={address}
  />
  <button class="btn" type="submit">Search</button>
</form>
<div class="">
  <h1 class="text-[#132561d5] text-2xl m-3">List of Address</h1>
  <ul class="flex flex-col justify-items-center shadow-2xl rounded-xl m-8">
    {#each addressObjectList as { address, balance } (address)}
      <li class="m-10">
        Address : {address}
        <p class="text-[#1c1335]">Balance: {balance}</p>
        <button
          class="btn-delete float-right"
          type="button"
          on:click={() => onDelete(address)}>Delete</button
        >
      </li>
    {/each}
  </ul>
</div>
