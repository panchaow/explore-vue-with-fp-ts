<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Sign In
          </h1>
          <p class="text-xs-center">
            <router-link to="/register">Need an account?</router-link>
          </p>

          <list-errors :errors="errors"></list-errors>

          <login-form @submit="onLogin" :inProgress="inProgress"></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LoginForm from '../components/LoginForm.vue';
import ListErrors from '../components/ListErrors.vue';
import useStore from "../composables/useStore";
import { defineComponent, computed } from "vue";
import { useRouter } from 'vue-router';
import * as E from 'fp-ts/Either';

export default defineComponent({
  components: {
    LoginForm,
    ListErrors
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const inProgress = computed(() => store.state.login.inProgress)
    const errors = computed(() => store.state.login.errors)

    const onLogin = (payload: any) => {
      store.dispatch("login", payload).then(e => {
        if(E.isRight(e)) {
          router.push("/")
        }
      })
    }

    return {
      onLogin,
      inProgress,
      errors,
    }
  }
});
</script>

<style>

</style>