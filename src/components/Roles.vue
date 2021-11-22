<template>
  <q-splitter v-model="splitterModel" unit="px" :horizontal="$q.screen.lt.sm">
    <template v-slot:before>
      <h4 class="q-mt-none q-mb-sm text-center">Roles</h4>
      <q-separator />
      <q-tabs vertical :modelValue="$route.params.role">
        <q-route-tab
          v-for="role in roles"
          :key="role"
          icon="account_box"
          :to="`/model/${$route?.params?.model}/${role}`"
          :name="role"
          :label="role"
        />
      </q-tabs>
    </template>

    <template v-slot:after>
      <q-breadcrumbs class="q-px-md">
        <template v-slot:separator>
          <q-icon size="1.2em" name="arrow_forward" color="purple" />
        </template>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el
          v-for="k in routeKeys()"
          :key="k"
          :label="$route.params[k]"
          icon="widgets"
        />
      </q-breadcrumbs>
      <q-tab-panels
        :modelValue="$route.params.role"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel v-for="role in roles" :key="role" :name="role">
          <slot name="role-panel"> slot </slot>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@urql/vue';

export default defineComponent({
  name: 'Roles',
  async setup() {
    const $q = useQuasar();
    const route = useRoute();
    const { data, error } = await useQuery({
      query: `
        {
          roles:findUserRoles
        }
      `,
    });
    if (error.value) {
      $q.notify({
        type: 'negative',
        message: `Couldn't fetch roles! (${error.value})`,
      });
    }
    const roles = data.value.roles.filter(
      (role) => !['ROOT', 'BLOCKED'].includes(role)
    );
    const splitterModel = ref(170);
    const routeKeys = () => Object.keys(route.params);
    return {
      tab: ref(''),
      roles,
      splitterModel,
      routeKeys,
    };
  },
});
</script>
