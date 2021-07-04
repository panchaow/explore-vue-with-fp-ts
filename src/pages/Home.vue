<template>
  <div class="home-page">
    <banner v-if="!isLoggedIn" />
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="isLoggedIn" class="nav-item">
                <button
                  type="button"
                  :class="['nav-link', { active: filter.type === 'feed' }]"
                  @click="onChangeTab('feed')"
                >
                  Your Feed
                </button>
              </li>
              <li class="nav-item">
                <button
                  type="button"
                  :class="['nav-link', { active: filter.type === 'all' }]"
                  @click="onChangeTab('all')"
                >
                  Global Feed
                </button>
              </li>
              <li v-if="filter.type === 'tag'" class="nav-item">
                <button type="button" class="nav-link active">
                  <i class="ion-pound" /> {{ tag.value }}
                </button>
              </li>
            </ul>
          </div>
          <article-list />
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <tags :loading="loadingTags" :tags="tags" @selectTag="onSelectTag" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ArticleList from "../components/ArticleList.vue";
import Banner from "../components/Home/Banner.vue";
import Tags from "../components/Home/Tags.vue";
import useStore from "../composables/useStore";
import useIsLoggedIn from '../composables/useIsLoggedIn';
import { defineComponent, computed, ref, onMounted } from "vue";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

export default defineComponent({
  components: {
    ArticleList,
    Banner,
    Tags,
  },
  setup() {
    const store = useStore();

    const loadingTags = computed(() => store.state.home.loadingTags);
    const tags = computed(() => store.state.home.tags);


    const tab = ref<O.Option<"all" | "feed">>(O.of("all"));
    const tag = ref<O.Option<string>>(O.none);

    const filter = computed(() => {
      const filterO = pipe(
        tag.value,
        O.map((t) => ({ type: "tag" as const, value: t })),
        O.altW(() =>
          pipe(
            tab.value,
            O.map((t) => ({ type: t }))
          )
        )
      );

      if (O.isNone(filterO)) {
        throw new Error("must filter by something");
      }

      return filterO.value;
    });

    const isLoggedIn = useIsLoggedIn();

    const onSelectTag = (t: string) => {
      tag.value = O.of(t);
      tab.value = O.none;
    };

    const onChangeTab = (t: "all" | "feed") => {
      tab.value = O.of(t);
      tag.value = O.none;
    };

    onMounted(() => {
      store.dispatch("articles/fetchArticles", { filter: filter.value });

      store.dispatch("home/loadTags",)
    });

    return { tags, loadingTags, tab, tag,  filter, isLoggedIn, onChangeTab, onSelectTag };
  },
});
</script>

<style></style>
