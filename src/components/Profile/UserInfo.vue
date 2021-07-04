<template>
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="imgSrc" class="user-img" :alt="profile.username" />
          <h4>{{ profile.username }}</h4>
          <p>{{ profile.bio }}</p>
          <router-link
            v-if="isUser"
            to="/settings"
            class="btn btn-sm btn-outline-secondary action-btn"
          >
            <i class="ion-gear-a"></i> Edit Profile Settings
          </router-link>
          <button
            v-else
            :class="[
              'btn btn-sm action-btn',
              {
                'btn-secondary': profile.following,
                'btn-outline-secondary': !profile.following,
              },
            ]"
            @click.prevent="onClickFollow"
          >
            <i class="ion-plus-round"></i>
            &nbsp;
            {{ profile.following ? "Unfollow" : "Follow" }} {{ profile.username }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Profile } from "../../types";

export default defineComponent({
  name: "user-info",
  props: {
    isUser: Boolean,
    profile: {
      type: Object as PropType<Profile>,
      required: true,
    },
  },
  emits: ["follow", "unfollow"],
  setup(props, { emit }) {
    const imgSrc = computed(
      () =>
        props.profile.image ||
        "https://static.productionready.io/images/smiley-cyrus.jpg"
    );

    const onClickFollow = () => {
      if(props.profile.following) {
        emit("unfollow")
      } else {
        emit("follow")
      }
    }

    return {
      imgSrc,
      onClickFollow
    };
  },
});
</script>

<style>
</style>