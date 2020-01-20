<template>
  <div v-loading="pageLoading" class="log-box" style="margin: 5px 5px 5px 5px">
    <div class="operationCont">
      <searchForm ref="searchForm" class="operationCont" :show-export="true" :rule-form-row="ruleFormRow" :rule-form-data="ruleFormData" @doExport="doExport" @resetForm="resetForm" @doSearch="doSearch" />
    </div>
    <dataTable id="users-info-table" ref="dataTable" v-loading="loadingTable" class="table-box users-info-table" element-loading-text="拼命加载中" :table-data="tableData" :column-datas="columnDatas" @checkRows="checkRows">
      <template slot="pages" />
    </dataTable>
    <div class="paginationCont">
      <el-pagination background :page-sizes="[20, 30, 40, 50, 60]" layout="total, prev, pager, next, sizes" :pager-count="5" :page-size.sync="ruleFormData.rows" :current-page.sync="ruleFormData.page" :total="totalCount" @size-change="pageSizeChange" @current-change="doSearch()" />
    </div>
  </div>
</template>
<script>
import searchForm from '@/components/form/search-form.vue'
import dataTable from '@/components/table/data-table.vue'
export default {
  name: 'UsersInfo',
  data() {
    return {
      permissions: JSON.parse(sessionStorage.getItem('permissions') || '[]'),
      loadingTable: false,
      pageLoading: false,
      tableData: [],
      totalCount: 0,
      // 查询组件值对象，与ruleFormRow中每一对象的prop一一对应
      ruleFormData: {
        page: 1,
        rows: 20,
        operatorNo: '',
        operatorName: '',
        startTime: null,
        endTime: null
      },
      // 查询组件key对象,使用方法参照二类单据页
      ruleFormRow: [
        {
          label: '操作员名称:',
          placeholder: '操作员名称',
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
            label: '操作功能',
            prop: 'operation'
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
      }
    }
  },
  // 组件引入
  // eslint-disable-next-line vue/order-in-components
  components: {
    searchForm,
    dataTable
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
