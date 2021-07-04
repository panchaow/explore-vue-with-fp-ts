<template>
  <div v-if="loaded" class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <list-errors :errors="errors"></list-errors>
          <editor-form
            :initialValues="initialValues"
            :inProgress="inProgress"
            :key="slug"
            @submit="onSave"
          ></editor-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import ListErrors from "../components/ListErrors.vue";
import EditorForm from "../components/EditorForm.vue";
import useStore from "../composables/useStore";
import { defineComponent, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import * as E from "fp-ts/Either";

export default defineComponent({
  components: { ListErrors, EditorForm },
  setup() {
    const store = useStore();
    const route = useRoute();
    const loaded = ref<boolean>(false);

    if (!route.params.slug) {
      loaded.value = true;
    }

    const errors = computed(() => store.state.editor.errors);
    const inProgress = computed(() => store.state.editor.inProgress);
    const slug = computed(() => route.params.slug);

    const initialValues = ref<any>({});

    watch(
      () => slug.value,
      (newSlug) => {
        if (newSlug) {
          // do something
          store.dispatch("editor/load", { slug: newSlug }).then((e) => {
            if (E.isRight(e)) {
              initialValues.value = e.right;
              loaded.value = true;
            }
          });
        }
      },
      { immediate: true }
    );

    const onSave = (article: any) => {
      const payload = { article: {...article}}

      if (route.params.slug) {
        payload.article.slug = route.params.slug;
        store.dispatch("editor/edit", payload);
      } else {
        store.dispatch("editor/save", payload );
      }
    };

    return {
      slug,
      loaded,
      errors,
      inProgress,
      initialValues,
      onSave,
    };
  },
});
</script>

<style>
</style>