<template>
  <div id="app">
    <b-loading :is-full-page="true"
               :active.sync="isLoading"></b-loading>
    <div class="stage">
      <router-view class="view" />
    </div>
  </div>
</template>

<script>
import emitter from '@/emitter';

export default {
  name: 'App',
  data: () => ({
    isLoading: false,
  }),
  methods: {
    alertError(err) {
      this.$dialog.alert({
        type: 'is-danger',
        title: '',
        message: `${err.message}<br/> <small><b>错误编码: </b>${err.code}</small>`,
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
      });
    },
    toggleActivityIndicator(isShow) {
      this.isLoading = isShow;
    },
  },
  created() {},
  mounted() {
    emitter.on('ALERT_ERROR', this.alertError);
    emitter.on('TOGGLE_ACTIVITY_INDICATOR', this.toggleActivityIndicator);
  },
  beforeDestroy() {
    emitter.removeListener('ALERT_ERROR', this.alertError);
    emitter.removeListener(
      'TOGGLE_ACTIVITY_INDICATOR',
      this.toggleActivityIndicator,
    );
  },
};
</script>

<style lang="less">
html, body {
  touch-action: manipulation;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  background: #FABB44;
  padding: 2%;
  text-align: center;
}
.stage {
  height: 100%;
  background: #F2F2F2;
  border: 5px solid #000;
  padding: 10px;
}
.stage-footer {
  padding-top: 50px;
  color: #000;
  font-weight: bold;
  font-size: 20px;
  img {
    width: 50px;
    position: relative;
    bottom: -15px;
  }
}
.cover {
  width: 70%;
  padding-top: 5%;
}
.play-btn {
  background: #feca53;
  border: 5px solid #000;
  color: #b8892c;
  font-weight: bold;
  border-radius: 8px;
}
</style>
