<template>
  <div class="app-container">
    <div class="filter-container" >
      <div class="left-box">
        <el-input v-model="listQuery.name" placeholder="请输入查询内容" class="filter-item" />
        <el-select v-model="listQuery.state" style="width: 130px;margin: 0 10px;"  placeholder="文章类型">
          <el-option
            v-for="item in status_optins"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
      </div>
      <el-button  class="filter-item" type="primary" icon="el-icon-edit">添加文章</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>

      <el-table-column  label="序号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="文章名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="文章类型" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTimeStr }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.$index, scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row)" />
        </template>
      </el-table-column>
    </el-table>


    <div style="text-align: left">
      <el-dialog
        title="编辑"
        :visible.sync="dialogVisible"
        width="25%">
        <el-input v-model="title" size="mini" placeholder="请输入新的文章标题"></el-input>

        <el-input v-model="content" size="mini" placeholder="请输入新的文章內容" style="margin-top: 20px"></el-input>

        <el-select v-model="type"  size="mini" placeholder="文章类型" style="margin-top: 20px">
          <el-option
            v-for="tl in titleLevels"
            :key="tl"
            :label="tl"
            :value="tl">
          </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="updatePosNameExec">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div style="text-align: left">
      <el-dialog
        title="添加"
        :visible.sync="dialogAddVisible"
        width="25%">
        <el-input v-model="title" size="mini" placeholder="请输入新的文章标题"></el-input>

        <el-input v-model="content" size="mini" placeholder="请输入新的文章內容" style="margin-top: 20px"></el-input>

        <el-select v-model="type"  size="mini" placeholder="文章类型" style="margin-top: 20px">
          <el-option
            v-for="tl in titleLevels"
            :key="tl"
            :label="tl"
            :value="tl">
          </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="addPosNameExec">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  // import { getList } from '@/api/table'
  import waves from '@/directive/waves'
  import service from '@/utils/request'
  import {Message} from 'element-ui'

  export default {
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogAddVisible:false,
        tableLoading: false,

        content:'',
        title:'',
        type:'',
        index: 0,
        titleLevels: ['工作动态', '全民健康', '孝感天地'],

        list: null,
        listLoading: true,
        // 查询条件
        listQuery: {
          name: undefined,
          state:undefined,
          offset : 0,
          page : 1,
          pageSize : 10
        },
        status_optins: [{id: 0, name: '工作动态'}, {id: 1, name: '全名健康'}, {id: 2, name: '孝感天地'}],

      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        service.get("/manage/news/list",  {params: this.listQuery}).then(response => {
          this.list = response.data
          this.listLoading = false;
        })
      },
      // 更新

      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.id = row.id;
        row.createDate = new Date(row.createDate);
        //delete row.allSalary;
        this.salary = row;
        this.title=row.title;
        this.content=row.content;
        this.type=row.type;
      },
      updatePosNameExec(){
        if (!this.isNotNullORBlank(this.title)) {
          this.$message.warning( '标题不能为空!');
          return;
        }
        if (!this.isNotNullORBlank(this.content)) {
          this.$message.warning( '文本内容不能为空!');
          return;
        }
        this.loading = true;
        var _this = this;
        service.post("/manage/news/update", {title: this.title, id: this.id,content:this.content}).then(resp=> {
          _this.loading = false;
          if (resp && resp.data.code == 200) {
            this.dialogVisible = false;
            var data = resp.data.data;
            _this.loadSalaryCfg();
            _this.title='';
            _this.content='';
            _this.type='';
          }
        })
      },
      addPosNameExec(){
        if (!this.isNotNullORBlank(this.title)) {
          this.$message.warning( '标题不能为空!');
          return;
        }
        if (!this.isNotNullORBlank(this.content)) {
          this.$message.warning( '文本内容不能为空!');
          return;
        }
        if (!this.isNotNullORBlank(this.type)) {
          this.$message.warning( '文本类型不能为空!');
          return;
        }
        //0-工作动态 1-全民健康 2-孝感天地
        var _type
        if(this.type=='工作动态'){
          _type='0';
        }else if(this.type=='全民健康'){
          _type='1';
        }else {
          _type='2'
        }
        this.loadin g = true;
        var _this = this;
        this.postJsonRequest("/manage/news/insert", {title: this.title,content:this.content,type:_type}).then(resp=> {
          _this.loading = false;
          if (resp && resp.data.code == 200) {
            this.dialogAddVisible = false;
            var data = resp.data.data;
            _this.loadSalaryCfg();
            _this.title='';
            _this.content='';
            _this.type='';
          }
        })
      },
      handleDelete(index, row) {
        this.$confirm('删除[' + row.title + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      doDelete(id){
        var _this = this;
        _this.tableLoading = true;
        this.postRequest("/manage/news/delete", {
          newsId:id
        }).then(resp=>{
          _this.tableLoading = false;
          if (resp && resp.data.code == 200) {
            var data = resp.data.data;
            _this.loadSalaryCfg();
          }
        });
      },

      isNotNullORBlank(...args){
        for (var i = 0; i < args.length; i++) {
          var argument = args[i];
          if (argument == null || argument == '' || argument == undefined) {
            Message.warning({message: '数据不能为空!'})
            return false;
          }
        }
        return true;
      }

    }
  }
</script>
