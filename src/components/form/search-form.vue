<template>
  <div class="main-form">
    <el-form ref="ruleForm" :model="ruleFormData" :rules="showRules" class="search-ruleForm" :label-width="labelWidth" inline>
      <div v-if="showExport" class="botton-row">
        <slot name="export-slot" />
        <!-- <el-button @click="doExport" type="primary">导出Excel</el-button> -->
      </div>

      <el-form-item v-for="m in ruleFormRow" v-if="(m.hasApproval ? isOpenApproval : true)" :key="m.prop" :label="m.label" :prop="m.prop" size="mini" :class="m.type === 'datetimerange' ? 'time-size':'default-form'">
        <el-input v-if="m.type==='input'" v-model="ruleFormData[m.prop]" :clearable="true" :placeholder="m.placeholder" :disabled="m.disabled" :readonly="m.readonly" />
        <slot v-if="m.slot" :name="m.slot" />

        <el-select v-if="m.type==='select' && !m.apiData" v-model="ruleFormData[m.prop]" :clearable="true" :filterable="m.filterable" :multiple="m.multiple" :placeholder="m.placeholder" :disabled="m.disabled" :readonly="m.readonly" @change="(val)=>{getSelectText(val,m)}">
          <el-option v-for="n in m.options" :key="n.value" :label="n[m.key]" :value="n[m.value]" />
        </el-select>

        <el-select v-if="m.type==='select' && m.apiData" v-model="ruleFormData[m.prop]" :clearable="true" :filterable="m.filterable" :multiple="m.multiple" :placeholder="m.placeholder" :disabled="m.disabled" :readonly="m.readonly" @change="(val)=>{getSelectText(val,m)}">
          <el-option v-for="n in ajaxData[m.apiData.apiname]" :key="n.value" :label="n[m.key]" :value="n[m.value]" />
        </el-select>

        <el-date-picker
          v-if="m.type==='datetime'"
          v-model="ruleFormData[m.prop]"
          style="width: 200px;"
          :default-time="m.defaultTime"
          :editable="false"
          :clearable="true"
          :picker-options="m.pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :disabled="m.disabled"
          :readonly="m.readonly"
          :placeholder="m.placeholder"
          @change="val=>{getDate(val,m)}"
        />

        <el-date-picker
          v-if="m.type==='datetimerange'"
          v-model="ruleFormData[m.prop]"
          style="width: 325px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          align="right"
          :start-placeholder="m.startPlaceholder"
          :end-placeholder="m.endPlaceholder"
          :default-time="['00:00:00', '23:59:59']"
          @change="timeSizeToTime(m)"
        />
      </el-form-item>
      <!-- <el-button @click="resetForm" v-if="showClean" class="botton-row">清除条件</el-button>
      <el-button v-if="showExport" @click="doExport" type="primary" class="botton-row">导出</el-button>
      <el-button v-if="showAdd" icon="el-icon-circle-plus-outline" @click="doAdd" type="primary" class="botton-row">新增</el-button>
      <el-button @click="doSearch" type="primary" icon="el-icon-search" class="botton-row">查询</el-button>
      <el-button v-if="showHide" @click="doSearchHide" type="primary" icon="el-icon-search" class="botton-row">显示所有</el-button> -->
      <div class="botton-row">
        <slot name="search-slot" />
        <el-button v-if="showExport" type="primary" class="botton-row" @click="doExport">导出</el-button>
        <el-button v-if="showAdd" icon="el-icon-circle-plus-outline" type="primary" class="botton-row" @click="doAdd">新增</el-button>
        <el-button v-if="showHide" type="primary" icon="el-icon-search" class="botton-row" @click="doSearchHide">显示所有</el-button>
        <el-button type="primary" icon="el-icon-search" class="botton-row" @click="doSearch">查询</el-button>
      </div>
    </el-form>

    <!-- <div class="botton-row-left" v-if="showExport">

    </div>-->
  </div>
</template>

