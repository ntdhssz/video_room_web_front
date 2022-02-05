<template>
  <div>
    <Header></Header>
    <el-row :gutter="10">
      <el-col
        :span="8"
        v-for="(item, i) in room_list"
        :key="i"
      >
        <el-card
          :body-style="{ padding: '0px'} "
          shadow="hover"
          @click.native="enterRoom(item.id)"
        >
          <img
            :src="item.snapshot"
            class="image"
          >
          <div style="padding: 14px;">
            <div>{{ item.title }}</div>
            <div class="bottom clearfix">
              <time class="time"> 创建时间：{{ item.created_at }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div
      class="onFooter"
      v-show="onFooter"
    >
      到底啦~
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
        this.page = 1
        this.room_list = []
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
        pageSize: 9,
      },
      onPullDown: true,
      onFooter: false,
    }
  },
  created() {
    this.getAliveRoom()
  },
  methods: {
    getAliveRoom() {
      this.query_info.type = this.$route.query.type
      this.query_info.keyword = this.$route.query.keyword
      aliveRoom(this.query_info)
        .then(res => {
          console.log(res.data.data)
          let records = res.data.data.records
          this.room_list = this.room_list.concat(records);
          if (records.length <= 0) {
            this.onFooter = true
            this.onPullDown = false
            window.removeEventListener('scroll', this.scroll)
          }
        })
    },
    enterRoom(id) {
      console.log(id)
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}


</style>
