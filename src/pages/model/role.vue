<template>
  <q-card>
    <q-tabs
      :modelValue="route.params.type"
      class="bg-primary text-white shadow-2"
      align="justify"
      exact
    >
      <q-route-tab
        name="READ"
        to="READ"
        icon="fas fa-check-square"
        label="Read"
      />
      <q-route-tab
        name="CREATE"
        to="CREATE"
        icon="fas fa-plus-square"
        label="Create"
      />
      <q-route-tab
        name="UPDATE"
        to="UPDATE"
        icon="fas fa-pen-square"
        label="Update"
      />
      <q-route-tab
        name="DELETE"
        to="DELETE"
        icon="fas fa-minus-square"
        label="Delete"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels :modelValue="route.params.type" animated>
      <q-tab-panel :name="route.params.type">
        <router-view></router-view>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Role',
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
});
</script>
