import { boot } from 'quasar/wrappers';
import { Cookies } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

export default boot(({ router, urlPath, redirect }) => {
  router.beforeEach((to, from, next) => {
    const apiUrl = Cookies.get('apiUrl');
    const authorized = Cookies.get('authorized');
    if (!apiUrl && urlPath !== '/') {
      redirect({ path: '/' });
    } else if (apiUrl && !authorized && urlPath !== '/auth/login') {
      redirect({ path: '/auth/login' });
    }
    next();
  });
});
