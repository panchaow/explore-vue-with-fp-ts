<template>
  <div v-if="loading">
    Loading Tags...
  </div>
  <div v-else-if="tags.length > 0" class="tag-list">
    <button v-for="tag in tags" :key="tag" type="button" class="tag-default tag-pill" @click.prevent="$emit('selectTag', tag)">
      {{ tag }}
    </button>
  </div>
  <div v-else>Nothing to show!</div>
</template>

<script lang="ts">
import {  Tag } from '../../types';
import { defineComponent, PropType } from "vue";

export default defineComponent({
  emits: ["selectTag"],
  props: {
    tags: {
      type: Object as PropType<Tag[]>,
      default() {
        return []
      }
    },
    loading: Boolean
  }
});
</script>

<style>

</style>