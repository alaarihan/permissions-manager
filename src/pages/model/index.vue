<template>
  <q-page class="fit row justify-center">
    <q-card class="col">
      <q-card-section>
        <Suspense>
          <template #default>
            <roles>
              <template v-slot:role-panel>
                <router-view></router-view>
              </template>
            </roles>
          </template>
          <template #fallback>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </template>
        </Suspense>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'quasar';
import { useRoute } from 'vue-router';
import Roles from 'components/Roles.vue';

export default defineComponent({
  name: 'Model',
  components: {
    Roles,
  },
  setup() {
    const route = useRoute();
    const metaData = () => {
      return {
        // sets document title
        title: route.params?.model as string,
      };
    };
    useMeta(metaData);
    const routeKeys = Object.keys(route.params);
    return { route, routeKeys };
  },
});
</script>
