<template>
  <q-page class="flex flex-center">
    <q-card v-if="!hasApiUrl" square style="width: 400px; padding: 30px">
      <q-card-section class="q-pt-none">
        <div class="text-h6 text-center">API URL</div>
      </q-card-section>
      <q-form @submit="saveApiUrl" class="q-gutter-md">
        <q-input
          filled
          v-model="apiUrl"
          label="API URL *"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0 && val.startsWith('http')) ||
              'Please enter a valid API URL!',
          ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
    <div v-else class="text-center">
      <h4>Permissions Manager</h4>
      <img
        alt="logo"
        src="~assets/logo.png"
        style="width: 200px; height: 200px"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cookies, useMeta } from 'quasar';
const metaData = {
  // sets document title
  title: 'Home',
};
export default defineComponent({
  name: 'Home',
  setup() {
    const apiUrlCookie = () => Cookies.get('apiUrl');
    const apiUrl = ref('');
    if (apiUrlCookie()?.startsWith('http')) {
      apiUrl.value = apiUrlCookie();
    }
    useMeta(metaData);

    function saveApiUrl() {
      Cookies.set('apiUrl', apiUrl.value, {
        expires: 60 * 60 * 24 * 14,
        path: '/',
      });
      window.location.replace('/');
    }
    return {
      hasApiUrl: apiUrlCookie()?.startsWith('http'),
      apiUrl,
      saveApiUrl,
    };
  },
});
</script>
