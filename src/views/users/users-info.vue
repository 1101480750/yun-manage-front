<template>
  <div v-loading="pageLoading" class="log-box" style="margin: 5px 5px 5px 5px">
    <div class="operationCont">
      <searchForm ref="searchForm" class="operationCont" :show-export="true" :rule-form-row="ruleFormRow" :rule-form-data="ruleFormData" @doExport="doExport" @resetForm="resetForm" @doSearch="doSearch" />
    </div>
    <dataTable id="users-info-table" ref="dataTable" v-loading="loadingTable" class="table-box users-info-table" element-loading-text="拼命加载中" :table-data="tableData" :column-datas="columnDatas" @checkRows="checkRows">
      <template slot="pages" />
    </dataTable>
    <div class="paginationCont">
      <el-pagination background :page-sizes="[20, 30, 40, 50, 60]" layout="total, prev, pager, next, sizes" :pager-count="5" :page-size.sync="ruleFormData.rows" :current-page.sync="ruleFormData.page" :total="totalCount" @size-change="pageSizeChange" />
    </div>

    <el-dialog :title="isEdit ? '编辑结入结出条目' : '新增结入结出条目'" :visible.sync="isShow" class="add-dialog" label-width="180px" width="700px" :close-on-click-modal="false" :destroy-on-close="true" @beforeClose="closeRule">
      <div class="in-out-dialog">
        <addForm ref="baseForm" :rule-form-row="ruleAddFormRow" :rules="rules" :rule-form-data="ruleAddFormData" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="insertRuleGroup">确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchForm from '@/components/form/search-form.vue'
import dataTable from '@/components/table/data-table.vue'
import addForm from '@/components/form/add-form.vue'
export default {
  name: 'UsersInfo',
  data() {
    return {
      loadingTable: false,
      pageLoading: false,
      isShow: true, // 弹窗打开标志
      tableData: [],
      totalCount: 0,
      // 查询组件值对象，与ruleFormRow中每一对象的prop一一对应
      ruleFormData: {
        page: 1,
        rows: 20,
        userName: '254',
        operatorName: '',
        startTime: null,
        endTime: null
      },
      // 查询组件key对象,使用方法参照二类单据页
      ruleFormRow: [
        {
          label: '用户姓名:',
          placeholder: '用户姓名',
          prop: 'operatorName',
          type: 'input'
        },
        {
          label: '操作时间起:',
          placeholder: '请输入开始时间',
          prop: 'startTime',
          type: 'datetime'
        },
        {
          label: '操作时间止:',
          placeholder: '请输入结束时间',
          prop: 'endTime',
          type: 'datetime'
        }
      ],
      // 表格组件通用配置，使用方法参照二类单据页
      columnDatas: {
        noSum: true,
        showIndex: true,
        showSelect: false,
        height: 'calc(100%)',
        selectable: (row, index) => {
          return row.buildStatus === 0
        },
        columns: [
          {
            label: '用户姓名',
            prop: 'userName'
          },
          {
            label: '操作人',
            prop: 'operatorName'
          },
          {
            label: '操作时间',
            prop: 'createTime'
          }
        ]
      },
      rules: [],
      ruleAddFormRow: [{
        label: '名称:',
        placeholder: '名称',
        prop: 'itemsName',
        type: 'input'
      }]
    }
  },
  // 组件引入
  // eslint-disable-next-line vue/order-in-components
  components: {
    searchForm,
    dataTable,
    addForm
  },
  computed: {},
  mounted() {
    // 初始化表格高度
    // const path = this.$route.fullPath
    // console.log('path----------------------------------------------', path)
    console.log('this.name:', this.name)
    this.doResize('users-info')
    // this.doSearch()
  },
  // eslint-disable-next-line no-dupe-keys
  mounted() {
    // 初始化表格高度
    const path = this.$route.fullPath
    this.doResize(path)
  },
  methods: {
    // 数据初始化
    resetForm() { },
    checkRows() { },
    doExport() {
    },
    // 行数切换
    pageSizeChange(rows) {
      this.ruleFormData.page = 1
      this.ruleFormData.rows = rows
      this.doSearch()
    },
    // 数据查询
    doSearch() {
      // this.$cookie.get('token', res.body.accessToken)
      console.log('token', window.sessionStorage.getItem('token'))
      this.$http({
        url: '/yun-member-api/users/listUsers',
        method: 'post',
        data: { body: { ...this.ruleFormData }}
      }).then(res => {
        console.log('res', res)
        this.tableData = res.body.rows
        this.totalCount = res.body.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  width: 100%;
  height: 100%;
  .operator-log {
    width: 178px;
  }
  .table-box {
    height: calc(100% - 130px);
  }
}
</style>
