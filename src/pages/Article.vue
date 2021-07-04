<template>
  <div v-if="!loading && !!article" class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta
          :article="article"
          :canModify="canModify"
          @delete="onDelete"
        />
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <div v-html="markup"></div>

          <div class="tag-list">
            <div
              v-for="tag in article.tagList"
              :key="tag"
              class="tag-default tag-pill tag-outline"
            >
              {{ tag }}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="article-actions"></div>

      <div class="row">
        <comment-container :slug="slug"> </comment-container>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useStore from "../composables/useStore";
import ArticleMeta from "../components/Article/ArticleMeta.vue";
import CommentContainer from "../components/Article/CommentContainer.vue";
import {
  computed,
  defineComponent,
  onMounted,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import marked from "marked";
import DOMPurify from "dompurify";
import * as O from "fp-ts/Option";
import * as E from 'fp-ts/Either';
import { Eq as eqString } from "fp-ts/string";
import { constant, pipe } from "fp-ts/function";

export default defineComponent({
  components: {
    ArticleMeta,
    CommentContainer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const slug = computed(() => route.params.slug);

    const article = computed(() => store.state.article.article);

    const rawArticle = computed(() => O.toUndefined(article.value));

    const markup = computed(() => {
      return pipe(
        article.value,
        O.map((article) =>
          marked(article.body, { sanitizer: DOMPurify.sanitize })
        ),
        O.getOrElse(constant(""))
      );
    });

    const canModify = computed(() => {
      return O.getEq(eqString).equals(
        pipe(
          store.state.currentUser,
          O.map((u) => u.username)
        ),
        pipe(
          article.value,
          O.map((x) => x.author.username)
        )
      );
    });

    const loading = computed(() => store.state.article.loading);

    onMounted(() => {
      watch(
        () => slug.value,
        (newSlug) => {
          if (newSlug) {
            store.dispatch("article/init", { slug: newSlug });
          }
        },
        { immediate: true }
      );
    });

    // onBeforeRouteLeave(() => )

    const onDelete = (id: number) => {
      store.dispatch("article/delArticle", { id }).then((e) => {
        if(E.isRight(e)) {
          router.push("/")
        }
      });
    };

    return {
      slug,
      article: rawArticle,
      markup,
      loading,
      canModify,
      onDelete,
    };
  },
});
</script>

<style>
</style>