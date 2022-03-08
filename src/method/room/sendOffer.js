import {createRTCPeerConnect} from "./createRTCPeerConnect";

export function sendOffer(_this, userId) {
  let peer = createRTCPeerConnect(_this, userId);
  peer.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: false}).then((desc) => {
    peer.setLocalDescription(desc).then(() => {
      console.log(desc);
    }).catch((error) => {
      console.log(error);
    });
    let offerInfo = {
      'method': 'offer',
      'room_id': _this.roomId,
      'user_id': localStorage.getItem('id'),
      'to_user_id': userId,
      'desc': desc
    };
    _this.socket.send(JSON.stringify(offerInfo));
  })
}
