# ppt-live
ppt-live

<template lang="pug">
.data-table(v-loading="loading",:element-loading-text="$t('加载中')")
  el-row.table-top(v-if="search || cols")
    slot(name="top")
    el-input.search-input(
      v-if="search",
      v-model="searchText",
      :class="['pull-'+searchPosition]",
      :placeholder="$t('搜索')",
      icon="search",
      size="small")
    .col-setting(v-if="cols", :class="['pull-'+colsPosition]")
      el-checkbox-group.col-setting-selects(v-model="showCols", size="small")
        el-checkbox-button(
          v-for="col in computedCols",
          :key="col.prop",
          :label="col.prop",
          :disabled="col.disabled") {{ $t(col.label) }}
      .col-setting-buttons
        el-button(type="text", size="small", @click.stop="setShowCols('normal')") {{ $t('重置') }}
        el-button(type="text", size="small", @click.stop="setShowCols('all')") {{ $t('全选') }}
  el-table(
    v-if="showTable",
    :border="border",
    :show-summary="showSummary",
    :show-header="showHeader",
    :summary-method="summaryMethod ? summaryMethod : null",
    :sum-text="sumText",
    :data="searchedData",
    :style="styles.style",
    :height="styles.height",
    :max-height="maxHeight || computedHeight || 600",
    @expand="expandHandler",
    :row-key="rowKey",
    :expand-row-keys="expandRowKeys",
    :row-class-name="rowClassNameFn",
    @selection-change="handleSelect",
    @sort-change="handlerSortChange")
    //- 序列
    el-table-column(v-if="index",type="index",width="70",label="#",align="center")
    //- 多选
    el-table-column(v-if="showSelect",type="selection",width="55",align="center")
    //- 多级表头
    el-table-column(
      v-for="row in showTitles",
      :key="row.prop || row.slot",
      v-if="row.children",
      :label="$t(row.label)",
      :align="row.align || 'center'")
      //- 二级, slot
      el-table-column(
        v-for="child in row.children",
        :key="child.prop || child.slot",
        v-if="child.slot",
        :label="$t(child.label)",
        :fixed="child.fixed",
        :width="child.width",
        :min-width="child['min-width']",
        :prop="child.prop",
        :show-overflow-tooltip="child.tooltip",
        :align="child.align || 'center'",
        :sortable="child.sortable")
        template(scope="scope")
          slot(:name="child.slot", :row="scope.row")
      //- 二级, expand
      el-table-column(v-else-if="child.expand", type="expand")
        template(scope="scope")
          slot(:name="child.expand", :row="scope.row")
      //- 二级, normal
      el-table-column(
        v-else,
        :prop="child.prop",
        :label="$t(child.label)",
        :width="child.width",
        :fixed="child.fixed",
        :min-width="child['min-width']",
        :show-overflow-tooltip="child.tooltip",
        :align="child.align || 'center'",
        :sortable="child.sortable")
    //- slot
    el-table-column(
      v-else-if="row.slot",
      :label="$t(row.label)",
      :fixed="row.fixed",
      :width="row.width",
      :min-width="row['min-width']",
      :prop="row.prop",
      :show-overflow-tooltip="row.tooltip",
      :align="row.align || 'center'",
      :sortable="row.sortable")
      template(scope="scope")
        slot(:name="row.slot", :row="scope.row")
    //- expand
    el-table-column(v-else-if="row.expand", type="expand")
      template(scope="scope")
        slot(:name="row.expand", :row="scope.row")
    //- normal
    el-table-column(
      v-else,
      :prop="row.prop",
      :label="$t(row.label)",
      :width="row.width",
      :fixed="row.fixed",
      :min-width="row['min-width']",
      :show-overflow-tooltip="row.tooltip",
      :align="row.align || 'center'",
      :sortable="row.sortable")
    template(slot="append")
      slot(name="append")
  //- 分页
  el-row.table-bottom
    slot(name="bottom")
    el-pagination(
      v-if="page",
      :class="['pull-'+pagePosition]",
      :page-size="pageSize",
      :current-page="currentPage",
      @size-change="handleSizeChange",
      @current-change="handleCurrentChange",
      :page-sizes="[15, 20, 30, 50, 100]",
      layout="total, sizes, prev, pager, next, jumper",
      :total="totalNum")
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'data-table',

  data () {
    return {
      showTable: true,
      pageSize: 15,
      currentPage: 1,
      searchText: '',
      sortOption: { prop: '', order: '' },
      showCols: []
    }
  },

  props: {
    cols: {
      type: Object,
      default: null
    },
    colsPosition: {
      type: String,
      default: 'left'
    },
    rowClassName: {
      type: String | Function,
      default: ''
    },
    expandRowKeys: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String | Function,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    searchPosition: {
      type: String,
      default: 'right'
    },
    page: {
      type: Boolean,
      default: false
    },
    pagePosition: {
      type: String,
      default: 'right'
    },
    sumText: {
      type: String,
      default: '合计'
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    gridArr: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: Array,
      default: () => []
    },
    index: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => {
        return {
          style: {
            width: '100%'
          }
        }
      }
    },
    maxHeight: {
      type: String | Number,
      default: 0
    },
    autoHeight: {
      type: Number,
      default: 70
    },
    summaryMethod: {
      type: Function | Object,
      default: null
    },
    expandHandler: {
      type: Function,
      default: () => {}
    },
    handleSelect: {
      type: Function,
      default: () => {}
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters(['HEIGHT']),

    computedTitle () {
      let titles = this.title

      function getTitles (arr) {
        let result = []
        arr.forEach(item => {
          if (item.children) result = result.concat(getTitles(item.children))
          if (item.prop || item.slot) result.push(item)
        })
        return result
      }

      return getTitles(titles)
    },

    computedCols () {
      let cols = this.cols
      if (!cols) return null

      if (cols === true) {
        let titles = this.computedTitle
        return titles.map(title => { return { label: title.label, prop: title.prop || title.slot } })
      } else {
        let titles = this.computedTitle
        return titles.map(title => {
          let label = title.label
          let prop = title.prop || title.slot
          let setting = cols[prop]
          let option = { label, prop }
          if (!setting) {
            return option
          } else if (typeof setting === 'string') {
            return { ...option, [setting]: true }
          } else {
            setting.forEach(item => option[item] = true)
            return option
          }
        })
      }
    },

    hideCols () {
      let cols = this.computedCols
      let shows = this.showCols
      if (!cols) return null
      return cols.filter(col => !shows.includes(col.prop)).map(col => col.prop)
    },

    showTitles () {
      let hideCols = this.hideCols
      let titles = JSON.parse(JSON.stringify(this.title))
      if (!hideCols) return titles
      return titles.filter(title => {
        if (title.children) {
          title.children = title.children.filter(child => !hideCols.includes(child.prop || child.slot))
          return !hideCols.includes(title.prop || title.slot) && title.children.length
        }
        return !hideCols.includes(title.prop || title.slot)
      })
    },

    requestOption () {
      return {
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      }
    },

    computedHeight () {
      return this.HEIGHT - this.autoHeight
    },

    totalNum () {
      return this.searchedData.length
    },

    searchedData () {
      let search = this.search
      let text = this.searchText
      let result = this.data
      if (!result.length || !text || !search) return result

      // 搜索
      let reg = new RegExp(this.searchText, 'i')
      result = result.filter(row => {
        let texts = ''
        for (let i in row) { texts += `${row[i]} ` }
        return reg.test(texts)
      })

      return result
    },

    showDataIndex () {
      let page = this.page
      let result = this.searchedData
      if (!result.length || !page) return [0, result.length ? result.length - 1 : 0]

      // 分页筛选
      let pageSize = this.pageSize
      let currentPage = this.currentPage
      let start = pageSize * (currentPage - 1)
      let end = start + pageSize
      return [start, end - 1]
    }
  },

  created () {
    this.setShowCols()
  },

  mounted () {
    this.colspan(this.gridArr)
  },

  watch: {
    'data': {
      handler () { this.colspan(this.gridArr) },
      deep: true
    },
    'title': {
      handler () { this.colspan(this.gridArr) },
      deep: true
    },
    'cols': 'setShowCols',
    'showTitles': 'resetTable'
  },

  methods: {
    // 合并单元格
    SpanGrid (tabObj, cellindex = 0, beginRow = 0) {
      if (!tabObj) return false

      let i, j
      let intSpan
      let strTemp

      for (i = beginRow; i < tabObj.rows.length; i++) {
        intSpan = 1
        strTemp = tabObj.rows[i].cells[cellindex].innerText

        for (j = i + 1; j < tabObj.rows.length; j++) {
          if (strTemp === tabObj.rows[j].cells[cellindex].innerText) {
            intSpan++
            tabObj.rows[i].cells[cellindex].rowSpan = intSpan
            tabObj.rows[j].cells[cellindex].classList.add('hide')
          } else { break }
        }
      }

      i = j - 1
    },
    // 重置被合并的单元格
    resetGrid (tabObj) {
      if (!tabObj) return false

      for (let row of tabObj.rows) {
        for (let cell of row.cells) {
          cell.rowSpan = 1
          cell.classList.remove('hide')
        }
      }
    },
    // 合并element表格的单元格
    colspan (gridArr) {
      this.$nextTick(function () {
        let tableEl = this.$el.querySelector('.el-table__body-wrapper table')

        this.resetGrid(tableEl)

        gridArr.forEach(i => { this.SpanGrid(tableEl, i) })
      })
    },

    handleSizeChange (val) {
      this.pageSize = val
    },

    handleCurrentChange (val) {
      this.currentPage = val
    },

    handlerSortChange ({column, prop, order}) {
      this.sortOption = { prop, order }
    },

    setShowCols (type = 'normal') {
      let val = this.computedCols
      if (!val) return

      if (type === 'normal') {
        this.showCols = val.filter(col => !col.hide).map(col => col.prop)
      } else if (type === 'all') {
        this.showCols = val.filter(col => {
          if (col.disabled) return this.showCols.includes(col.prop)
          else return true
        }).map(col => col.prop)
      }
    },

    rowClassNameFn (row, index) {
      let rowClassName = typeof this.rowClassName === 'string' ? this.rowClassName : this.rowClassName()
      let [start, end] = this.showDataIndex
      let result = index >= start && index <= end ? '' : 'hide'
      return rowClassName + ' ' + result
    },

    resetTable () {
      this.showTable = false
      this.$nextTick(() => this.showTable = true)
    }
  }
}
</script>

