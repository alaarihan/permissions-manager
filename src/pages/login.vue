<template>
  <q-page class="flex flex-center">
    <q-card square style="width: 400px; padding: 30px">
      <q-card-section class="q-pt-none">
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-form @submit="doLogin">
        <q-card-section>
          <q-input
            id="secret"
            v-model="loginSecret"
            type="password"
            label="Root Secret"
            required
            @keyup.enter="doLogin"
            hide-bottom-space
            class="q-pb-sm"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" type="submit"> Login </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { useMutation } from '@urql/vue';
import { useQuasar, Cookies, useMeta } from 'quasar';
const metaData = {
  title: 'Login',
};
export default defineComponent({
  name: 'Login',
  setup() {
    useMeta(metaData);
    let loginSecret = ref('');
    const $q = useQuasar();
    const loginMutation = useMutation(
      ` mutation ($secret: String!) {
        login:loginByRootSecret(secret: $secret)
    }
    `
    );
    async function doLogin() {
      $q.loading.show({
        delay: 400, // ms
      });
      const variables = { secret: loginSecret.value };
      const loginRes = await loginMutation.executeMutation(variables);
      $q.loading.hide();
      if (loginRes?.data?.login === true) {
        Cookies.set('authorized', 'true', {
          expires: 60 * 60 * 24 * 13,
          path: '/',
        });
        window.location.replace('/');
      } else {
        $q.notify({
          type: 'negative',
          message: 'Wrong secret key!',
        });
      }
    }
    return { loginSecret, doLogin };
  },
});
</script>
