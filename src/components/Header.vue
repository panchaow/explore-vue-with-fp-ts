<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        {{ appName }}
      </router-link>

      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <router-link to="/" class="nav-link"> Home </router-link>
        </li>
        <template v-if="isLoggedIn">
          <li class="nav-item">
            <router-link to="/editor" class="nav-link">
              <i class="ion-compose"></i>&nbsp;New Post
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/settings" class="nav-link">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="`/@${currentUser.value.username}`" class="nav-link">
              <img
                :src="
                  currentUser.value.image ||
                  'https://static.productionready.io/images/smiley-cyrus.jpg'
                "
                class="user-pic"
                :alt="currentUser.value.username"
              />
              {{ currentUser.value.username }}
            </router-link>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link to="/login" class="nav-link"> Sign in </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/register" class="nav-link"> Sign up </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { useConfig } from "../composables/useConfig";
import useCurrentUser from '../composables/useCurrentUser';
import useIsLoggedIn from '../composables/useIsLoggedIn';
import * as O from "fp-ts/Option";
import { constant, pipe, identity } from "fp-ts/function";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const config = useConfig();
    const currentUser = useCurrentUser();

    const isLoggedIn = useIsLoggedIn();

    const appName = pipe(
      config,
      O.map((config) => config.appName.toLowerCase()),
      O.fold(constant(""), identity)
    );

    return {
      appName,
      isLoggedIn,
      currentUser,
    };
  },
});
</script>

<style></style>
