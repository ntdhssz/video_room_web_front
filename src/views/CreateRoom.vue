<template>
  <div>
    <Header></Header>
    <div style="width: 50%; margin: auto;">
      <span style="font-size: 40px; font-weight: bolder;">创建房间</span>
      <RoomForm @submitRoom="createRoom" v-bind:roomForm="roomForm"></RoomForm>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import RoomForm from "../components/RoomForm";
import {createRoom} from "../api/room/createRoom";

export default {
  name: "CreateRoom",
  components: {
    RoomForm,
    Header
  },
  data() {
    return {
      roomForm: {
        form: {
          title: '',
          type: '0',
          video_name: '',
          video_url: '',
          choose_video: '0'
        },
        submitBtnLoading: false,
        submitBtnDisabled: false,
      },
    };
  },
  methods: {
    createRoom(data) {
      let _this = this;
      this.submitBtnLoading = true;
      createRoom(data).then(res => {
        _this.submitBtnLoading = false;
        _this.submitBtnDisabled = true;
        _this.$alert('创建成功，点击确认进入房间', '创建成功', {
          confirmButtonText: '进入房间',
          callback: action => {
            let roomId = res.data.data;
            this.$router.replace({path: '/room/' + roomId});
          },
          showClose: false
        });
      }).catch(err => {
        _this.submitBtnLoading = false;
        _this.submitBtnDisabled = true;
        _this.$alert('系统错误：' + err, '创建失败', {
          confirmButtonText: '确定',
          callback: action => {
            _this.submitBtnDisabled = false;
          },
          showClose: false
        });
      });
    },
  }
};
</script>

<style scoped>

</style>
