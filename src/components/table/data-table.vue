<template>
  <div class="main-table">
    <el-table
      ref="mainTable"
      :height="columnDatas.height ? columnDatas.height : '700px'"
      :highlight-current-row="columnDatas.rowFlag"
      :show-summary="columnDatas.showSum"
      :row-key="columnDatas.hasRowKey ? setRowKey : ''"
      :span-method="spanMethod"
      :data="tableData"
      border
      @row-dblclick="doubleClick"
      @current-change="setcheckRow"
      @row-click="checkRow"
      @selection-change="setcheckRows"
    >
      <el-table-column v-if="columnDatas.showSelect" :reserve-selection="columnDatas.hasRowKey" :fixed="columnDatas.selectFixed" :selectable="columnDatas.selectable" type="selection" width="50" />
      <el-table-column v-if="columnDatas.showIndex" label="序号" type="index" width="50" />
      <el-table-column v-if="columnDatas.showExpand && !columnDatas.expandAfter" label="详情" type="expand">
        <template slot-scope="props">
          <slot :data="props.row" />
        </template>
      </el-table-column>
      <!-- 没有求和的情况 -->
      <template v-if="columnDatas.noSum">
        <el-table-column
          v-for="(item,index) in columnDatas.columns"
          v-if="!item.render && (item.hasApproval ? isOpenApproval : true)"
          :key="index"
          :align="item.align"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.showOverflowTooltip? item.showOverflowTooltip : showOverflowTooltip"
        >
          <span v-if="!item.children && !item.slot" slot-scope="scope">{{ scope.row[item.prop] }}</span>
          <slot v-if="!item.children && item.slot" :name="item.slot" />
          <el-table-column v-for="(citem,cindex) in item.children" v-if="item.children" :key="cindex" :align="citem.align" :label="citem.label" :width="citem.width" :fixed="citem.fixed" :show-overflow-tooltip="item.showOverflowTooltip? item.showOverflowTooltip : showOverflowTooltip">
            <span slot-scope="scope">{{ scope.row[citem.prop] }}</span>
          </el-table-column>
        </el-table-column>
        <el-table-column v-else-if="item.render && (item.hasApproval ? isOpenApproval : true)" :key="index" :label="item.label" :width="item.width" :fixed="item.fixed" :align="item.align">
          <template slot-scope="scope">
            <table-cell :row="scope.row" :index="scope.$index" :render="item.render" />
          </template>
        </el-table-column>
      </template>
      <!-- 有求和的情况 -->
      <template v-if="!columnDatas.noSum">
        <el-table-column v-for="(item,index) in columnDatas.columns" v-if="!item.render && !item.hidden" :key="index" :label="item.label" :width="item.width" :fixed="item.fixed">
          <el-table-column
            v-if="!item.children"
            :width="item.width"
            :label="index=== 0 ? '合计' : item.sumprop && sumsData[item.sumprop] ? sumsData[item.sumprop]+'' : ''"
            :class-name="item.sumprop || index=== 0 ? 'hassum' : ''"
            :show-overflow-tooltip="item.showOverflowTooltip? item.showOverflowTooltip : showOverflowTooltip"
          >
            <span slot-scope="scope">{{ scope.row[item.prop] }}</span>
          </el-table-column>
          <el-table-column v-for="(citem,cindex) in item.children" v-if="item.children" :key="cindex" :label="citem.label" :width="citem.width" :fixed="citem.fixed">
            <el-table-column v-if="!citem.children" :width="item.width" :label="citem.sumprop && sumsData[citem.sumprop] ? sumsData[citem.sumprop]+'' : ''" :class-name="citem.sumprop ? 'hassum' : ''" :show-overflow-tooltip="item.showOverflowTooltip? item.showOverflowTooltip : showOverflowTooltip">
              <span slot-scope="scope">{{ scope.row[citem.prop] }}</span>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column v-else-if="item.render && !item.hidden" :key="index" :label="item.label" :width="item.width" :fixed="item.fixed">
          <el-table-column
            v-if="!item.children"
            :width="item.width"
            :label="index=== 0 ? '合计' : item.sumprop && sumsData[item.sumprop] ? sumsData[item.sumprop]+'' : ''"
            :class-name="item.sumprop || index=== 0 ? 'hassum' : ''"
            :show-overflow-tooltip="item.showOverflowTooltip? item.showOverflowTooltip : showOverflowTooltip"
          >
            <template slot-scope="scope">
              <table-cell :row="scope.row" :index="scope.$index" :render="item.render" />
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <el-table-column v-if="columnDatas.showExpand && columnDatas.expandAfter" label="详情" type="expand">
        <template slot-scope="props">
          <slot :data="props.row" />
        </template>
      </el-table-column>
    </el-table>
    <slot name="pages" />
    <div v-if="columnDatas.showSelectRows">
      <span style="padding-right:10px;">已选{{ checkboxData.length }}个</span>
      <el-button v-if="columnDatas.showDelete" size="mini" type="primary" @click="deleteRows">批量删除</el-button>
    </div>
  </div>
