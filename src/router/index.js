import Vue from 'vue';
import Router from 'vue-router';
import PlayStation from '@/components/PlayStation';
import PlayerController from '@/components/PlayerController';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PlayStation',
      component: PlayStation,
    },
    {
      path: '/play',
      name: 'PlayerController',
      component: PlayerController,
    },
  ],
});