<script>
import { rename } from 'fs'
import { defaultCoreCipherList } from 'constants'
export default {
  name: 'SearchForm',
  props: {
    labelWidth: {
      type: String,
      default: () => {
        return '95px'
      }
    },
    ruleFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showAdd: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showClean: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showExport: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showHide: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    ruleFormRow: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showRules: {},
      ajaxData: {},
      key: '',
      isOpenApproval: true
    }
  },
  created() {
    // this.validatOpenApproval();
    Object.keys(this.ruleFormData).forEach(k => {
      this.rules && this.rules[k]
        ? (this.showRules[k] = this.rules[k])
        : (this.showRules[k] = [])
    })
    // this.doSearch();
  },
  mounted() {
    // this.ruleFormRow.forEach(item => {
    //   if (item.apiData) {
    //     this.$set(this.ajaxData, item.apiData.apiname, [])
    //     this.$https(item.apiData.url, Object.assign({}, item.apiData.data)).then(res => {
    //       let datas = Array.isArray(res.body) ? res.body : res.body.rows
    //       this.$set(
    //         this.ajaxData,
    //         item.apiData.apiname,
    //         item.apiData.issort ? datas.reverse() : datas
    //       )
    //     })
    //   }
    // })
  },
  methods: {
    // 政策审核流程开启判断
    validatOpenApproval() {
      this.$https('/saas_insurance/ruleInfo/validatOpenApproval', { body: {}}).then(res => {
        this.isOpenApproval = res.body
        console.log('validatOpenApproval==>', this.isOpenApproval)
      })
    },
    // 时间范围装进data里的时间
    timeSizeToTime(m) {
      if (this.ruleFormData[m.prop] && this.ruleFormData[m.prop].length === 2) {
        this.ruleFormData[m.startTime] = this.ruleFormData[m.prop][0]
        this.ruleFormData[m.endTime] = this.ruleFormData[m.prop][1]
      } else {
        this.ruleFormData[m.startTime] = null
        this.ruleFormData[m.endTime] = null
      }
    },
    awaitAjax(data) {
      data.forEach(item => {
        this.$set(this.ajaxData, item.apiname, [])
        this.$https(item.url, item.data, { ajaxType: 'none' }).then(res => {
          const datas = Array.isArray(res.body) ? res.body : res.body.rows
          this.$set(
            this.ajaxData,
            item.apiname,
            item.issort ? datas.reverse() : datas
          )
        })
      })
    },
    getDate(val, m) {
      this.$set(this.ruleFormData, m.prop, !val ? null : val)
      if (m.listener) {
        this.$emit('dateChange', this.ruleFormData[m.prop])
      }
    },
    getSelectText(val, row) {
      const k = row.apiData ? this.ajaxData[row.apiData.apiname] : row.options
      if (row.selectText && !row.multiple) {
        this.ruleFormData[row.selectText] = k.find(item => {
          return item[row.value] === val
        })[row.key]
      }
      row.apiData && row.apiData.listener
        ? this.$emit('formSelectChange', { val, row, k })
        : null
    },
    resetForm() {
      this.$resetForm(this.$refs.ruleForm)
      this.$emit('resetForm')
    },
    doSearch() {
      this.$emit('doSearch', this.ruleFormData)
    },
    doSearchHide() {
      this.$emit('doSearchHide', this.ruleFormData)
    },
    doExport() {
      this.$emit('doExport', this.ruleFormData)
    },
    doAdd() {
      this.$emit('doAdd', this.ruleFormData)
    }
  }
}
</script>

<style lang="scss">
div.main-form {
  padding: 0px;
  padding-bottom: 0;
  .botton-row {
    margin-left: 10px;
    margin-bottom: 2px !important;
    float: right;
  }
  .botton-row-left {
    margin-bottom: 5px;
    float: left;
  }
  .search-ruleForm {
    // border-top: 1px solid #dadada;
    padding-top: 0px;
    .default-form {
      width: 325px;
      margin-right: 0px;
      height: 30px;
    }
    // .default-form:nth-child(5n) {
    //   margin-right: 0px;
    // }
    .time-size {
      width: 500px;
    }
    .slot {
      width: 200px;
    }
    .el-select {
      width: 200px;
    }
    .el-input {
      width: 200px;
    }
    .el-date-editor {
      width: 200px;
    }
  }
}
</style>
