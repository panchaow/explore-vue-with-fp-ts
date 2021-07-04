<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="profilePath">
        <img :src="imageUrl" />
      </router-link>

      <div class="info">
        <router-link class="author" :to="profilePath">
          {{ article.author.username }}
        </router-link>
        <span class="date">
          {{ formattedDate }}
        </span>
      </div>

      <div class="pull-xs-right">
        <button :class="favoriteButtonClass" @click="onFavoriteClick">
          <i class="ion-heart"></i> {{ article.favoritesCount }}
        </button>
      </div>
    </div>

    <router-link :to="articlePath" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li
          v-for="tag in article.tagList"
          :key="tag"
          className="tag-default tag-pill tag-outline"
        >
          {{ tag }}
        </li>
      </ul>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Article } from "../types";
import { computed, defineComponent, PropType } from "vue";
import * as O from "fp-ts/Option";
import * as B from "fp-ts/boolean";
import { pipe, constant } from "fp-ts/function";

const FAVORITED_CLASS = constant("btn btn-sm btn-primary");
const NOT_FAVORITED_CLASS = constant("btn btn-sm btn-outline-primary");

const formatDate = (date: string) => new Date(date).toDateString();

export default defineComponent({
  name: "article-preview",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  emits: ["favorite", "unfavorite"],
  setup(props, { emit }) {
    const imageUrl = computed(() =>
      pipe(
        props.article.author.image,
        O.fromNullable,
        O.getOrElse(
          constant("https://static.productionready.io/images/smiley-cyrus.jpg'")
        )
      )
    );

    const profilePath = computed(() => `/@${props.article.author.username}`);

    const articlePath = computed(() => `/article/${props.article.slug}`);

    const formattedDate = computed(() =>
      pipe(props.article.createdAt, formatDate)
    );

    const favoriteButtonClass = computed(() =>
      pipe(
        props.article.favorited,
        B.fold(FAVORITED_CLASS, NOT_FAVORITED_CLASS)
      )
    );

    const onFavoriteClick = (e: MouseEvent) => {
      e.preventDefault();

      const toggleFavorite = pipe(
        props.article.favorited,
        B.fold(
          constant(() => emit("favorite")),
          constant(() => emit("unfavorite"))
        )
      );

      return toggleFavorite();
    };

    return {
      imageUrl,
      profilePath,
      articlePath,
      formattedDate,
      favoriteButtonClass,
      onFavoriteClick,
    };
  },
});
</script>

<style>
</style>