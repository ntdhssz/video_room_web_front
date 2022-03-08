<template>
  <div>
    <Header></Header>
    <div style="width: 90%; margin: auto;">
      <span style="float: left; font-size: 25px; font-weight: bolder">历史记录</span>
      <el-table
        :data="roomList.filter(data => !titleSearch || data.title.toLowerCase().includes(titleSearch.toLowerCase()))"
        style="width: 100%">
        <el-table-column
          label="房间号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="房间名"
          prop="title">
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="nick_name">
        </el-table-column>
        <el-table-column
          label="影片名"
          prop="video_name"
          :filters="videoList"
          :filter-method="videoChoose"
        >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="type_text"
          :filters="typeList"
          :filter-method="typeChoose"
        >
        </el-table-column>
        <el-table-column
          label="观影日期"
          prop="watch_date_time"
          :filters="dateList"
          :filter-method="dateChoose"
        >
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="titleSearch"
              size="mini"
              placeholder="房间名搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="middle" @click="enterRoom(scope.row.id)">进入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import {getWatchHistory} from "../api/room/getWatchHistory";

export default {
  name: "History",
  components: {
    Header
  },
  data() {
    return {
      titleSearch: '',
      roomList: [],
      videoList: [],
      typeList: [],
      dateList: [],
    };
  },
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      _this.getWatchHistory();
    });
  },
  methods: {
    enterRoom(id) {
      this.$router.replace('/room/' + id);
    },
    getWatchHistory() {
      let _this = this;
      getWatchHistory().then(res => {
        let data = res.data.data;
        let myRoomList = data['room_list'];
        myRoomList.forEach(room => {
          _this.roomList.push(room);
        });

        let typeList = data['type_list'];
        typeList.forEach(type => {
          let arr = {
            'text': type['typeText'],
            'value': type['typeText']
          };
          _this.typeList.push(arr);
        });

        let watchDateList = data['watch_date_list'];
        watchDateList.forEach(date => {
          let arr = {
            'text': date,
            'value': date
          };
          _this.dateList.push(arr);
        });

        let chooseVideoList = data['choose_video_list'];
        chooseVideoList.forEach(chooseVideo => {
          let arr = {
            'text': chooseVideo['video_name'],
            'value': chooseVideo['video_name']
          };
          _this.videoList.push(arr);
        });
      });
    },
    videoChoose(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    typeChoose(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    dateChoose(value, row, column) {
      const property = column['property'];
      return row[property].slice(0, 10) === value;
    }
  },
}
</script>

<style scoped>

</style>
