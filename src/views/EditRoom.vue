<template>
  <div>
    <Header></Header>
    <div style="width: 50%; margin: auto;">
      <span style="font-size: 40px; font-weight: bolder;">编辑房间</span>
      <RoomForm @submitRoom="updateRoom" v-bind:roomForm="roomForm"></RoomForm>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import RoomForm from "../components/RoomForm";
import {getRoomInfo} from "../api/room/getRoomInfo";
import {updateRoom} from "../api/room/updateRoom";

export default {
  name: "EditRoom",
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
      roomId: this.$route.params.id,
    };
  },
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      getRoomInfo(_this.roomId).then(res => {
        let data = res.data.data;
        _this.roomForm.form.title = data.title;
        _this.roomForm.form.type = data.type.toString();
        _this.roomForm.form.choose_video = data.choose_video;
        _this.roomForm.form.video_name = data.video_name;
        _this.roomForm.form.video_url = data.video_url;
      })
    });
  },
  methods: {
    updateRoom(data) {
      let _this = this;
      this.submitBtnLoading = true;
      updateRoom(this.roomId, data).then(res => {
        _this.submitBtnLoading = false;
        _this.submitBtnDisabled = true;
        _this.$alert('修改成功，点击确认进入房间', '修改成功', {
          confirmButtonText: '进入房间',
          callback: action => {
            this.$router.replace({path: '/room/' + this.roomId});
          },
          showClose: false
        });
      }).catch(err => {
        _this.submitBtnLoading = false;
        _this.submitBtnDisabled = true;
        _this.$alert('系统错误：' + err, '修改失败', {
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
