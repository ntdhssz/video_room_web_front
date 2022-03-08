<template>
  <el-form ref="form" :model="roomForm.form" :rules="rules" label-width="80px" style="text-align: left; margin-top: 25px">
    <el-form-item label="房间标题" prop="title">
      <el-input v-model="roomForm.form.title"></el-input>
    </el-form-item>
    <el-form-item label="影片类型" prop="type">
      <el-radio-group v-model="roomForm.form.type">
        <el-radio label="0">泛型</el-radio>
        <el-radio label="1">电影</el-radio>
        <el-radio label="2">动画</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="影片名称" prop="video_name">
      <el-input v-model="roomForm.form.video_name"></el-input>
    </el-form-item>
    <el-form-item label="影片地址" prop="video_url">
      <el-input v-model="roomForm.form.video_url"></el-input>
    </el-form-item>
    <el-form-item label="可选影片">
      <el-select v-model="roomForm.form.choose_video" @change="chooseRoomChange">
        <el-option
          v-for="item in videoList"
          :key="item.id"
          :label="item.video_name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        ref="submitBtn"
        type="primary"
        @click="submitRoom"
        style="float: right"
        :loading="roomForm.submitBtnLoading"
        :disabled="roomForm.submitBtnDisabled">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getChooseVideoList} from "../api/room/getChooseVideoList";

export default {
  name: "RoomForm",
  props: ["roomForm"],
  data() {
    return {
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择影片类型', trigger: 'blur'}
        ],
        video_name: [
          {required: true, message: '请输入影片名', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        video_url: [
          {type: "url", required: true, message: '请输入正确的影片地址', trigger: 'blur'}
        ]
      },
      videoList: [
        {
          'id': '0',
          'video_name': '自定义',
          'video_url': null
        }
      ],
    };
  },
  mounted() {
    let _this = this;
    this.$nextTick(function () {
      getChooseVideoList().then(res => {
        res.data.data.forEach(chooseVideo => {
          _this.videoList.push(chooseVideo);
        });
      });
    });
  },
  methods: {
    submitRoom() {
      let _this = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          _this.$emit("submitRoom", _this.roomForm.form);
        }
      });
    },
    chooseRoomChange() {
      let form = this.roomForm.form;
      let videoInfo = {};
      if (form.choose_video !== '0') {
        videoInfo = this.videoList.find(item => {
          return item.id === form.choose_video;
        });
        form.video_name = videoInfo.video_name;
        form.video_url = videoInfo.video_url;
      } else {
        form.video_name = '';
        form.video_url = '';
      }
    }
  }
};
</script>

<style scoped>

</style>
