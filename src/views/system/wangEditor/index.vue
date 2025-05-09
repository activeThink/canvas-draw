<template>
    <div>
        <div>
            <el-button type="primary" @click="printEditorHtml">打印内容</el-button>
            <el-button type="primary" @click="insertTextHandler">插入内容</el-button>
            <el-button type="primary" @click="disableHandler">禁用</el-button>
            <el-button type="primary" @click="getToolConfig">获取工具栏配置</el-button>
            <!-- 找到菜单 key 之后，可以先看看菜单的当前配置，再自行修改。 -->
            <el-button type="primary" @click="getUploadImageConfig">获取上传菜单配置</el-button>
        </div>
        <div style="border: 1px solid #ccc; margin-top: 10px;">
            <!-- 工具栏 -->
            <Toolbar ref="Toolbar" style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" />
            <!-- 编辑器 -->
            <Editor style="height: 400px; overflow-y: hidden;" :defaultConfig="editorConfig" v-model="html"
                @onChange="onChange" @onCreated="onCreated" />
        </div>
        <div style="margin-top: 10px;">
            <textarea v-model="html" readonly style="width: 100%; height: 200px; outline: none;"></textarea>
        </div>
    </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { DomEditor } from '@wangeditor/editor'
export default {
    name: 'MyEditor',
    components: { Editor, Toolbar },
    data() {
        return {
            editor: null,
            html: '<p>hello&nbsp;world</p>',
            toolbarConfig: {
                // toolbarKeys: [],// 配置什么显示什么
                // excludeKeys: [ /* 隐藏哪些菜单 */ ],
            },
            editorConfig: {
                placeholder: '请输入内容...',
                // autoFocus: false,
                // 所有的菜单配置，都要在 MENU_CONF 属性下
                MENU_CONF: {
                    // 后端上传返回的格式有要求
                    uploadImage: {
                        server: '/api/upload-image',
                        timeout: 5 * 1000, // 5s
                        fieldName: 'custom-fileName',
                        meta: { a: 100 },
                        metaWithUrl: true, // join params to url
                        headers: { Accept: 'text/x-json',token:'123' },
                        maxFileSize: 10 * 1024 * 1024, // 10M
                        base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
                        onBeforeUpload(file) {
                            console.log('onBeforeUpload', file)

                            return file // will upload this file
                        },
                        onProgress(progress) {
                            console.log('onProgress', progress)
                        },
                        onSuccess(file, res) {
                            console.log('onSuccess', file, res)
                        },
                        onFailed(file, res) {
                            alert(res.message)
                            console.log('onFailed', file, res)
                        },
                        onError(file, err, res) {
                            alert(err.message)
                            console.error('onError', file, err, res)
                        },

                    },
                    uploadVideo: {
                        server: '/api/upload-video',
                        // server: '/api/upload-img-failed', // test failed
                        // server: '/api/xxx', // test 404

                        timeout: 5 * 1000, // 5s

                        fieldName: 'custom-fileName',
                        meta: {a: 100 },
                        metaWithUrl: true, // join params to url
                        // 设置token
                        headers: { Accept: 'text/x-json',token:'123' },

                        maxFileSize: 10 * 1024 * 1024, // 10M

                        onBeforeUpload(file) {
                            console.log('onBeforeUpload', file)

                            return file // will upload this file
                            // return false // prevent upload
                        },
                        onProgress(progress) {
                            console.log('onProgress', progress)
                        },
                        onSuccess(file, res) {
                            console.log('onSuccess', file, res)
                        },
                        onFailed(file, res) {
                            alert(res.message)
                            console.log('onFailed', file, res)
                        },
                        onError(file, err, res) {
                            alert(err.message)
                            console.error('onError', file, err, res)
                        },
                    }
                }
            }
        }
    },
    methods: {
        getUploadImageConfig() {
            let uploadImgConfig = this.editor.getMenuConfig('uploadImage');
            console.log(uploadImgConfig);
        },
        // 获取工具栏配置
        getToolConfig() {
            const toolbar = DomEditor.getToolbar(this.editor)
            const curToolbarConfig = toolbar.getConfig()
            console.log(curToolbarConfig);

        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
        },
        onChange(editor) {
            console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
        },
        insertTextHandler() {
            const editor = this.editor
            if (editor == null) return
            editor.insertText(' hello ')
        },
        printEditorHtml() {
            const editor = this.editor
            if (editor == null) return
            console.log(editor.getHtml())
        },
        disableHandler() {
            const editor = this.editor
            if (editor == null) return
            editor.disable()
        }
    },
    mounted() {
        // 模拟 ajax 请求，异步渲染编辑器
        setTimeout(() => {
            this.html = '<p>Ajax 异步设置内容 HTML</p>'
        }, 1500)
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
    },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css">

</style>
