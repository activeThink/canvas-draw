<template>
    <div>
        <el-row>
            <el-col :span="12">
                <ScrollDown/>
            </el-col>
            <el-col :span="12">
                <ScrollUp/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ScrollDown from '@/components/ScroolList/DownList';
import ScrollUp from '@/components/ScroolList/UpList'
export default {
  components:{
    ScrollDown,
    ScrollUp
  },
  data() {
    return {

    }
  }
}
</script>

<style></style>