<template>
    <div class="scroll-item-cell">{{ index+1 }}：姓名：{{ source.nanickNameme }},英文名：{{ source.name }},性别：{{ source.gender }}</div>
</template>
  
<script>
export default {
    name: 'item-component',
    props: {
        index: { 
            type: Number
        },
        source: { 
            type: Object,
            default() {
                return {}
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll-item-cell {
    padding-left: 10px;
    height: 50px;
    line-height: 50px;
}

</style>