<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: '',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => `${title ? title + ' - ' : ''}Permissions Manager`,
};
export default {
  setup() {
    useMeta(metaData)
    return {
      
    };
  },
};
</script>
