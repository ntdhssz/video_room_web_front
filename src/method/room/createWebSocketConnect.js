import md5 from "md5-node";

import {getRoomUser} from "../../api/room/getRoomUser";
import {sendOffer} from "./sendOffer";
import {createRTCPeerConnect} from "./createRTCPeerConnect";
import {getUserMedia} from "./getUserMedia";

let _this = null;
let response = null;

export function createWebSocketConnect(__this) {
  _this = __this;
  _this.socket = new WebSocket('wss://video-room.bricktool.top/ws');
  _this.socket.onmessage = function (message) {
    response = JSON.parse(message.data);
    switch (response['method']) {
      case 'start':
        start();
        break;
      case 'user_enter':
        userEnter();
        break;
      case 'offer':
        offer();
        break;
      case 'answer':
        answer();
        break;
      case 'candidate':
        candidate();
        break;
      case 'chat':
        chat();
        break;
      case 'now_time':
        nowTime();
        break;
      case 'play_state':
        playState();
        break;
      case 'timeupdate':
        timeupdate();
        break;
      case 'user_leave':
        userLeave();
        break;
    }
  };
  _this.socket.onopen = function () {
    let startInfo = {
      'method': 'start',
      'room_id': _this.roomId,
      'user_id': localStorage.getItem('id')
    };
    _this.socket.send(JSON.stringify(startInfo));
  }
}

function start() {
  _this.videoPlayer.currentTime(response['time']);
  if (response['play_state'] === 'play') {
    _this.videoPlayer.play();
  } else {
    _this.videoPlayer.pause();
  }
  for (let key in response['user_id_list']) {
    getRoomUser(response['user_id_list'][key]).then(res => {
      let data = res.data.data;
      _this.roomUserList.push(data);
    })
  }
  getUserMedia().then((stream) => {
    _this.localStream = stream;
    for (let key in response['user_id_list']) {
      if (response['user_id_list'][key] !== localStorage.getItem('id')) {
        sendOffer(_this, response['user_id_list'][key]);
      }
    }
  })
  _this.updateTime = setInterval(function () {
    let nowTimeInfo = {
      'method': 'now_time',
      'time': _this.playTime,
      'room_id': _this.roomId
    };
    _this.socket.send(JSON.stringify(nowTimeInfo));
  }, 3000)
}

function userEnter() {
  getRoomUser(response['user_id']).then(res => {
    let data = res.data.data;
    _this.roomUserList.push(data);
    let enterInfo = {
      'md5': md5(data.nick_name + Date.now()),
      'nick_name': '系统通知',
      'chat_text': '用户' + data.nick_name + '进入房间'
    };
    updateChatList(enterInfo);
  })
}

function offer() {
  let peer = createRTCPeerConnect(_this, response.user_id);
  peer.setRemoteDescription(new RTCSessionDescription(response.desc)).then();
  peer.createAnswer().then((desc) => {
    peer.setLocalDescription(desc).then(() => {
      console.log(desc);
      let answerInfo = {
        'method': 'answer',
        'room_id': _this.roomId,
        'user_id': localStorage.getItem('id'),
        'to_user_id': response.user_id,
        'desc': desc
      };
      _this.socket.send(JSON.stringify(answerInfo));
    }).catch((error) => {
      console.log(error);
    })
  }).catch((error) => {
    console.log(error);
  })
}

function answer() {
  _this.peers[response.user_id].setRemoteDescription(new RTCSessionDescription(response.desc)).then();
}

function candidate() {
  let candidate = new RTCIceCandidate({
    sdpMLineIndex: response.label,
    sdpMid: response.id,
    candidate: response.candidate
  });
  _this.peers[response.user_id].addIceCandidate(candidate).then();
}

function chat() {
  updateChatList(response);
}

function nowTime() {
  _this.videoPlayer.currentTime(response['time']);
}

function playState() {
  if (response['play_state'] === 'play') {
    _this.videoPlayer.play();
  } else {
    _this.videoPlayer.pause();
  }
}

function timeupdate() {
  _this.videoPlayer.currentTime(response['time']);
}

function userLeave() {
  _this.roomUserList.forEach((value, index) => {
    if (value.id === parseInt(response['user_id'])) {
      let leaveInfo = {
        'md5': md5(value.nick_name + Date.now()),
        'nick_name': '系统通知',
        'chat_text': '用户' + value.nick_name + '离开房间'
      };
      updateChatList(leaveInfo);
      _this.roomUserList.splice(index, 1);
    }
  })
}

function updateChatList(info) {
  _this.chatList.push(info);
  let msgBox = _this.$el.querySelector('#msg-box');
  let sTop = msgBox.scrollTop;
  let cHeight = msgBox.clientHeight;
  let sHeight = msgBox.scrollHeight;
  let onBottom = (sHeight === sTop + cHeight);
  _this.$nextTick(() => {
    if (onBottom) {
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  })
}
