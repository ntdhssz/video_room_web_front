<template>
  <div>
    <Header></Header>
    <el-row style="width: 50%; margin-left: 25%; margin-bottom: 30px;">
      <el-input
        placeholder="搜索房间（可搜索房间名、影片名、创建者名）回车搜索"
        prefix-icon="el-icon-search"
        v-model="queryInfo.keyword"
        @keydown.enter.native="search()">
      </el-input>
    </el-row>
    <el-row :gutter="10" style="width: 98%; margin-left: 1%;">
      <el-col
        :span="6"
        v-for="(item, i) in roomList"
        :key="i"
        style="margin-bottom: 10px"
      >
        <el-card
          :body-style="{ padding: '0px'} "
          shadow="hover"
        >
          <img
            :src="item.snapshot"
            class="image"
            alt="snapshot"
            @click="enterRoom(item.id)"
          >
          <el-row style="padding: 14px;">
            <el-col>
              <div style="float: left">
                <span style="font-size: 20px; font-weight: bold">{{ item.title }}</span>
                <span style="font-size: 10px; color: grey">{{ item.video_name }}</span>
              </div>
              <div style="float: right; font-size: 15px; color: #999;"><i
                class="el-icon-user-solid"></i>{{ item.watching }}
              </div>
            </el-col>
            <el-col>
              <div style="float: left; font-size: 13px">{{ item.nick_name }}</div>
              <time class="time" style="float: right">{{ item.created_at }}</time>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div
      class="onFooter"
      style="margin-top: 20px; font-size: 30px"
    >
      <div id="loading"></div>
      <span v-show="onFooter">世界的尽头~</span><br>
      <span style="font-size: 10px" v-show="onFooter">
        没找到想看的？
        <router-link
          to="/room/create"
          v-show="onFooter"
        >
          点击这里
        </router-link>创建一个
      </span>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import {aliveRoom} from "../api/index/aliveRoom";

export default {
  name: "Index",
  components: {
    Header
  },
  watch: {
    '$route': {
      handler() {
        this.queryInfo.page = 1;
        this.roomList = [];
        this.onPullDown = true;
        this.onFooter = false;
        window.addEventListener('scroll', this.scroll, false);
        this.getAliveRoom();
      }
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.scroll, false);
  },
  data() {
    return {
      roomList: [],
      queryInfo: {
        type: 0,
        keyword: '',
        page: 1,
        pageSize: 12,
      },
      onPullDown: true,
      onFooter: false
    };
  },
  created() {
    this.getAliveRoom();
  },
  methods: {
    getAliveRoom() {
      let _this = this;
      let loading = this.$loading({target: document.getElementById('loading'), fullscreen: false});
      if (typeof this.queryInfo.type === "undefined") {
        this.queryInfo.type = 0;
      } else if (this.queryInfo.type === "undefined") {
        this.queryInfo.type = 0;
      } else {
        this.queryInfo.type = this.$route.query.type;
      }
      this.queryInfo.keyword = this.$route.query.keyword;
      aliveRoom(this.queryInfo)
        .then(res => {
          let records = res.data.data.records;
          _this.roomList = _this.roomList.concat(records);
          loading.close();
          if (records.length <= 0) {
            _this.onFooter = true;
            _this.onPullDown = false;
            window.removeEventListener('scroll', _this.scroll);
          }
        })
        .catch(failResponse => {
          loading.close();
        })
    },
    enterRoom(id) {
      this.$router.replace('/room/' + id)
    },
    scroll() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight && this.onPullDown === true) {
        this.queryInfo.page = this.queryInfo.page + 1;
        this.getAliveRoom();
      }
    },
    search() {
      let path = '/index';
      if (typeof this.queryInfo.type === "undefined") {
        path += '?type=' + '0';
      } else if (this.queryInfo.type === "undefined"){
        path += '?type=' + '0';
      } else {
        path += '?type=' + this.queryInfo.type;
      }
      if (this.queryInfo.keyword !== '') {
        path += '&keyword=' + this.queryInfo.keyword;
      }
      this.$router.replace({path: path});
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scroll);
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {

  object-fit: cover;

  width: 100%;

  height: 220px;

  display: block;

}


</style>
