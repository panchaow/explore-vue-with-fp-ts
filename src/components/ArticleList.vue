<template>
  <div v-if="loading">
    <div class="article-preview">Loading...</div>
  </div>
  <div v-else-if="!articles || articles.length === 0">
    No Articles...
  </div>
  <div v-else>
    <article-preview
      v-for="article in articles"
      :key="article.slug"
      :article="article"
      @favorite="onFavorite(article.slug)"
      @unfavorite="onUnfavorite(article.slug)"
    />

    <list-pagination
      :articlesCount="articlesCount"
      :currentPage="page"
      @clickPage="onGoPage"
    />
  </div>
</template>

<script lang="ts">
import ListPagination from "./ListPagination.vue";
import ArticlePreview from "./ArticlePreview.vue";
import useStore from "../composables/useStore";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "article-list",
  components: {
    ListPagination,
    ArticlePreview,
  },
  emits: ["favorite", "unfavorite"],
  setup() {
    const store = useStore();
    const loading = computed(() => store.state.articles.loading);
    const articles = computed(() => store.state.articles.articles);
    const articlesCount = computed(() => store.state.articles.articlesCount);
    const page = computed(() => store.state.articles.page);

    const onFavorite = (slug: string) => {
      store.dispatch("articles/favorite", { slug });
    };

    const onUnfavorite = (slug: string) => {
      store.dispatch("articles/unfavorite", { slug });
    };

    const onGoPage = (page: number) => {
      store.dispatch("articles/goPage", { page } )
    };

    return {
      loading,
      articles,
      articlesCount,
      page,
      onFavorite,
      onUnfavorite,
      onGoPage,
    };
  },
});
</script>
<style>
</style>