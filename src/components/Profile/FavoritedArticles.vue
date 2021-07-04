<template>
  <article-list></article-list>
</template>

<script lang="ts">
import useStore from "../../composables/useStore";
import ArticleList from "../ArticleList.vue";
import { defineComponent, watch } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    ArticleList,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    watch(
      () => route.params.username,
      (newUsername) => {
        store.dispatch("articles/fetchArticles", {
          filter: { type: "favorited", value: newUsername },
        });
      },
      { immediate: true }
    );
  },
});
</script>

<style>
</style>