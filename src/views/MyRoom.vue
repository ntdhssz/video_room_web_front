<template>
  <div>
    <Header></Header>
    <div style="width: 90%; margin: auto;">
      <span style="float: left; font-size: 25px; font-weight: bolder">我创建的房间</span>
      <el-table
        :data="roomList.filter(data => !titleSearch || data.title.toLowerCase().includes(titleSearch.toLowerCase()))"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="影片地址">
                <span>{{ props.row.video_url }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="房间号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="房间名"
          prop="title">
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
          label="创建日期"
          prop="created_date_time"
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
            <el-button type="text" size="middle" @click="editRoom(scope.row.id)">编辑</el-button>
            <el-button type="text" size="middle" @click="deleteRoom(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>

<script>
import Header from "../components/Header";
import {getUserRoomList} from "../api/room/getUserRoomList";
import {deleteRoom} from "../api/room/deleteRoom";

export default {
  name: "MyRoom",
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
      _this.getMyRoomList();
    });
  },
  methods: {
    enterRoom(id) {
      this.$router.replace('/room/' + id);
    },
    editRoom(id) {
      this.$router.replace('/room/edit/' + id);
    },
    deleteRoom(index, roomId) {
      let _this = this;
      this.$confirm('此操作将会删除该房间, 是否继续?', '删除房间', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoom(roomId).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
          _this.roomList.splice(index, 1);
        });
      });
    },
    getMyRoomList() {
      let _this = this;
      getUserRoomList().then(res => {
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

        let createdDateList = data['created_date_list'];
        createdDateList.forEach(date => {
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
};
</script>

<style scoped>

</style>
