<template>
    <q-page class="flex flex-center">
        <q-card square style="width: 400px; padding: 30px">
            <q-card-section class="q-pt-none">
                <div class="text-h6 text-center">Settings</div>
            </q-card-section>
            <q-form @submit="saveSettings" class="q-gutter-md">
                <q-input
                    filled
                    v-model="settings.apiUrl"
                    label="API URL *"
                    lazy-rules
                    :rules="[
                        (val: String) =>
                            (val && val.length > 0 && val.startsWith('http')) ||
                            'Please enter a valid API URL!',
                    ]"
                />
                <q-input
                    filled
                    v-model="settings.queryMap.findUniquePermission"
                    label="findUniquePermission"
                    lazy-rules
                    :rules="[
                        (val: String) =>
                            (!!val) ||
                            'This field is required!',
                    ]"
                />
                <q-input
                    filled
                    v-model="settings.queryMap.createOnePermission"
                    label="createOnePermission"
                    lazy-rules
                    :rules="[
                        (val: String) =>
                            (!!val) ||
                            'This field is required!',
                    ]"
                />
                <q-input
                    filled
                    v-model="settings.queryMap.updateOnePermission"
                    label="updateOnePermission"
                    lazy-rules
                    :rules="[
                        (val: String) =>
                            (!!val) ||
                            'This field is required!',
                    ]"
                />
                <div>
                    <q-btn label="Submit" type="submit" color="primary" />
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cookies, useMeta, useQuasar } from 'quasar';
const metaData = {
    // sets document title
    title: 'Settings',
};
export default defineComponent({
    name: 'Settings',
    setup() {
        const $q = useQuasar();
        const apiUrlCookie = () => Cookies.get('apiUrl');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const settings = ref({ queryMap: {} } as any);
        if (localStorage.getItem('settings')) {
            settings.value = JSON.parse(localStorage.getItem('settings') as string)
        } else {
            settings.value = {
                apiUrl: apiUrlCookie(),
                queryMap: {
                    findUniquePermission: 'findUniquePermission',
                    createOnePermission: 'createOnePermission',
                    updateOnePermission: 'updateOnePermission'
                }
            }
        }
        if (apiUrlCookie()?.startsWith('http')) {
            settings.value.apiUrl = apiUrlCookie();
        }
        useMeta(metaData);

        function saveSettings() {
            Cookies.set('apiUrl', settings.value.apiUrl, {
                expires: 60 * 60 * 24 * 14,
                path: '/',
            });
            localStorage.setItem('settings', JSON.stringify(settings.value))
            $q.notify({
                type: 'positive',
                message: 'Settings has been saved successfully',
            });
        }
        return {
            settings,
            saveSettings,
        };
    },
});
</script>
