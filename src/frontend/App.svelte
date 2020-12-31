<script lang="ts">
  import Main from "./components/Main.svelte";
</script>

<Main />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .btn {
    @apply inline-block px-6 py-2 text-xs font-medium uppercase leading-6 text-center text-white rounded transition duration-500 ease-in-out bg-[#0ae9d6] hover:bg-[#111f3b] transform hover:-translate-y-1 hover:scale-100;
  }
  .btn-delete {
    @apply inline-block px-6 py-2 text-xs font-medium uppercase leading-6 text-center text-white rounded transition duration-500 ease-in-out bg-red-500 hover:bg-red-600 transform hover:-translate-y-1 hover:scale-100;
  }
</style>
