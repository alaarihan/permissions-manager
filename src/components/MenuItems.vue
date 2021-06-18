<template>
  <q-item
    v-for="link in models"
    clickable
    tag="a"
    :to="`/model/${link.name}`"
    :key="link.name"
  >
    <q-item-section avatar>
      <q-icon :name="itemIcon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { useQuery } from '@urql/vue';
import { useQuasar } from 'quasar';
export default {
  name: 'MenuItems',
  async setup() {
    const $q = useQuasar();
    const itemIcon = 'code'
    const { data, error } = await useQuery({
      query: `
        {
          models:findManyModel {
            name
          }
        }
      `,
    });
    if(error.value){
        $q.notify({
        type: 'negative',
        message: `Couldn't fetch menu items! (${error.value})`,
      });
    }
    const models = data.value.models
    return {
      models,
      itemIcon,
    };
  },
};
</script>
