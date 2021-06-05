<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  import { list, toggle } from '../api/mods'

  const modsDir = writable(
    localStorage.getItem('mods-dir') !== null
      ? localStorage.getItem('mods-dir')
      : ''
  )

  let modsArray = []
  let modsDirList = getModsDirList()

  modsDir.subscribe((dir) => {
    localStorage.setItem('mods-dir', dir || '')
    modsArray = modsArray
  })

  async function getModsDirList() {
    modsArray = []
    return list($modsDir)
      .then(
        (
          res: Array<{
            id: string
            basename: string
            name: string
            path: string
            extensions: Array<string>
            enabled: boolean
          }>
        ) => {
          modsArray = res
        }
      )
      .catch((err) => {
        console.error(err)
      })
  }

  onMount(() => {
    try {
      modsDir.set(localStorage.getItem('mods-dir') || '')
    } catch (error) {
      console.error(error)
    }
  })

  export const columns: Array<{
    key: string
    label?: string
    type?: string
    width?: string
  }> = [
    { key: 'enable', type: 'checkbox', width: 'min' },
    { key: 'name', label: 'Name', width: 'max' },
    { key: 'enabled', label: 'Enabled', width: 'min' },
  ]

  $: allModsAreEnabled = modsArray
    ? modsArray.filter((mod) => !mod.enabled).length === 0
    : false

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

  function handleClick() {
    modsDirList = getModsDirList()
  }
</script>

<div id="input-mods-directory">
  {#await modsDir}
    <input type="text" disabled placeholder={`loading...`} />
  {:then}
    <input
      type="text"
      bind:value={$modsDir}
      placeholder={`full path to mods directory (including "/mods/")`}
    />
    <button on:click={handleClick}>set directory</button>
  {/await}
</div>

{#await modsDirList}
  <h3>...loading</h3>
{:then}
  <h3>
    Mods:
    {#await modsArray}
      ?
    {:then modsArray}
      {modsArray ? modsArray.filter((mod) => mod.enabled).length : 0}/{modsArray
        ? modsArray.length
        : 0}
    {/await}
  </h3>

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
        {#each modsArray ? modsArray : [] as mod}
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
        {:else}
          <tr class="row--disabled">
            <td><input type="checkbox" disabled /></td>
            <td>no mods found</td>
            <td>X</td>
          </tr>
        {/each}
      </tbody>
    {/await}
  </table>
{:catch}
  <div class="error">
    <span>couldn't find directory :(</span>
    <pre>{$modsDir || "???"}</pre>
  </div>
{/await}

<style lang="scss">
  .error {
    background: rgba(255, 0, 0, 0.15);
    padding: 10px;
    text-align: center;

    pre {
      font-weight: bold;
    }
  }

  #input-mods-directory {
    input {
      box-sizing: border-box;
      width: 100%;
      padding: 5px;
    }
  }

  table {
    text-align: left;
    line-height: 1.5;
    width: 100%;
    border: 1px solid gray;
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
