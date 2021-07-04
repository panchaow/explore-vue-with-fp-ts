<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>
    <div class="card-footer">
      <router-link :to="profileUrl" class="comment-author">
        <img :src="imgSrc" :alt="username" class="comment-author-img">
      </router-link>
      &nbsp;
      <router-link :to="profileUrl" class="comment-author">
        {{ username }}
      </router-link>
      <span class="date-posted">
        {{ formattedDate }}
      </span>
      <span v-if="showDelete" class="mod-options">
        <i class="ion-trash-a" @click="$emit('delete')"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Comment } from '../../types';
// import useStore from '../../composables/useStore';
import { defineComponent, PropType, computed } from "vue";
import * as O from 'fp-ts/Option';
import { pipe, constant } from 'fp-ts/function';

export default defineComponent({
  name: "comment",
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    },
    showDelete: Boolean,
  },
  emits: ["delete"],
  setup(props) {

    // const store = useStore();

    const imgSrc = computed(() => pipe(
      O.fromNullable(props.comment.author.image),
      O.getOrElse(constant("https://static.productionready.io/images/smiley-cyrus.jpg"))
    ))

    const username = computed(() => pipe(props.comment.author.username))

    const profileUrl = computed(() => `/@${username.value}`)

    const formattedDate = computed(() => new Date(props.comment.createdAt).toDateString())

    // const showDelete = computed(() => pipe(
    //   store.state.currentUser,
    //   O.map(user => user.username),
    //   O.fold(constant(false), (username) => username === props.comment.author.username)
    // ))

    // const onDelete = 

    return {
      imgSrc,
      username,
      profileUrl,
      formattedDate,
      // showDelete,
      // onDelete
    }
  }
});
</script>

<style>

</style>