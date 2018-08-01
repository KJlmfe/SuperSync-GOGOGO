<template>
  <div class="hello">

    <div v-if="!gameState">
      <img class="cover"
           src="@/assets/superSyncGoGoGo.png" />
      <br/>

      <div v-if="!isJoin"
           class="button play-btn is-danger is-large"
           @click="joinGameRoom">Join Room ({{roomAddr.slice(-6).toUpperCase()}})</div>
      <div v-else
           class="title">Loading room data ... <br/>
        <span style="font-size:0.5em">
          If there is no response for a long time, please join other rooms
        </span>
      </div>
      <div class="stage-footer">
        Powered By <img src="https://pbs.twimg.com/media/DbMgP59UMAAd5a2.png">
      </div>
    </div>

    <h1 class="title">
      {{gameStateMsg}}
    </h1>

    <button class="button play-btn is-danger is-large"
            v-if="gameState === 'start'"
            @click="run">Click Me Go Go Go !!!
    </button>

    <Stage v-if="gameState"
           :players='players'
           :myAddr='myAddr' />
  </div>
</template>

<script>
import api from '@/api';
import Stage from '@/components/Stage';

export default {
  name: 'PlayerController',
  data() {
    return {
      myAddr: '',
      players: [],
      gameState: '',
      isJoin: false,
    };
  },
  components: {
    Stage,
  },
  computed: {
    roomAddr() {
      return this.$route.query.roomAddr;
    },
    gameStateMsg() {
      const msgMap = {
        '': '',
        wait: 'Waiting for other players to join',
        start: 'Click Go as fast as you can to win the game',
        end: 'Game End',
      };
      return msgMap[this.gameState];
    },
  },
  methods: {
    async joinGameRoom() {
      // eslint-disable-next-line
      let name = (prompt("Please enter your nickname :)") || "").trim();
      if (!name) {
        // eslint-disable-next-line
        alert("Sorry, You have to set a nickname before playing!");
        return;
      }
      name = name.slice(0, 5);

      const client = await api.createGameRoom();
      this.client = client;
      this.myAddr = client.addr;
      client.on('message', (src, payload) => {
        const { action, data } = JSON.parse(payload);
        if (action === 'sync') {
          this.gameState = data.gameState;
          this.players = data.players;
        }
      });
      this.send({
        action: 'join',
        data: { name, color: `#${client.addr.slice(-6)}` },
      });
      this.isJoin = true;
    },
    async send(payload) {
      this.client.send(this.roomAddr, JSON.stringify(payload));
    },
    async run() {
      this.send({ action: 'run', data: 1 });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
