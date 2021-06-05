<script lang="ts">
  import { onMount } from 'svelte'

  import ModsTable from './components/ModsTable.svelte'

  let ready = false

  onMount(() => {
    ready = true
  })
</script>

<main>
  <h1>Minecraft Mods Debug</h1>
  {#if ready}
    <ModsTable />
  {:else}
    <h1>loading app...</h1>
  {/if}
</main>

<style lang="scss">
</style>
