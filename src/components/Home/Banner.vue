<template>
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">
        {{ appName }}
      </h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>
</template>

<script lang="ts">
import {useConfig} from '../../composables/useConfig';
import { defineComponent } from "vue";
import * as O from 'fp-ts/Option';
import { pipe, constant } from 'fp-ts/function';

export default defineComponent({
  name: "banner",
  setup() {
    const config = useConfig();

    const appName = pipe(
      config,
      O.map(config => config.appName),
      O.getOrElse(constant(""))
    )
    return {
      appName,
    }
  }
});
</script>

<style>

</style>