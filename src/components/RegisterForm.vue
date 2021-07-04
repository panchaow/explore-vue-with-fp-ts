<template>
  <form @submit.prevent="$emit('submit', state)">
    <fieldset>
      <fieldset class="form-group">
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="Username"
          v-model="state.username"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          type="email"
          class="form-control form-control-lg"
          autocomplete="username"
          placeholder="Email"
          v-model="state.email"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          type="password"
          class="form-control form-control-lg"
          autocomplete="current-password"
          placeholder="Password"
          v-model="state.password"
        />
      </fieldset>
      <button
        type="submit"
        class="btn btn-lg btn-primary pull-xs-right"
        :disabled="inProgress"
      >
        Sign up
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";

interface State {
  username: string;
  email: string;
  password: string;
}

export default defineComponent({
  name: "register-form",
  props: {
    inProgress: Boolean,
    initialValues: {
      type: Object as PropType<Partial<State>>,
      required: false,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const defaultState = {
      username: "",
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

<style></style>
