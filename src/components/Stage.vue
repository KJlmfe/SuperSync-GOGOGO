<template>
  <div class="pxx">
    <div class="players-container">
      <div class="player"
           v-for="(player) in players"
           :key="player.addr">
        <div class="bar"
             v-bind:style="{background: player.color, width: player.score + '%'}">
        </div>
        <h2 class="player-name">{{player.name + (myAddr === player.addr ? ' (You)' : '')}}
          <span v-if="player.win"
                style="color:red;font-size:1.5em">Win</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stage',
  props: ['players', 'myAddr'],
  computed: {
    roomAddr() {
      return this.$route.query.roomAddr;
    },
  },
};
</script>

<style scoped>
.players-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.player {
  flex-grow: 1;
  margin: 10px;
}
.bar {
  height: 24px;
  border-radius: 12px;
  float: left;
}
.player-name {
  padding: 0 10px;
  background: none;
  font-size: 17px;
  font-weight: 600;
  border-radius: 6px;
  line-height: 24px;
  color: black;
  float: left;
}
</style>
