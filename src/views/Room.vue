<template>
  <div>
    <Header></Header>
    <div>
      <el-row>
        <el-col :span="23" :offset=1>
          <span style="font-size: 30px; float: left">{{ roomInfo.title }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px; margin-bottom: 10px;">
        <el-col :span="1" :offset=1>
          <span style="font-size: 15px; color: #999; float: left">{{ roomInfo.nick_name }}</span>
        </el-col>
        <el-col :span="5">
          <span style="font-size: 15px; color: #999; float: left">{{ roomInfo.created_date_time }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset=1>
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            @statechanged="onPlayerStateChanged($event)"
          >
          </video-player>
        </el-col>
        <el-col :span="5" :offset=1 style="height: 700px">
          <div style="border-radius: 10px; background: #d3dce6;">
            <div style="width: 100%; height: 100px; background-color: grey; overflow: auto; border-radius: 10px">
                <span
                  v-for="item in roomUserList"
                  :key="item.id"
                  style="
                    float: left;
                    white-space: normal;
                    word-break: break-all;
                    text-align: justify;
                    margin-top: 5px;
                    margin-left: 5px;
                    margin-bottom: 3px;
                    width: 75%"
                >
                  <el-avatar size="small" :src="item.avatar"></el-avatar>
                  <span style="font-size: 13px;text-align: justify; color: white">{{ item.nick_name }}</span>
                </span>
            </div>
            <div id="msg-box" class="msg-box" ref="msg_box" style="height: 530px; width: 100%; overflow: auto;">
                <span
                  v-for="item in chatList"
                  :key="item.md5"
                  style="
                    float: left;
                    white-space: normal;
                    word-break: break-all;
                    text-align: justify;
                    font-size: 13px;
                    margin-top: 2px;
                    margin-bottom: 3px;
                    width: 100%"
                >
                  <a href="#" style="text-decoration: none; color: grey">{{ item.nick_name }}</a>:{{ item.chat_text }}
                </span>
            </div>
            <div style="width: 100%; height: 70px; background-color: grey; border-radius: 10px">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                style="width: 70%; margin-top: 10px"
                resize="none"
                v-model="chatText"
                maxlength="30"
                @keydown.enter.native="sendChat()"
                oninput="value = value.replace(/[\r\n]/g, '')"
              >
              </el-input>
              <el-popover
                placement="top"
                v-model="emptyChat"
                content="请输入聊天内容"
                trigger="manual"
              >
                <el-button slot="reference" @click="sendChat()">
                  发送
                </el-button>
              </el-popover>
            </div>
          </div>
        </el-col>
      </el-row>
      <div ref="audio-box"></div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import {sendChat} from "../method/room/sendChat";
import {enterRoom} from "../api/room/enterRoom";
import {createWebSocketConnect} from "../method/room/createWebSocketConnect";
import {onPlayerStateChanged} from "../method/room/onPlayerStateChanged";

export default {
  name: "Room",
  components: {
    Header
  },
  data() {
    return {
      roomInfo: [],
      roomId: this.$route.params.id,
      roomUserList: [],
      videoUrl: '',
      socket: '',
      chatList: [],
      chatText: '',
      emptyChat: false,
      playTime: 0,
      updateTime: '',
      localStream: null,
      peers: {},
      videoPlayer: null,
      playerOptions: {
        autoplay: false,
        muted: true,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        fluid: false,
        sources: [{
          type: "video/mp4",
          src: "base"
        }],
        height: 700,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    }
  },
  mounted() {
    let _this = this;
    this.$nextTick(function () {
      _this.videoPlayer = _this.$refs.videoPlayer.player;
      _this.enterRoom();
      createWebSocketConnect(_this);
    })
  },
  methods: {
    sendChat() {
      sendChat(this);
    },
    enterRoom() {
      let _this = this;
      enterRoom(this.roomId).then(res => {
        let data = res.data.data;
        _this.roomInfo = data;
        _this.videoPlayer.src(data['video_url'])
      });
    },
    onPlayerStateChanged(event) {
      onPlayerStateChanged(this, event);
    }
  },
  destroyed() {
    clearInterval(this.updateTime);
    this.socket.close();
    for (let key in this.peers) {
      this.peers[key].close();
    }
    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
</script>

<style>
.video-player {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
