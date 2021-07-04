<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <fieldset class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="URL of profile picture"
          v-model="state.image"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="Username"
          v-model="state.username"
        />
      </fieldset>

      <fieldset class="form-group">
        <textarea
          rows="8"
          class="form-control form-control-lg"
          placeholder="Short bio about you"
          v-model="state.bio"
        ></textarea>
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
          placeholder="New Password"
          v-model="state.password"
        />
      </fieldset>

      <button
        type="submit"
        class="btn btn-lg btn-primary pull-xs-right"
        :disabled="inProgress"
      >
        Update Settings
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { Nullable } from "../utils";
import { defineComponent, reactive, PropType } from "vue";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";

interface State {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

type InitialValues = Partial<Nullable<State>>;

const defaultState: State = {
  image: "",
  username: "",
  bio: "",
  email: "",
  password: "",
};

export default defineComponent({
  name: "settings-form",
  props: {
    inProgress: Boolean,
    initialValues: {
      type: Object as PropType<InitialValues>,
      required: false,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const initialState = pipe(
      O.fromNullable(props.initialValues),
      O.map((initialValues) => {
        const nilOmitted = Object.entries(initialValues).reduce((a, [k, v]) => {
          if (v !== null && v !== undefined) {
            (a as any)[k] = v;
          }
          return a;
        }, {} as Partial<State>);

        return Object.assign({}, defaultState, nilOmitted);
      }),
      O.getOrElse(constant(defaultState))
    );

    const state = reactive<State>(initialState);

    const onSubmit = () => {
      emit("submit", {
        user: {
          ...state,
          password: state.password.length > 0 ? state.password : null,
        },
      });
    };

    return {
      state,
      onSubmit,
    };
  },
});
</script>

<style>
</style>