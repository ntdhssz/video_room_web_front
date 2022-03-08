export function sendChat(_this) {
  let chatInfo = {
    'method': 'chat',
    'room_id': _this.roomId,
    'nick_name': localStorage.getItem('nick_name'),
    'user_id': localStorage.getItem('id'),
    'chat_text': _this.chatText
  }
  let checkChatText = _this.chatText.replace(/\ +/g, "")
  if (checkChatText === '') {
    _this.emptyChat = true
    _this.chatText = ''
    setTimeout(() => {
      _this.emptyChat = false
    }, 2000)
  } else {
    _this.socket.send(JSON.stringify(chatInfo))
    _this.chatText = ''
  }
}
