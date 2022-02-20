<template>
  <div>
    <Header></Header>
    <el-row :gutter="10">
      <el-col
        :span="6"
        v-for="(item, i) in room_list"
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
              <div style="float: left; font-size: 20px; font-weight: bold">{{ item.title }}</div>
              <div style="float: right; font-size: 15px; color: #999;"><i
                class="el-icon-user-solid"></i>{{ item.watching }}
              </div>
            </el-col>
            <el-col>
              <div style="float: left; font-size: 13px">{{ $store.state.nick_name }}</div>
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
import Header from "./Header";
import {aliveRoom} from "../api/aliveRoom";

export default {
  name: "Index",
  components: {
    Header
  },
  watch: {
    '$route': {
      handler() {
        this.query_info.page = 1
        this.room_list = []
        this.onPullDown = true
        this.onFooter = false
        window.addEventListener('scroll', this.scroll, false)
        this.getAliveRoom()
      }
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.scroll, false)
  },
  data() {
    return {
      room_list: [],
      query_info: {
        type: 0,
        keyword: '',
        page: 1,
        pageSize: 12,
      },
      onPullDown: true,
      onFooter: false
    }
  },
  created() {
    this.getAliveRoom()
  },
  methods: {
    getAliveRoom() {
      let loading = this.$loading({target: document.getElementById('loading'), fullscreen: false})
      this.query_info.type = this.$route.query.type
      this.query_info.keyword = this.$route.query.keyword
      aliveRoom(this.query_info)
        .then(res => {
          let records = res.data.data.records
          this.room_list = this.room_list.concat(records);
          loading.close()
          if (records.length <= 0) {
            this.onFooter = true
            this.onPullDown = false
            window.removeEventListener('scroll', this.scroll)
          }
        })
        .catch(failResponse => {
          loading.close()
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
        this.query_info.page = this.query_info.page + 1
        this.getAliveRoom()
      }
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.scroll)
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
