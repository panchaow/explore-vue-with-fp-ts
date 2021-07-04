<template>
  <div v-if="!loading && !!profile" class="profile-page">
    <user-info
      :profile="profile"
      :isUser="isUser"
      @follow="onFollow"
      @unfollow="onUnfollow"
    ></user-info>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="`/@${profile.username}`"
                  exact-active-class="active"
                >
                  MyArticles
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="`/@${profile.username}/favorites`"
                  active-class="active"
                >
                  Favorited Articles
                </router-link>
              </li>
            </ul>
          </div>

          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserInfo from "../components/Profile/UserInfo.vue";
import useStore from "../composables/useStore";
import { defineComponent, computed, watch } from "vue";
import { useRoute } from "vue-router";
import * as O from "fp-ts/Option";
import { Eq as eqString } from "fp-ts/string";
import { pipe } from "fp-ts/function";

export default defineComponent({
  components: {
    UserInfo,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const loading = computed(() => store.state.profile.loading);
    const profile = computed(() => store.state.profile.profile);

    const rawProfile = computed(() => O.toNullable(profile.value))

    const isUser = computed(() => {
      return O.getEq(eqString).equals(
        pipe(
          store.state.currentUser,
          O.map((u) => u.username)
        ),
        pipe(
          profile.value,
          O.map((x) => x.username)
        )
      );
    });

    const onFollow = () => {
      store.dispatch("profile/follow");
    };

    const onUnfollow = () => {
      store.dispatch("profile/unfollow");
    };

    watch(
      () => route.params.username,
      (newUsername) => {
        if (newUsername) {
          store.dispatch("profile/init", { username: newUsername });
        }
      },
      { immediate: true}
    );

    return {
      profile: rawProfile,
      isUser,
      loading,
      onFollow,
      onUnfollow,
    };
  },
});
</script>

<style>
</style>