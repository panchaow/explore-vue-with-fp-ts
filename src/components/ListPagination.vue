<template>
  <nav v-if="articlesCount > 10">
    <ul class="pagination">
      <li
        v-for="i in range"
        :key="i"
        :class="['page-item', { active: currentPage === i }]"
        @click.prevent="$emit('clickPage', i)"
      >
        <button type="button" class="page-link">
          {{ i + 1 }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "list-pagination",
  emits: ["clickPage"],
  props: {
    articlesCount: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const range = computed(() => {
      const ret = [];
      for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
        ret.push(i);
      }
      return ret;
    });

    return {
      range,
    };
  },
});
</script>

<style>
</style>