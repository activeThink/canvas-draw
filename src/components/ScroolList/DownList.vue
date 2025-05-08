<template>
    <div class="scroll-container">
        <transition-group name="list-scroll" tag="ul" class="scroll-list">
            <li v-for="item in list" :key="item.id" class="list-item">
                {{ item.text }}
            </li>
        </transition-group>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            list: [
                { id: 1, text: '第一条消息' },
                { id: 2, text: '第二条通知' },
                { id: 3, text: '第三条提醒' },
                { id: 4, text: '第四条提醒' },
                { id: 5, text: '第五条提醒' },
                { id: 6, text: '第六条提醒' }
            ],
            maxItems: 5 // 最大显示条目数
        }
    },
    mounted() {
        // 模拟数据更新
        setInterval(() => {
            this.addNewItem()
        }, 2000)
    },
    methods: {
        addNewItem() {
            const newId = Date.now()
            const newItem = {
                id: newId,
                text: `新消息 ${newId.toString().slice(-4)}`
            }

            // 添加新条目并限制最大数量
            this.list = [newItem, ...this.list].slice(0, this.maxItems)
        },
    }
}
</script>
  
<style scoped lang="scss">
.scroll-container {
    height: 300px;
    overflow: hidden;
    position: relative;
    border-radius: 4px;
    background: #02384C; 
    .scroll-list {
        padding: 0;
        margin: 0;
        list-style: none;
        position: relative;
    }

    .list-item {
        color: #fff;
        font-size: 20px;
        height: 60px;
        line-height: 60px;
        transition: all 0.5s ease;

    }

    .list-item:nth-child(odd) {
        background: #003B51;
    }

    .list-item:nth-child(even) {
        background: #0A2732;
    }

    /* 进入动画 */
    .list-scroll-enter-active {
        transition: all 0.5s ease;
    }

    .list-scroll-enter-to {
        transform: translateY(0);
    }

    /* 离开动画 */
    .list-scroll-leave-active {
        transition: all 0.5s ease;
    }

    .list-scroll-leave-to {
        transform: translateY(100%);
        opacity: 0;
    }
}
</style>