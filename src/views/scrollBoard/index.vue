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
                data: [
                    ['行1列1', '行1列2', '行1列3'],
                    ['行2列1', '行2列2', '行2列3'],
                    ['行3列1', '行3列2', '行3列3'],
                    ['行4列1', '行4列2', '行4列3'],
                    ['行5列1', '行5列2', '行5列3'],
                    ['行6列1', '行6列2', '行6列3'],
                    ['行7列1', '行7列2', '行7列3'],
                    ['行8列1', '行8列2', '行8列3'],
                    ['行9列1', '行9列2', '行9列3'],
                    ['行10列1', '行10列2', '行10列3'],
                    ['行10列1', '行10列2', '行10列3'],
                    ['行10列1', '行10列2', '行10列3']
                ],
                rowNum: 5,
                header: ['列1', '列2', '列3'],
            }
        }
    },
    created() {
        // this.getData();
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