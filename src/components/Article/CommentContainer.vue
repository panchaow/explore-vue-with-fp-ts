<template>
  <div v-if="isLoggedIn" class="col-xs-12 col-md-8 offset-md-2">
    <div>
      <list-errors :errors="errors"></list-errors>
      <comment-input :currentUser="currentUser.value" @submit="onCreateComment">
      </comment-input>
    </div>
    <comment-list
      :currentUser="currentUser.value"
      :comments="comments"
      @delete="onDeleteComment"
    ></comment-list>
  </div>
  <div v-else class="col-xs-12 col-md-8 offset-md-2">
    <p>
      <router-link to="/login">Sign in</router-link>
      &nbsp;or&nbsp;
      <router-link to="/register">sign up</router-link>
      &nbsp;to add comments on this article.
    </p>

    <comment-list :comments="comments" @delete="onDeleteComment">
    </comment-list>
  </div>
</template>

<script lang="ts">
import useStore from "../../composables/useStore";
import useCurrentUser from "../../composables/useCurrentUser";
import useIsLoggedIn from "../../composables/useIsLoggedIn";
import ListErrors from "../ListErrors.vue";
import CommentList from "./CommentList.vue";
import CommentInput from "./CommentInput.vue";
import { defineComponent, computed } from "vue";

export default defineComponent({
  components: {
    CommentList,
    ListErrors,
    CommentInput,
  },
  props: {
    slug: { type: String, required: true },
  },
  setup() {
    const store = useStore();

    const currentUser = useCurrentUser();

    const isLoggedIn = useIsLoggedIn();

    const errors = computed(() => store.state.article.errors);

    const comments = computed(() => store.state.article.comments);

    const onCreateComment = (body: string) => {
      store.dispatch("article/createComment", { body });
    };

    const onDeleteComment = (id: number) => {
      store.dispatch("article/deleteComment", { id });
    };

    return {
      isLoggedIn,
      errors,
      comments,
      currentUser,
      onCreateComment,
      onDeleteComment,
    };
  },
});
</script>

<style>
</style>