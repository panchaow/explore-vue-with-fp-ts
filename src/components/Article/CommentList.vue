<template>
  <div>
    <comment
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :showDelete="showDelete(comment)"
      @delete="$emit('delete', comment.id)"
    >
    </comment>
  </div>
</template>

<script lang="ts">
import { User, Comment } from "../../types";
import CommentComp from "./Comment.vue";
import { defineComponent, PropType } from "vue";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";

export default defineComponent({
  components: {
    Comment: CommentComp,
  },
  props: {
    comments: {
      type: Object as PropType<Comment[]>,
      default() {
        return [];
      },
    },
    currentUser: {
      type: Object as PropType<User>,
    },
  },
  emits: ["delete"],
  setup(props: any) { // vue bug
    const showDelete = (comment: Comment) => {
      return pipe(
        O.fromNullable(props.currentUser),
        O.map(user => user.username === comment.author.username),
        O.getOrElse(constant(false))
      )
    };

    return {
      showDelete,
    };
  },
});
</script>

<style>
</style>