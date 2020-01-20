<template>
  <div class="main-form">
    <el-form ref="ruleForm" :model="ruleFormData" :rules="rules" class="add-ruleForm" :label-width="'110px'" inline>
      <el-form-item v-for="m in ruleFormRow" :key="m.prop" :label="m.label" :prop="m.prop" size="mini" :disabled="disabled" :required="m.required">
        <el-input v-if="m.type==='input'" v-model="ruleFormData[m.prop]" :clearable="true" :placeholder="m.placeholder" :disabled="m.disabled||disabled" :readonly="m.readonly" />

        <slot v-if="m.slot" :name="m.slot" />

        <el-select v-if="m.type==='select' && !m.apiData" v-model="ruleFormData[m.prop]" :clearable="false" :filterable="m.filterable" :multiple="m.multiple" :placeholder="m.placeholder" :disabled="m.disabled||disabled" :readonly="m.readonly" @change="(val)=>{getSelectText(val,m)}">
          <el-option v-for="n in m.options" :key="n.value" :label="n[m.key]" :value="n[m.value]" />
        </el-select>

        <el-select v-if="m.type==='select' && m.apiData" v-model="ruleFormData[m.prop]" :clearable="false" :filterable="m.filterable" :multiple="m.multiple" :placeholder="m.placeholder" :disabled="m.disabled||disabled" :readonly="m.readonly" @change="(val)=>{getSelectText(val,m)}">
          <el-option v-for="n in ajaxData[m.apiData.apiname]" :key="n.value" :label="n[m.key]" :value="n[m.value]" />
        </el-select>

        <el-date-picker
          v-if="m.type==='datetime' || m.type==='date'"
          v-model="ruleFormData[m.prop]"
          style="width: 167px;"
          :editable="false"
          :clearable="false"
          :picker-options="m.pickerOptions"
          :value-format="m.format ? m.format : 'yyyy-MM-dd hh:mm:ss'"
          :type="m.type ? m.type : datetime"
          :disabled="m.disabled||disabled"
          :readonly="m.readonly"
          :placeholder="m.placeholder"
          @change="val=>{getDate(val,m)}"
        />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { rename } from 'fs'
export default {
  name: 'SearchForm',
  props: {
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    ruleFormData: {
      type: Object,
      default: () => {
        return {}
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
      key: ''
    }
  },
  created() {
    Object.keys(this.ruleFormData).forEach(k => {
      this.rules && this.rules[k] ? this.showRules[k] = this.rules[k] : this.showRules[k] = []
    })
    // this.doSearch();
  },
  mounted() {
    this.ruleFormRow.forEach(item => {
      if (item.apiData) {
        this.$set(this.ajaxData, item.apiData.apiname, [])
        this.$http({
          url: this.$http.adornUrl(item.apiData.url),
          method: 'post',
          data: this.$http.adornData({ body: item.apiData.data })
        }).then(({ data }) => {
          const datas = Array.isArray(data.body) ? data.body : []
          this.$set(this.ajaxData, item.apiData.apiname, item.apiData.issort ? datas.reverse() : datas)
        })
      }
    })
  },
  methods: {
    awaitAjax(data) {
      data.forEach(item => {
        this.$set(this.ajaxData, item.apiname, [])
        this.$http(
          item.url,
          item.data,
          { ajaxType: 'none' }
        ).then((res) => {
          const datas = Array.isArray(res.body) ? res.body : res.body.rows
          this.$set(this.ajaxData, item.apiname, item.issort ? datas.reverse() : datas)
        })
      })
    },
    getDate(val, m) {
      this.$set(this.ruleFormData, m.prop, !val ? '' : val)
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
      row.apiData && row.apiData.listener ? this.$emit('formSelectChange', { val, row, k }) : null
    },
    resetForm() {
      this.$resetForm(this.$refs.ruleForm)
      this.$emit('resetForm')
    },
    doSearch() {
      this.$emit('doSearch', this.ruleFormData)
    },
    doExport() {
      this.$emit('doExport', this.ruleFormData)
    }
  }
}
</script>

<style lang="scss">
div.main-form {
  padding: 0px;
  padding-bottom: 0;
  .botton-row {
    margin-bottom: 20px;
    float: right;
  }
  .botton-row-left {
    margin-bottom: 5px;
    float: left;
  }
  .add-ruleForm {
    // border-top: 1px solid #dadada;
    padding-top: 10px;
    .el-form-item {
      width: 315px;
      margin-right: 0px;
      height: 30px;
    }
    .el-form-item:nth-child(3n) {
      margin-right: 0px;
    }
    .slot {
      width: 167px;
    }
    .el-select {
      width: 167px;
    }
    .el-input {
      width: 167px;
    }
    .el-date-editor {
      width: 167px;
    }
  }
}
</style>
