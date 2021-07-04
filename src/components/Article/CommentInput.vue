<template>
  <form class="card comment-form" @submit.prevent="$emit('submit', body)">
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        v-model="body"
        rows="3"
      ></textarea>
    </div>

    <div class="card-footer">
      <img :src="imgSrc" class="comment-author-img" :alt="currentUser.username">
      <button class="btn btn-sm btn-primary" type="submit">
        Post Comment
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { User } from '../../types';

export default defineComponent({
  name: "comment-input",
  props: {
    currentUser: {
      type: Object as PropType<User>,
      required: true,
    }
  },
  emits: ["submit"],
  setup(props) {

    const body = ref<string>("")

    const imgSrc = computed(() => {
      return props.currentUser.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
    })
    
    return {
      imgSrc,
      body,
    };
  },
});
</script>

<style>
</style>