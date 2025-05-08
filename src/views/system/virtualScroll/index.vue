<template>
    <div>
        <div class="total-num">总共：{{ list.length }}条数据</div>
        <div class="virtual-list-main">

            <virtual-list style="height: 560px; overflow-y: auto;" :data-key="'id'" :data-sources="list"
                :data-component="itemComponent" item-class="scroll-item"></virtual-list>
        </div>
    </div>
</template>

<script>
import ScrollItem from '@/components/ScrollItem/index.vue';
import VirtualList from 'vue-virtual-scroll-list';
import { nanoid } from 'nanoid';
import mockjs from 'mockjs';
let personRes = mockjs.mock({
    'list|10000': [{ name: '@name', id: nanoid(), nickName: '@cname', 'gender|1': ['MALE', 'FEMALE'] }],
});

export default {
    name: 'VirtualScroll',
    components: { 'virtual-list': VirtualList },
    data() {
        return {
            list: personRes.list,
            itemComponent: ScrollItem,
        }
    }
}
</script>

<style lang="scss" scoped>
.total-num {
    padding: 10px 0;
    font-size: 18px;
    font-weight: bold;
}

.virtual-list-main {
    border: 1px solid gray;

    ::v-deep.scroll-item:nth-child(odd) {
        background: #ccc;
    }
}
</style>