<style scoped>
.table-top {
  margin-bottom: 5px;
  padding: 0 5px;
}

.table-bottom {
  margin-top: 5px;
  padding: 0 5px;
}

.search-input {
  width: 250px;
}

.hide {
  display: none;
}

.col-setting-selects {
  display: inline-block;
}

.col-setting-buttons {
  display: inline-block;
  margin-left: 10px;
}
</style>

<style>
.col-setting-selects .el-checkbox-button.is-checked .el-checkbox-button__inner {
  color: #13ce66;
  background-color: transparent;
  border: transparent;
  box-shadow: none;
  padding-top: 4px;
  padding-left: 0;
  padding-right: 0;
}

.col-setting-selects .el-checkbox-button .el-checkbox-button__inner {
  color: #ff4949;
  background-color: transparent;
  border: transparent;
  box-shadow: none;
  padding-top: 4px;
  padding-left: 0;
  padding-right: 0;
}

.col-setting-selects
  .el-checkbox-button:first-child
  .el-checkbox-button__inner {
  border: none;
}

.col-setting-selects
  .el-checkbox-button.is-disabled
  .el-checkbox-button__inner {
  -webkit-filter: grayscale(100%);
  background-color: transparent;
}

.col-setting-selects
  .el-checkbox-button:not(:last-child)
  .el-checkbox-button__inner:after {
  content: "-";
  margin: 0 5px;
  color: #475669;
}
</style>

