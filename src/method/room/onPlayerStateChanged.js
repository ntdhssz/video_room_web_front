export function onPlayerStateChanged(_this, event) {
  switch (Object.keys(event)[0]) {
    case 'pause':
    case 'play':
      let playInfo = {
        'method': 'play_state',
        'state': Object.keys(event)[0],
        'room_id': _this.roomId
      };
      _this.socket.send(JSON.stringify(playInfo));
      break;
    case 'timeupdate':
      if (Math.abs(_this.playTime - event['timeupdate']) > 1) {
        let timeUpdateInfo = {
          'method': 'timeupdate',
          'room_id': _this.roomId,
          'time': event['timeupdate']
        };
        _this.socket.send(JSON.stringify(timeUpdateInfo));
      }
      _this.playTime = event['timeupdate'];
      break;
  }
}
