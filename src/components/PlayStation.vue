<template>
  <div>

    <div v-if="gameState === 'wait'"
         class="gameRoomLink">
      <div class="title">Please scan QRCode or open
        <a target="_blank"
           :href='roomLink'>Room Link</a> to enter Room ({{roomAddr.slice(-6).toUpperCase()}})</div>
      <qrcode :value="roomLink"
              :options="{ size: 330 }"></qrcode>
      <br>
      <div class="button play-btn is-danger is-large"
           @click="startGame">Start</div>
    </div>

    <div v-if="!gameState">
      <img class="cover"
           src="@/assets/superSyncGoGoGo.png" />
      <br/>
      <div class="button play-btn is-danger is-large"
           @click="createGame">Create Game Room</div>
      <div class="stage-footer">
        Powered By <img src="https://pbs.twimg.com/media/DbMgP59UMAAd5a2.png">
      </div>
    </div>

    <h1 class="title">
      {{gameStateMsg}}
    </h1>

    <Stage v-if="gameState"
           :players='players' />

  </div>
</template>

<script>
import api from '@/api';
import Stage from '@/components/Stage';

export default {
  name: 'PlayStation',
  components: {
    Stage,
  },
  data() {
    return {
      roomAddr: '',
      gameState: '',
      gameLink: '',
      players: [],
    };
  },
  computed: {
    isPlayer() {
      return !!this.$route.query.roomAddr;
    },
    roomLink() {
      return `${window.document.location.origin}/#play?roomAddr=${
        this.roomAddr
      }`;
    },
    gameStateMsg() {
      const msgMap = {
        wait: '',
        start: 'Go Go Go',
        end: 'Game End',
      };
      return msgMap[this.gameState];
    },
  },
  methods: {
    async createGame() {
      const room = await api.createGameRoom();

      room.on('message', (src, payload) => {
        const { action, data } = JSON.parse(payload);
        if (action === 'join' && this.gameState === 'wait') {
          this.players.push({
            addr: src,
            name: data.name,
            color: data.color,
            score: 10,
          });
        }

        if (action === 'run' && this.gameState === 'start') {
          const index = this.players.findIndex(({ addr }) => addr === src);
          const player = this.players[index];
          player.score += 1;
          if (player.score >= 90) {
            player.win = true;
            this.gameState = 'end';
          }
        }
      });

      this.roomAddr = room.addr;
      this.gameState = 'wait';

      setInterval(() => {
        this.players.forEach(({ addr }) => {
          room.send(
            addr,
            JSON.stringify({
              action: 'sync',
              data: {
                gameState: this.gameState,
                players: this.players,
              },
            }),
          );
        });
      }, 500);
    },

    async startGame() {
      if (this.players.length < 2) {
        this.$dialog.alert({
          type: 'is-danger',
          title: '',
          message: 'The number of players must be greater than 1',
        });
        return;
      }
      this.gameState = 'start';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.gameRoomLink {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-weight: 900;
  font-size: 20px;
}
</style>
