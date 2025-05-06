<template>
    <div class="scroll-board-page">
        <ScrollBoard :config="config"></ScrollBoard>
    </div>
</template>

<script>
import ScrollBoard from '@/components/ScrollBoard/index.vue'
export default {
    components: {
        ScrollBoard
    },
    data() {
        return {
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            config: {
                data: [],
                rowNum: 5
            }
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.data.forEach(e => {
                this.config.data.push([
                    `<div style="line-height:1;">
                        <div>编号：${e}</div>  
                        <div style="padding:8px 0 3px 0;">姓名：张三</div>  
                        <div style="padding:0 0 8px 0;">手机：1388888888---${e}</div>
                      </div>`
                ]);
            });
        }
    }
}
</script>

<style lang="scss">
.scroll-board-page {
    height: 500px;
}
</style>