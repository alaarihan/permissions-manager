<template>
  <q-form @submit="savePerm" class="q-gutter-md">
    <q-checkbox v-model="perm.active" label="Active" />
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        v-if="$route.params.type !== 'DELETE'"
        v-model="sections.columns"
        expand-separator
        icon="view_column"
        label="Columns"
        :caption="sectionsCap.columns"
      >
        <q-card class="q-pb-sm">
          <q-card-section>
            <q-option-group
              v-model="perm.def.columns"
              :options="columns"
              type="checkbox"
              color="primary"
              inline
              dense
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item
        v-model="sections.ops"
        expand-separator
        icon="read_more"
        label="Additional Actions"
        caption="Show/Hide additional actions"
      >
        <q-card>
          <q-card-section>
            <q-option-group
              v-model="perm.def.ops"
              :options="ops"
              type="checkbox"
              color="primary"
              inline
              dense
            />
            <v-template
              v-if="
                $route.params.type === 'CREATE' || $route.params.type === 'UPDATE'
              "
            >
              <div
                v-for="field in activeObjectFields"
                :key="field.name"
                class="q-mt-md"
              >
                <q-separator />
                <div class="text-subtitle1 text-weight-bold q-pt-sm">
                  {{ field.name }} field nested actions
                </div>
                <q-option-group
                  v-if="perm.def.objectFieldsOps"
                  v-model="perm.def.objectFieldsOps[field.name]"
                  :options="
                    $route.params.type === 'CREATE'
                      ? objectFieldsOps.CREATE
                      : objectFieldsOps.UPDATE
                  "
                  type="checkbox"
                  color="primary"
                  inline
                  dense
                />
              </div>
            </v-template>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item
        v-model="sections.check"
        expand-separator
        icon="verified"
        label="Check"
        :caption="sectionsCap.check"
      >
        <q-card class="q-pb-sm">
          <q-card-section>
            <q-input
              v-model="perm.def.check"
              filled
              autogrow
              hint='You can use "ctx-userId" as value to match with the context user id. Example: {"userId": "ctx-userId"}'
              :rules="[validateJson]"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item
        v-if="$route.params.type === 'CREATE' || $route.params.type === 'UPDATE'"
        v-model="sections.set"
        expand-separator
        icon="auto_awesome"
        label="Set"
        caption="Set default fields values"
      >
        <q-card class="q-pb-sm">
          <q-card-section>
            <q-input
              v-model="perm.def.set"
              filled
              autogrow
              hint='You can use "ctx-userId" as value to match with the context user id. Example: {"userId": "ctx-userId"}'
              :rules="[validateJson]"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div>
      <q-btn label="Save" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMutation, useQuery } from '@urql/vue';
import clone from 'just-clone';
let settings;
if(localStorage.getItem('settings')){
settings = JSON.parse(localStorage.getItem('settings'))
} else{
  settings = {
     queryMap: {
        findUniquePermission: 'findUniquePermission',
        createOnePermission: 'createOnePermission',
        updateOnePermission: 'updateOnePermission'
    }
  }
}

