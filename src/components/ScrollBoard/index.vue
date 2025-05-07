<template>
    <div class="dv-scroll-board" :ref="ref">
        <div class="header" v-if="header.length && mergedConfig" :style="`background-color: ${mergedConfig.headerBGC};`">
            <div class="header-item" v-for="(headerItem, i) in header" :key="`${headerItem}${i}`" :style="`
            height: ${mergedConfig.headerHeight}px;
                        line-height: ${mergedConfig.headerHeight}px;
                        width: ${widths[i]}px;
          `"  v-html="headerItem"></div>
        </div>

        <div v-if="mergedConfig" class="rows"
            :style="`height: ${height - (header.length ? mergedConfig.headerHeight : 0)}px;`">
            <div class="row-item" v-for="(row, ri) in rows" :key="`${row.toString()}${row.scroll}`" :style="`
            height: ${heights[ri]}px;
                        line-height: ${heights[ri]}px;
                        background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
          `">
                <div class="ceil" v-for="(ceil, ci) in row.ceils" :key="`${ceil}${ri}${ci}`"
                    :style="`width: ${widths[ci]}px;`" @click="emitEvent('click', ri, ci, row, ceil)"
                    @mouseenter="handleHover(true, ri, ci, row, ceil)" @mouseleave="handleHover(false)">
                    <div class="text" v-if="ceil" v-html="ceil"></div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import autoResize from '@/mixin/autoResize'
import { deepMerge,deepClone } from '@/utils/index'
export default {
    name: 'DvScrollBoard',
    mixins: [autoResize],
    props: {
        config: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            ref: 'scroll-board',

            defaultConfig: {
                /**
                 * @description Board header
                 * @type {Array<String>}
                 * @default header = []
                 * @example header = ['column1', 'column2', 'column3']
                 */
                header: [],
                /**
                 * @description Board data
                 * @type {Array<Array>}
                 * @default data = []
                 */
                data: [],
                /**
                 * @description Row num
                 * @type {Number}
                 * @default rowNum = 5
                 */
                rowNum: 5,
                /**
                 * @description Header background color
                 * @type {String}
                 * @default headerBGC = '#00BAFF'
                 */
                headerBGC: '#00BAFF',
                /**
                 * @description Odd row background color
                 * @type {String}
                 * @default oddRowBGC = '#003B51'
                 */
                oddRowBGC: '#003B51',
                /**
                 * @description Even row background color
                 * @type {String}
                 * @default evenRowBGC = '#003B51'
                 */
                evenRowBGC: '#0A2732',
                /**
                 * @description Scroll wait time
                 * @type {Number}
                 * @default waitTime = 2000
                 */
                waitTime: 2000,
                /**
                 * @description Header height
                 * @type {Number}
                 * @default headerHeight = 35
                 */
                headerHeight: 35,
                /**
                 * @description Column width
                 * @type {Array<Number>}
                 * @default columnWidth = []
                 */
                columnWidth: [],
                /**
                 * @description Column align
                 * @type {Array<String>}
                 * @default align = []
                 * @example align = ['left', 'center', 'right']
                 */
                align: [],
                /**
                 * @description Show index
                 * @type {Boolean}
                 * @default index = false
                 */
                index: false,
                /**
                 * @description index Header
                 * @type {String}
                 * @default indexHeader = '#'
                 */
                indexHeader: '#',
                /**
                 * @description Carousel type
                 * @type {String}
                 * @default carousel = 'single'
                 * @example carousel = 'single' | 'page'
                 */
                carousel: 'single',
                /**
                 * @description Pause scroll when mouse hovered
                 * @type {Boolean}
                 * @default hoverPause = true
                 * @example hoverPause = true | false
                 */
                hoverPause: true,
                direction:'up'
            },

            mergedConfig: null,

            header: [],

            rowsData: [],

            rows: [],

            widths: [],

            heights: [],

            avgHeight: 0,

            aligns: [],

            animationIndex: 0,

            animationHandler: '',

            updater: 0,

            needCalc: false
        }
    },
    watch: {
        config() {

            const { stopAnimation, calcData } = this

            stopAnimation()

            this.animationIndex = 0

            calcData()
        }
    },
    methods: {
        handleHover(enter, ri, ci, row, ceil) {

            if (enter) this.emitEvent('mouseover', ri, ci, row, ceil)
            if (!this.mergedConfig.hoverPause) return

            if (enter) {
                this.stopAnimation()
            } else {
                this.animation(true)
            }
        },
        afterAutoResizeMixinInit() {
            this.calcData()
        },
        onResize() {

            if (!this.mergedConfig) return

            this.calcWidths()

            this.calcHeights()
        },
        calcData() {

            this.mergeConfig()

            this.calcHeaderData()

            this.calcRowsData()

            this.calcWidths()

            this.calcHeights()

            this.animation(true)
        },
        mergeConfig() {
            this.mergedConfig = deepMerge(deepClone(this.defaultConfig,new WeakMap()), this.config || {})
        },
        calcHeaderData() {
            let { header, index, indexHeader } = this.mergedConfig

            if (!header.length) {
                this.header = []

                return
            }

            header = [...header]

            if (index) header.unshift(indexHeader)

            this.header = header
        },
        calcRowsData() {
            let { data, index, headerBGC, rowNum } = this.mergedConfig
            
            if (index) {
                data = data.map((row, i) => {
                    row = [...row]
                
                    const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`

                    row.unshift(indexTag)
                  
                    return row
                })
            }

            data = data.map((ceils, i) => ({ ceils, rowIndex: i }))

            const rowLength = data.length
            // 数据长度大于设定的一页但是小于两页时，数据翻倍
            if (rowLength > rowNum && rowLength < 2 * rowNum) {
                data = [...data, ...data]
            }

            data = data.map((d, i) => ({ ...d, scroll: i }))
            this.rowsData = data
            this.rows = data
        },
        calcWidths() {
            const { width, mergedConfig, rowsData } = this

            const { columnWidth, header } = mergedConfig

            const usedWidth = columnWidth.reduce((all, w) => all + w, 0)

            let columnNum = 0
            if (rowsData[0]) {
                columnNum = rowsData[0].ceils.length
            } else if (header.length) {
                columnNum = header.length
            }

            const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length)

            const widths = new Array(columnNum).fill(avgWidth)

            this.widths = deepMerge(widths, columnWidth)
            
        },
        // 每一行的高度，去掉是否配置的heander高度
        calcHeights(onresize = false) {
          
            const { headerHeight, rowNum, data } = this.mergedConfig

            let allHeight = this.height

            if (this.header.length) allHeight -= headerHeight

            const avgHeight = allHeight / rowNum

            this.avgHeight = avgHeight

            if (!onresize) this.heights = new Array(data.length).fill(avgHeight)
        },
        async animation(start = false) {
        
            if (this.needCalc) {
                this.calcRowsData()
                this.calcHeights()
                this.needCalc = false
            }

            const { waitTime, carousel, rowNum, direction } = this.mergedConfig

            const rowLength = this.rowsData.length
            // 数据长度小于设定的一页时，不需要动画
            if (rowNum >= rowLength) return
      
            if (start) {
                await new Promise(resolve => setTimeout(resolve, waitTime))
                if (this.updater !== this.updater) return
            }
            // 动画轮播数量单个或者页面
            const animationNum = carousel === 'single' ? 1 : rowNum
            // 向上滚动or向下滚动
            if(direction == 'up'){
                // 数据递减
                let rows = this.rowsData.slice(this.animationIndex)
                // 去除的数据补充到尾部
                rows.push(...this.rowsData.slice(0, this.animationIndex))
                
                this.rows = rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1)
                this.heights = new Array(rowLength).fill(this.avgHeight)

                await new Promise(resolve => setTimeout(resolve, 100))
                if (this.updater !== this.updater) return

                this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))

                this.animationIndex += animationNum
                
                const back = this.animationIndex - rowLength
                if (back >= 0) {
                    this.animationIndex = back
                }

                this.animationIndex = this.animationIndex
                this.animationHandler = setTimeout(this.animation, waitTime - 300);
            } else {
                // [1,2,3,4,5,6,7,8,9,10]
                // 数据递减
                let rows = this.rowsData.slice(0,rowLength - this.animationIndex)
                // 去除的数据补充到尾部
                rows.unshift(...this.rowsData.slice(rowLength - this.animationIndex,rowLength))
                
                this.rows = rows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1)
                this.heights = new Array(rowLength).fill(this.avgHeight)

                await new Promise(resolve => setTimeout(resolve, 100))
                if (this.updater !== this.updater) return

                this.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))

                this.animationIndex += animationNum
                
                const back = this.animationIndex - rowLength
                if (back >= 0) {
                    this.animationIndex = back
                }

                this.animationIndex = this.animationIndex
                this.animationHandler = setTimeout(this.animation, waitTime - 300);
            }
        },
        stopAnimation() {
      
            this.updater = this.updater + 1;

            if (!this.animationHandler) return

            clearTimeout(this.animationHandler)
        },
        emitEvent(type, ri, ci, row, ceil) {
            const { ceils, rowIndex } = row

            this.$emit(type, {
                row: ceils,
                ceil,
                rowIndex,
                columnIndex: ci
            })
        },
        updateRows(rows, animationIndex) {
            const { mergedConfig, animationHandler, animation } = this

            this.mergedConfig = {
                ...mergedConfig,
                data: [...rows]
            }

            this.needCalc = true

            if (typeof animationIndex === 'number') this.animationIndex = animationIndex
            if (!animationHandler) animation(true)
        }
    },
    destroyed() {
        const { stopAnimation } = this

        stopAnimation()
    }
}
</script>
  
<style lang="scss">
.dv-scroll-board {
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;

    .text {
        padding: 0 10px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .header {
        display: flex;
        flex-direction: row;
        font-size: 15px;

        .header-item {
            div {
                transition: all 0.3s;
            }
            transition: all 0.3s;
        }
    }

    .rows {
        overflow: hidden;
        .row-item {
            display: flex;
            font-size: 14px;
            transition: all 0.3s;
            
            div {
                transition: all 0.3s;
            }
        }


        .index {
            border-radius: 3px;
            padding: 0px 3px;
        }
    }
}
</style>