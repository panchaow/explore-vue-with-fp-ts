<template>
  <div v-if="appLoaded">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Header from './components/Header.vue';
import config from './config';
import { provideConfig } from './composables/useConfig';
import { key } from './store';
import { computed, defineComponent, provide, onMounted } from "vue";
import { useStore } from 'vuex';
import * as O from 'fp-ts/Option';
import { pipe, flow } from 'fp-ts/function';

export default defineComponent({
  components: {
    Header,
  },
  setup() {
    const store = useStore(key);

    // const isLoggedIn = computed(() => !! store.state.currentUser);
    const appLoaded = computed(() => store.state.appLoaded)

    onMounted(() => {
      store.dispatch("initApp")
    })

    // onBeforeRouteLeave(
    //   flow(
    //     (to, from) => O.fromNullable(to.name),
    //     O.filter(name => name === "login" || name === "register"),
    //     O.fold(() => {}, () => {
    //       if (isLoggedIn.value) {

    //       }
    //     })
    //   )
    // )

    provideConfig(config)

    return {
      appLoaded,
    }
  }
});
</script>

<style>

</style>