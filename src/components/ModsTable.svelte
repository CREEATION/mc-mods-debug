<script lang="ts">
  import { list, toggle, rename } from '../api/mods'

  const modsDir =
    'C:/Users/thomithx/Documents/Twitch/Minecraft/Instances/Create Au Gratin/mods/'

  export const columns: Array<{
    key: string
    label?: string
    type?: string
    width?: string
  }> = [
    { key: 'enable', type: 'checkbox', width: 'min' },
    { key: 'basename', label: 'Name', width: 'max' },
    { key: 'enabled', label: 'Enabled', width: 'min' },
  ]

  $: modsArray = []
  $: allModsAreEnabled = modsArray.filter((mod) => !mod.enabled).length === 0

  list(modsDir).then((res) => {
    modsArray = res
  })

  async function toggleModEvent(event) {
    let targetModId: string

    if (event.target.id) {
      // clicked checkbox
      targetModId = event.target.id
    } else {
      // clicked label
      event.preventDefault() // or checkbox triggers event too
      targetModId = event.target.dataset.modId
    }

    const targetMod = modsArray.filter((mod) => mod.id === targetModId)[0]

    await toggle(targetMod.path).then((newModObj) => {
      modsArray = modsArray.map((mod) => {
        return mod.id === targetModId ? newModObj : mod
      })
    })
  }

  function toggleAllModsEvent(event) {
    modsArray = modsArray.map((mod) => {
      if (mod.enabled !== event.target.checked) {
        mod.enabled = event.target.checked
        document.querySelector(`#${mod.id}`).dispatchEvent(new Event('input'))
      }

      return mod
    })
  }
</script>

<div>
  Mods:
  {#await modsArray}
    ?
  {:then modsArray}
    {modsArray.length}
  {/await}
</div>

<table>
  <thead>
    <tr>
      {#each columns as column}
        {#if column.type === 'checkbox'}
          <input
            on:click={toggleAllModsEvent}
            type="checkbox"
            checked={allModsAreEnabled}
          />
        {:else}
          <th class="column-head--{column.width}">
            {column.label}
          </th>
        {/if}
      {/each}
    </tr>
  </thead>

  {#await modsArray}
    <h1>loading mods...</h1>
  {:then modsArray}
    <tbody>
      {#each modsArray as mod}
        <tr
          class="row"
          class:row--enabled={mod.enabled}
          class:row--disabled={!mod.enabled}
        >
          {#each columns as column}
            {#if column.type === 'checkbox'}
              <td>
                <input
                  on:input={toggleModEvent}
                  bind:checked={mod.enabled}
                  id={mod.id}
                  type="checkbox"
                />
              </td>
            {:else if column.key === 'enabled'}
              <td>
                {mod[column.key] ? '✔' : 'X'}
              </td>
            {:else}
              <td>
                <label
                  for={mod.id}
                  on:click={toggleModEvent}
                  data-mod-id={mod.id}>{mod[column.key]}</label
                >
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  {/await}
</table>

<style lang="scss">
  table {
    text-align: left;
    line-height: 1.5;
    width: 100%;
  }

  td {
    border-top: 1px solid black;

    input[type='checkbox'] {
      cursor: pointer;
      vertical-align: middle;
      margin: 0;
      padding: 0;
    }

    label {
      cursor: pointer;
      display: inline-block;
      -moz-user-select: none;
      -webkit-user-select: none;
    }
  }

  .column-head {
    &--min {
      width: 1px;
    }

    &--max {
      width: 100%;
    }
  }

  .row {
    td:last-child {
      text-align: center;
    }

    &--enabled {
      color: green;
      font-weight: 500;
    }

    &--disabled {
      *:not(:last-child) {
        color: gray;
        font-style: italic;
      }

      td:last-child {
        color: darkred;
        font-weight: 500;
      }
    }
  }
</style>
