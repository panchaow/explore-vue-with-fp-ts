<template>
  <div class="article-meta">
    <router-link :to="profileUrl">
      <img :src="imageSrc" :alt="username">
    </router-link>
    <div class="info">
      <router-link :to="profileUrl" class="author">
        {{ username }}
      </router-link>
      <span class="date">
        {{ formattedDate }}
      </span>
    </div>
    <span v-if="canModify">
      <router-link :to="`/editor/${article.slug}`" class="btn btn-outline-secondary btn-sm">
        <i class="ion-edit"></i> Edit Article
      </router-link>

      <button class="btn btn-outline-danger btn-sm" @click="$emit('delete')">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import { Article } from '../../types';
import { computed, defineComponent, PropType } from "vue";
import * as O from 'fp-ts/Option';
import { pipe, constant } from 'fp-ts/function';

export default defineComponent({
  name: "article-meta",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    canModify: Boolean,
  },
  emits: ["delete"],
  setup(props) {
    console.log(props);
    // const profileUrl = computed(() => `/@${props.article.author.username}`)

    const username = computed(() => props.article.author.username)

    const profileUrl = computed(() => `/@${username.value}`)

    const imageSrc = computed(() => {
      return pipe(
        O.fromNullable( props.article.author.image),
        O.getOrElse(constant("https://static.productionready.io/images/smiley-cyrus.jpg"))
      )
    })

    const formattedDate = computed(() => new Date(props.article.createdAt).toDateString())

    const onDelete = () => {

    }

    return {
      username,
      profileUrl,
      imageSrc,
      formattedDate,
      onDelete,
    }
  }
});
</script>

<style>

</style>