</template>

<script>
import TableCell from './table-cell' // 动态渲染用js
export default {
  name: 'DataTable',
  components: {
    TableCell
  },
  props: {
    showOverflowTooltip: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    spanMethod: {
      type: Function,
      default: () => {
        return () => { }
      }
    },
    onlyId: {
      type: String,
      default: () => {
        return 'guid'
      }
    },
    sumsData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表表头对象
    columnDatas: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    setRowKey: {
      type: Function,
      default: () => {
        return () => { }
      }
    }
  },
  data() {
    return {
      selectRow: {}, // 当前选中行
      checkboxData: [],
      ajaxData: {},
      isOpenApproval: true
    }
  },
  mounted() {
    // this.validatOpenApproval();
    // this.columnDatas.columns.forEach(item => {
    //   if (item.apiData && !item.apiData.await) {
    //     this.$set(this.ajaxData, item.apiData.apiname, [])
    //     this.$http(item.apiData.url, Object.assign({}, item.apiData.data), {
    //       ajaxType: 'none'
    //     }).then(res => {
    //       this.$set(
    //         this.ajaxData,
    //         item.apiData.apiname,
    //         Array.isArray(res.body) ? res.body : res.body.rows
    //       )
    //     })
    //   }
    // })
  },
  methods: {
    // 政策审核流程开启判断
    validatOpenApproval() {
      this.$https('/saas_insurance/ruleInfo/validatOpenApproval', {
        body: {}
      }).then(res => {
        this.isOpenApproval = res.body
      })
    },
    // 设置当前选中行
    checkRow(row, event) {
      if (row.select) return
      this.$emit('selectRow', row)
    },
    awaitAjax(data) {
      data.forEach(item => {
        this.$set(this.ajaxData, item.apiname, [])
        this.$http(item.url, item.data, { ajaxType: 'none' }).then(res => {
          this.$set(
            this.ajaxData,
            item.apiname,
            Array.isArray(res.body) ? res.body : res.body.rows
          )
        })
      })
    },
    showError(mes) {
      this.$message({
        showClose: true,
        duration: 1000,
        message: mes
      })
    },
    getSelectText(val, row, item) {
      if (item.apiData && item.apiData.listener) {
        this.$emit('selectChange', { row, item })
      }
      if (item.selectText) {
        row[item.selectText] = this.ajaxData[item.apiData.apiname].find(row => {
          return row[item.value] === val
        })[item.key]
        return
      }
      row[item.selectText] = val
    },
    // 批量删除
    deleteRows() {
      if (!this.checkboxData.length) {
        this.showError(`请选择需要删除的数据`)
        return
      }
      this.$set(
        this.tableData,
        _.pullAll(this.tableData, this.checkboxData, this.onlyId)
      )
    },
    // 设置选中行
    setcheckRows(rows) {
      this.checkboxData = rows
      this.$emit('checkRows', rows)
    },
    // 设置选中行
    setcheckRow(row) {
      this.$emit('checkRow', row)
    },
    // 行双击
    doubleClick(row) {
      this.$emit('doubleClick', row)
    }
  }
}
</script>

<style>
.el-table__fixed-body-wrapper {
  position: absolute !important;
  top: 40px !important;
}
</style>
