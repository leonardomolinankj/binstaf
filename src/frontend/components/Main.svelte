<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { Bech32Helper, SingleNodeClient, Units } from "@iota/iota.js";
  import {
    NetworkType,
    LocalStorage,
    Address,
    NodeEndpoint,
  } from "../module/lib";
  // Define all the stores
  export let currentNetwork: NetworkType = JSON.parse(
    window.localStorage.getItem(LocalStorage.SavedNetwork) || '"devnet"'
  );
  export let currentStorageKey:
    | LocalStorage.DevAddresses
    | LocalStorage.MainAddresses;
  export let addresses: Array<string> = [];
  export let addressObjectList: Array<Address> = [];
  export let address = "";
  export let client = {
    devnet: new SingleNodeClient(NodeEndpoint.Devnet),
    mainnet: new SingleNodeClient(NodeEndpoint.Mainnet),
  };
  export let currentClient: SingleNodeClient;

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
  <h1
    class="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#707397] to-[#121358]"
  >
    Select Your IOTA Network
  </h1>
  <div class="px-8">
    <input
      type="radio"
      bind:group={currentNetwork}
      name="network"
      value={NetworkType.Dev}
    />
    Devnet

    <input
      id="dmCheck"
      type="radio"
      bind:group={currentNetwork}
      name="network"
      value={NetworkType.Main}
    />
    Mainnet
  </div>
  <input class="input" placeholder="Enter address" bind:value={address} />
  <button class="btn" type="submit">Search</button>
</form>
<div class="">
  <h1 class="text-[#132561d5] text-2xl m-3">List of Address</h1>
  <ul class="flex flex-col justify-items-center shadow-2xl rounded-xl m-8">
    {#each addressObjectList as { address, balance } (address)}
      <li class="m-10">
        Address : {address}
        <p>Balance: {balance} I</p>
        <button
          class="btn-delete float-right"
          type="button"
          on:click={() => onDelete(address)}>Delete</button
        >
      </li>
    {/each}
  </ul>
</div>
