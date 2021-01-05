<script lang="ts">
  import Main from "./components/Main.svelte";
  export let name;
</script>

<div>
  <h1>Hello {name}!</h1>
  <Main />
</div>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .btn {
    @apply inline-block px-4 py-2 text-xs font-medium  leading-6 text-center text-white rounded transition duration-1000 ease-in-out bg-[#a4bbb9] hover:bg-[#111f3b] transform hover:-translate-x-0 hover:scale-110;
  }
  .btn-delete {
    @apply inline-block px-4 py-2 text-xs font-medium  leading-6 text-center text-white rounded transition duration-500 ease-in-out bg-red-500 hover:bg-red-600 transform hover:-translate-x-0 hover:scale-110;
  }
  .input {
    @apply w-4/5  m-3 border border-gray-300 rounded-lg  shadow-sm px-3 py-2 focus:outline-none focus:border-[#a4bbb9];
  }
</style>
