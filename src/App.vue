<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Client, ClientOptions, createClient, provideClient } from '@urql/vue';
import { Cookies } from 'quasar';
let client: ClientOptions | Client;
const apiUrl = () => Cookies.get('apiUrl');
if (apiUrl()?.startsWith('http')) {
  client = createClient({
    url: apiUrl(),
    fetchOptions: { credentials: 'include' },
  });
}

export default defineComponent({
  name: 'App',
  setup() {
    if (apiUrl()?.startsWith('http')) {
      provideClient(client);
    }
  },
});
</script>