export default defineComponent({
  name: 'Type',
  setup() {
    const route = useRoute();
    const $q = useQuasar();
    const permQuery = useQuery({
      query: `
        query ($where: PermissionWhereUniqueInput!) {
          perm:${settings?.queryMap.findUniquePermission}(where: $where){
            id
            active
            role
            model
            type
            def
          }
        }
      `,
      variables: {
        where: {
          role_type_model: {
            role: route.params.role,
            model: route.params.model,
            type: route.params.type,
          },
        },
      },
    });
    const modelQuery = useQuery({
      query: `
         query ($where: ModelWhereInput!) {
          models:findManyModel(where: $where) {
            name
            fields{
              name
              kind
              type
              isList
            }
          }
        }
      `,
      variables: {
        where: {
          name: {
            equals: route.params.model,
          },
        },
      },
    });
    const emptyPerm = {
      id: null,
      active: false,
      def: {
        columns: [],
        check: '',
        set: '',
        ops: [],
        objectFieldsOps: {},
      },
    };
    const perm = ref(emptyPerm);
    const model = ref({});
    const columns = ref([]);
    onMounted(async () => {
      const modelRes = await modelQuery.executeQuery({
        requestPolicy: 'network-only',
      });
      if (modelRes.error.value) {
        $q.notify({
          type: 'negative',
          message: `Couldn't fetch model fields from the db! (${modelRes.error.value})`,
        });
      }
      if (modelRes.data?.value) {
        model.value = modelRes.data.value.models[0];
        columns.value = modelRes.data.value.models[0].fields.map(
          (field) => {
            return { label: field.name, value: field.name };
          }
        );
      }
      const { data, error } = await permQuery.executeQuery({
        requestPolicy: 'network-only',
      });
      if (error.value) {
        $q.notify({
          type: 'negative',
          message: `Couldn't fetch permission from the db! (${error.value})`,
        });
      }
      if (data?.value) {
        perm.value = data.value.perm;
        if (!perm.value?.def) {
          perm.value = emptyPerm;
        }
        if (!perm.value.def?.columns && route.params.type !== 'DELETE') {
          perm.value.def.columns = [];
        }
        if (perm.value.def?.check) {
          perm.value.def.check = JSON.stringify(perm.value.def.check);
        }
        if (perm.value.def?.set) {
          perm.value.def.set = JSON.stringify(perm.value.def.set);
        }
        if (!perm.value?.def?.ops) {
          perm.value.def.ops = [];
        }
        if (['CREATE', 'UPDATE'].includes(route.params.type)) {
          perm.value.def.objectFieldsOps = getObjectFieldsOps(
            perm.value.def.objectFieldsOps
          );
        } else {
          delete perm.value.def.objectFieldsOps;
        }
      }
    });

    const createPermMutation = useMutation(
      ` mutation ($data: PermissionCreateInput!) {
        perm:${settings.queryMap.createOnePermission}(data: $data){
          id
          active
          role
          model
          type
          def
        }
    }
    `
    );
    const updatePermMutation = useMutation(
      ` mutation ($where: PermissionWhereUniqueInput!, $data: PermissionUpdateInput!) {
        perm:${settings.queryMap.updateOnePermission}(where: $where, data: $data){
          id
          active
          role
          model
          type
          def
        }
    }
    `
    );

    async function savePerm() {
      $q.loading.show({
        delay: 400, // ms
      });

      let savePermRes;

      const permToSave = clone(perm.value);
      if (permToSave.def.check) {
        permToSave.def.check = JSON.parse(permToSave.def.check);
      }
      if (permToSave.def.set) {
        permToSave.def.set = JSON.parse(permToSave.def.set);
      }
      if (!permToSave.id) {
        const newPerm = {
          role: route.params.role,
          model: route.params.model,
          type: route.params.type,
          def: permToSave.def,
        };
        savePermRes = await createPermMutation.executeMutation({
          data: newPerm,
        });
      } else {
        const variables = {
          where: { id: permToSave.id },
          data: { active: permToSave.active, def: permToSave.def },
        };
        savePermRes = await updatePermMutation.executeMutation(variables);
      }
      $q.loading.hide();

      if (savePermRes?.data?.perm?.id) {
        $q.notify({
          type: 'positive',
          message: 'Permission has been saved successfully',
        });
        // perm.value = savePermRes.data.perm;
      } else {
        $q.notify({
          type: 'negative',
          message: 'Could not save the permission!',
        });
      }
    }

    const sections = ref({ ops: true, columns: true, check: true, set: true });

    function validateJson(val) {
      if (!val) return true;
      try {
        JSON.parse(val);
      } catch (e) {
        return 'Invalid JSON';
      }
      return true;
    }

    const sectionsCap = {
      check:
        route.params.type === 'READ'
          ? 'Filter results'
          : `Check before ${route.params.type}`,
      columns:
        route.params.type === 'READ'
          ? 'Show/Hide columns'
          : `Allow/Prevent ${route.params.type} columns`,
    };
    const actionsOps = {
      READ: ['findFirst', 'findMany', 'count', 'aggregate', 'subscription'],
      CREATE: ['createMany'],
      UPDATE: ['updateMany'],
      DELETE: ['deleteMany'],
    };
    const ops = actionsOps[route.params.type].map((item) => {
      return { label: item, value: item };
    });
    const objectFields = computed(
      () =>
        model.value?.fields?.filter(
          (field) => field.kind === 'object'
        ) || []
    );

    const activeObjectFields = computed(
      () =>
        model.value?.fields?.filter(
          (field) =>
            field.kind === 'object' &&
            perm?.value?.def?.columns?.includes(field.name)
        ) || []
    );

    function getObjectFieldsOps(
      defaultVal
    ) {
      const defaultOps = defaultVal || {};
      objectFields.value.forEach((field) => {
        if (!defaultOps[field.name]) {
          defaultOps[field.name] = [];
        }
      });
      return defaultOps;
    }

    const objectFieldsOps = {
      CREATE: [
        { label: 'connect', value: 'connect' },
        { label: 'connectOrCreate', value: 'connectOrCreate' },
      ],
      UPDATE: [
        { label: 'connect', value: 'connect' },
        { label: 'disconnect', value: 'disconnect' },
        { label: 'set', value: 'set' },
        { label: 'connectOrCreate', value: 'connectOrCreate' },
      ],
    };

    return {
      perm,
      model,
      columns,
      savePerm,
      sections,
      validateJson,
      sectionsCap,
      ops,
      activeObjectFields,
      objectFieldsOps,
    };
  },
});
</script>
