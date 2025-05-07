<template>
    <div class="scroll-container" @mouseenter="pause = true" @mouseleave="pause = false">
        <transition-group name="list-up" tag="div" class="scroll-list">
            <div v-for="item in visibleItems" :key="item.id" class="list-item">
                {{ item.text }}
            </div>
        </transition-group>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            visibleItems: [
                {
                    text: '新消息1',
                    id: '1'
                },
                {
                    text: '新消息2',
                    id: '2'
                },
                {
                    text: '新消息3',
                    id: '3'
                },
                {
                    text: '新消息4',
                    id: '4'
                },
                {
                    text: '新消息5',
                    id: '5'
                }
            ],
            pause: false,
            maxVisible: 5,
            interval: 2000,
        }
    },
    mounted() {
        this.startAutoScroll()
    },
    beforeDestroy() {
        this.stopAutoScroll()
    },
    methods: {
        addNewItem() {
            const newId = Date.now()
            const newItem = {
                id: newId,
                text: `新消息 ${newId.toString().slice(-4)}`
            }
            this.visibleItems = [
                ...this.visibleItems,
                { ...newItem }
            ].slice(-this.maxVisible)
        },
        startAutoScroll() {
            this.timer = setInterval(() => {
                this.addNewItem()
            }, this.interval)
        },
        stopAutoScroll() {
            clearInterval(this.timer)
        }
    }
}
</script>
  
<style scoped lang="scss">
.scroll-container {
    height: 300px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ebedf0;
    border-radius: 4px;
}

.scroll-list {
    position: relative;
    width: 100%;
}

.list-item {
    color: #fff;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
    transition: all 0.6s ease-in-out;

}

.list-item:nth-child(odd) {
    background: #003B51;
}

.list-item:nth-child(even) {
    background: #0A2732;
}

// v-enter-active：进入动画的生效状态。应用于整个进入动画阶段。
// 在元素被插入之前添加，在过渡或动画完成之后移除。
// 这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。

.list-up-move {
    transition: all 0.6s ease-in-out;
}

.list-up-enter-active {
    transition: all 0.6s ease-in-out;
    width: 100%;

}

.list-up-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.list-up-leave-active {
    transition: all 0.6s ease-in-out;
    position: absolute;
    width: 100%;
}

/* 离开动画 */
.list-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}</style>