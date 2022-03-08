export function createRTCPeerConnect(_this, userId) {
  //获得页面上的audio-box以添加音轨
  let audioBox = _this.$refs['audio-box'];
  //配置WebRTC的stun服务器（用于建立P2P链接）和turn服务器（用于转发语音）
  let peer = new RTCPeerConnection({
    "iceServers": [{
      "url": process.env.STUN_SERVER
    }, {
      "url": process.env.TURN_SERVER,
      "username": process.env.TURN_SERVER_USERNAME,
      "credential": process.env.TURN_SERVER_PASSWORD
    }]
  });
  peer.onicecandidate = (e) => {
    if (e.candidate) {
      let iceCandidateInfo = {
        'method': 'candidate',
        'room_id': _this.roomId,
        'user_id': localStorage.getItem('id'),
        'to_user_id': userId,
        'label': e.candidate.sdpMLineIndex,
        'id': e.candidate.sdpMid,
        'candidate': e.candidate.candidate
      };
      _this.socket.send(JSON.stringify(iceCandidateInfo));
    }
  }
  peer.ontrack = (e) => {
    if (e && e.streams[0]) {
      let audios = document.querySelector('#audio' + userId);
      if (audios) {
        audios.srcObject = e.streams[0];
      } else {
        let audio = document.createElement('audio');
        audio.hidden = true;
        audio.autoplay = true;
        audio.srcObject = e.streams[0];
        audio.id = 'audio' + userId;
        audioBox.append(audio);
      }
    }
  };
  peer.oniceconnectionstatechange = (evt) => {
    console.log(evt.target)
  };
  _this.localStream.getTracks().forEach((track) => {
    peer.addTrack(track, _this.localStream)
  });
  return _this.peers[userId] = peer;
}
