<template>
  <form @submit.prevent="$emit('submit', state)">
    <fieldset>
      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          autocomplete="username"
          type="email"
          placeholder="Email"
          v-model="state.email"
        />
      </fieldset>

      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          v-model="state.password"
        />
      </fieldset>

      <button
        class="btn btn-lg btn-primary pull-xs-right"
        type="submit"
        :disabled="inProgress"
      >
        Sign in
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from "vue";
import * as O from "fp-ts/Option";
import { pipe, constant } from "fp-ts/function";

interface State {
  email: string;
  password: string;
}

export default defineComponent({
  name: "login-form",
  props: {
    inProgress: Boolean,
    initialValues: {
      type: Object as PropType<Partial<State>>,
      required: false,
    },
  },
  emits: ["submit"],
  setup(props) {
    const defaultState = {
      email: "",
      password: "",
    };

    const initialState = pipe(
      O.fromNullable(props.initialValues),
      O.map((initialValues) => {
        return Object.assign({}, initialValues, defaultState);
      }),
      O.getOrElse(constant(defaultState))
    );

    const state = reactive<State>(initialState);

    return {
      state,
    };
  },
});
</script>
<style>
</style>