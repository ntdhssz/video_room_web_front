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
          <span style="font-size: 15px; color: #999; float: left">{{ roomInfo.created_at }}</span>
        </el-col>
      </el-row>
      <el-row>
        <audio id="remoteAudio" autoplay></audio>
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
    </div>
  </div>
</template>

<script>
import {enterRoom} from "../api/enterRoom"
import {getRoomUser} from "../api/getRoomUser"

let md5 = require('md5-node')

export default {
  name: "Room",
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
      localStream: undefined,
      remoteAudio: {},
      pc: null
    }
  },
  mounted() {
    let _this = this
    this.updateTime = setInterval(function () {
      let nowTimeInfo = {
        'method': 'now_time',
        'time': _this.playTime,
        'room_id': _this.roomId
      }
      _this.socket.send(JSON.stringify(nowTimeInfo))
    }, 3000)
    this.getUserMedia()
    this.remoteAudio = document.getElementById('remoteAudio')
    this.$nextTick(function () {
      _this.getRoomInfo(this.$route.params.id)
      _this.socket.onmessage = function (message) {
        let videoPlayer = _this.$refs.videoPlayer.player
        let response = JSON.parse(message.data)
        switch (response['method']) {
          case 'start':
            videoPlayer.currentTime(response['time'])
            if (response['play_state'] === 'play') {
              videoPlayer.play()
            } else {
              videoPlayer.pause()
            }
            for (let key in response['user_id_list']) {
              getRoomUser(response['user_id_list'][key]).then(res => {
                let data = res.data.data
                _this.roomUserList.push(data)
              })
            }
            break
          case 'user_enter':
            getRoomUser(response['user_id']).then(res => {
              let data = res.data.data
              _this.roomUserList.push(data)
              let enterInfo = {
                'md5': md5(data.nick_name + Date.now()),
                'nick_name': '系统通知',
                'chat_text': '用户' + data.nick_name + '进入房间'
              }
              _this.chatList.push(enterInfo)
              let msgBox = _this.$el.querySelector('#msg-box')
              let sTop = msgBox.scrollTop
              let cHeight = msgBox.clientHeight
              let sHeight = msgBox.scrollHeight
              let onBottom = (sHeight === sTop + cHeight)
              _this.$nextTick(() => {
                if (onBottom) {
                  msgBox.scrollTop = msgBox.scrollHeight
                }
              })
            })
            if (this.pc) {
            }
            break
          case 'offer':
            console.log('offer')
            _this.pc.setRemoteDescription(new RTCSessionDescription(response.desc))
            _this.pc.createAnswer().then((desc) => {
              _this.pc.setLocalDescription((desc) => {
                console.log(desc)
              }).catch((error) => {
                console.log(error)
              })
              let answerInfo = {
                'method': 'answer',
                'room_id': _this.roomId,
                'user_id': localStorage.getItem('id'),
                'to_user_id': response.user_id,
                'desc': desc
              }
              _this.socket.send(JSON.stringify(answerInfo))
            }).catch((error) => {
              console.log(error)
            })
            break
          case 'answer':
            console.log('answer')
            _this.pc.setRemoteDescription(new RTCSessionDescription(response.desc))
            break
          case 'candidate':
            console.log('candidate')
            let candidate = new RTCIceCandidate({
              sdpMLineIndex: response.label,
              sdpMid: response.id,
              candidate: response.candidate
            })

            _this.pc.addIceCandidate(candidate)
            break
          case 'chat':
            _this.chatList.push(response)
            let msgBox = _this.$el.querySelector('#msg-box')
            let sTop = msgBox.scrollTop
            let cHeight = msgBox.clientHeight
            let sHeight = msgBox.scrollHeight
            let onBottom = (sHeight === sTop + cHeight)
            _this.$nextTick(() => {
              if (onBottom) {
                msgBox.scrollTop = msgBox.scrollHeight
              }
            })
            break
          case 'now_time':
            videoPlayer.currentTime(response['time'])
            break
          case 'play_state':
            if (response['play_state'] === 'play') {
              videoPlayer.play()
            } else {
              videoPlayer.pause()
            }
            break
          case 'timeupdate':
            videoPlayer.currentTime(response['time'])
            break
          case 'user_leave':
            _this.roomUserList.forEach((value, index) => {
              if (value.id === parseInt(response['user_id'])) {
                let enterInfo = {
                  'md5': md5(value.nick_name + Date.now()),
                  'nick_name': '系统通知',
                  'chat_text': '用户' + value.nick_name + '离开房间'
                }
                _this.chatList.push(enterInfo)
                let msgBox = _this.$el.querySelector('#msg-box')
                let sTop = msgBox.scrollTop
                let cHeight = msgBox.clientHeight
                let sHeight = msgBox.scrollHeight
                let onBottom = (sHeight === sTop + cHeight)
                _this.$nextTick(() => {
                  if (onBottom) {
                    msgBox.scrollTop = msgBox.scrollHeight
                  }
                })
                console.log(value, index)
                _this.roomUserList.splice(index, 1)
              }
            })

        }
      }
      _this.socket.onopen = function () {
        let startInfo = {
          'method': 'start',
          'room_id': _this.roomId,
          'user_id': localStorage.getItem('id')
        }
        _this.socket.send(JSON.stringify(startInfo))
      }
      window.addEventListener('unload', e => _this.closeWS())
    })
  },
  computed: {
    playerOptions() {
      return {
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: true,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        fluid: false,
        sources: [{
          type: "video/mp4",
          src: this.videoUrl
        }],
        height: 700,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    }
  },
  methods: {
    async getUserMedia() {
        try {
          let _this = this
          this.localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
          this.pc = new RTCPeerConnection()
          this.pc.onicecandidate = (e) => {
            if (e.candidate) {
              let iceCandidateInfo = {
                'method': 'candidate',
                'room_id': _this.roomId,
                'user_id': localStorage.getItem('id'),
                'label': e.candidate.sdpMLineIndex,
                'id': e.candidate.sdpMid,
                'candidate': e.candidate.candidate
              }
              this.socket.send(JSON.stringify(iceCandidateInfo))
            }
          }
          this.pc.ontrack = (e) => {
            if (e && e.streams[0]) {
              console.log('ontrack')
              _this.remoteAudio.srcObject = null;
              _this.remoteAudio.srcObject = e.streams[0];
              console.log(_this.pc)
            }
          }
          this.pc.oniceconnectionstatechange = (evt) => {
            console.log('state:' + evt.target.iceConnectionState)
          }
          this.localStream.getTracks().forEach((track) => {
            _this.pc.addTrack(track, this.localStream)
          })
          this.pc.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: false}).then((desc) => {
            this.pc.setLocalDescription(desc).then(() => {
              console.log(desc)
            }).catch((error) => {
              console.log(error)
            })
            let offerInfo = {
              'method': 'offer',
              'room_id': _this.roomId,
              'user_id': localStorage.getItem('id'),
              'desc': desc
            }
            _this.socket.send(JSON.stringify(offerInfo))
          })
        } catch (error) {
          console.log('getUserMedia error: ' + error)
        }
    },
    getRoomInfo(id) {
      enterRoom(id).then(res => {
        let data = res.data.data
        this.roomInfo = data
        this.videoUrl = data.video_url
      })
    },
    sendChat() {
      let chatInfo = {
        'method': 'chat',
        'room_id': this.roomId,
        'nick_name': localStorage.getItem('nick_name'),
        'user_id': localStorage.getItem('id'),
        'chat_text': this.chatText
      }
      if (chatInfo.chat_text === '') {
        this.emptyChat = true
        setTimeout(() => {
          this.emptyChat = false
        }, 2000)
      } else {
        this.socket.send(JSON.stringify(chatInfo))
        this.chatText = ''
      }
    },
    onPlayerStateChanged(event) {
      switch (Object.keys(event)[0]) {
        case 'pause':
        case 'play':
          let playInfo = {
            'method': 'play_state',
            'state': Object.keys(event)[0],
            'room_id': this.roomId
          }
          this.socket.send(JSON.stringify(playInfo))
          break
        case 'timeupdate':
          if (Math.abs(this.playTime - event['timeupdate']) > 1) {
            let timeUpdateInfo = {
              'method': 'timeupdate',
              'room_id': this.roomId,
              'time': event['timeupdate']
            }
            this.socket.send(JSON.stringify(timeUpdateInfo))
          }
          this.playTime = event['timeupdate']
          break
      }
    },
    closeWS() {
      let endInfo = {
        'method': 'close',
        'room_id': this.roomId,
        'nick_name': localStorage.getItem('nick_name'),
        'user_id': localStorage.getItem('id')
      }
      this.socket.send(JSON.stringify(endInfo))
    }
  },
  destroyed() {
    this.closeWS()
    window.removeEventListener('unload', e => this.closeWS())
    clearInterval(this.updateTime);
    this.socket.close()
  }
}
</script>

<style>
.bg-purple {
  background: #d3dce6;
  height: 100%
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
