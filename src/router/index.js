import Vue from 'vue';
import Router from 'vue-router';

import Chart from '../components/Chart';
import Table from '../components/Table';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'table',
      path: '/',
      component: Table,
    },
    {
      name: 'chart',
      path: '/chart',
      component: Chart,
      props: true,
    },
  ],
});
