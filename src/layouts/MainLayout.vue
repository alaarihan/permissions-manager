<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar
            text-color="white"
            size="60px"
            icon="shield"
            style="height: 50px; width: 30px"
          >
          </q-avatar>
          Permissions Manager
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
    >
      <q-list>
        <q-item-label header class="text-grey-8"> Models </q-item-label>
        <Suspense>
          <template #default>
            <menu-items />
          </template>
          <template #fallback>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </template>
        </Suspense>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useMeta } from 'quasar';
import { ref } from 'vue';
import MenuItems from 'components/MenuItems.vue';
const metaData = {
  // sets document title
  title: '',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) =>
    `${title ? title + ' - ' : ''}Permissions Manager`,
};

export default {
  components: {
    MenuItems,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    useMeta(metaData);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
