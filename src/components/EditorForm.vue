<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <fieldset class="form-group">
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="Article Title"
          v-model="state.title"
        />
      </fieldset>

      <fieldset class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="What's this article about?"
          v-model="state.description"
        />
      </fieldset>

      <fieldset class="form-group">
        <textarea
          class="form-control"
          rows="8"
          placeholder="Write your article (in markdown)"
          v-model="state.body"
        >
        </textarea>
      </fieldset>

      <fieldset>
        <fieldset class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Enter tags"
            v-model="state.tagInput"
            @keyup.enter="onEnter"
          />
        </fieldset>

        <div class="tag-list">
          <span
            v-for="tag in state.tagList"
            :key="tag"
            class="tag-default tag-pill"
          >
            <i class="ion-close-round" @click="onDeleteTag(tag)"></i>
            {{ tag }}
          </span>
        </div>
      </fieldset>
      <button
        class="btn btn-lg pull-xs-right btn-primary"
        type="submit"
        :disabled="inProgress"
      >
        Publish Article
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { Nullable, omit } from "../utils";
import { defineComponent, PropType, reactive } from "vue";
import { pipe, constant } from "fp-ts/function";
import * as O from "fp-ts/Option";

interface State {
  title: string;
  description: string;
  body: string;
  tagInput: string;
  tagList: string[];
}

type InitialValues = Partial<Nullable<Omit<State, "tagInput">>>;

const defaultState = {
  title: "",
  description: "",
  body: "",
  tagInput: "",
  tagList: [],
};

export default defineComponent({
  props: {
    initialValues: Object as PropType<InitialValues>,
    inProgress: Boolean,
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
        }, {} as Partial<Omit<State, "tagInput">>);

        return Object.assign({}, defaultState, nilOmitted);
      }),
      O.getOrElse(constant(defaultState))
    );

    const state = reactive<State>(initialState);

    const onDeleteTag = (tag: string) => {
      state.tagList = state.tagList.filter((t) => t !== tag);
    };

    const onEnter = () => {
      state.tagList.push(state.tagInput);
      state.tagInput = "";
    };

    const onSubmit = () => {
      emit("submit", pipe(state, omit(["tagInput"])));
    };

    return {
      state,
      onDeleteTag,
      onEnter,
      onSubmit,
    };
  },
});
</script>

<style>
</style>