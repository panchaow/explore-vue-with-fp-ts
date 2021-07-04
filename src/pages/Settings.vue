<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <list-errors :errors="errors" />

          <settings-form
            :inProgress="inProgress"
            :initialValues="initialValues"
            @submit="onSubmit"
          />

          <hr />

          <button class="btn btn-outline-danger" @click="onLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { pick } from "../utils";
import useStore from "../composables/useStore";
import ListErrors from "../components/ListErrors.vue";
import SettingsForm from "../components/SettingsForm.vue";

export default defineComponent({
  components: { ListErrors, SettingsForm },
  setup() {
    const store = useStore();

    const inProgress = computed(() => store.state.settings.inProgress);
    const errors = computed(() => store.state.settings.errors);

    const initialValues = pipe(
      store.state.currentUser,
      O.map(pick(["email", "username", "bio", "image"])),
      O.toUndefined
    );

    const onSubmit = (payload: any) => {
      console.log(payload)
      store.dispatch("settings/submit", payload)
    }

    const onLogout = () => {
      store.commit("clearCurrentUser")
    }

    return {
      inProgress,
      errors,
      initialValues,
      onSubmit,
      onLogout,
    };
  },
});
</script>

<style>
</style>