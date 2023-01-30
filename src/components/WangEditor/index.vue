<template>
  <div class="editor-wrapper">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <div class="editor-content" id="editroContent">
      <Editor
        style="overflow-y: hidden;height:100%;"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  data() {
    return {
      editor: null,
      html: " ",
      toolbarConfig: {
        menu: ["bold"],
        excludeKeys: [
          "italic",
          "through",
          "code",
          "sub",
          "sup",
          "clearStyle",
          "group-indent",
          "group-justify",
          "group-image",
          "group-video",
          "group-more-style",
          "delIndent",
          "justifyLeft",
          "justifyRight",
          "justifyCenter",
          "justifyJustify",
          "lineHeight",
          "insertImage",
          "deleteImage",
          "editImage",
          "viewImageLink",
          "imageWidth30",
          "imageWidth50",
          "imageWidth100",
          "divider",
          "emotion",
          "insertLink",
          "editLink",
          "unLink",
          "viewLink",
          "codeBlock",
          "blockquote",
          "headerSelect",
          "header1",
          "header2",
          "header3",
          "header4",
          "header5",
          "todo",
          "redo",
          "undo",
          "fullScreen",
          "enter",
          "bulletedList",
          "numberedList",
          "insertTable",
          "deleteTable",
          "insertTableRow",
          "deleteTableRow",
          "insertTableCol",
          "deleteTableCol",
          "tableHeader",
          "tableFullWidth",
          "insertVideo",
          "uploadVideo",
          "editVideoSize",
          "uploadImage",
          "groupImage",
          "codeSelectLang",
        ],
      },
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default",
    };
  },
  components: { Editor, Toolbar },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      let config = this.editor.getAllMenuKeys();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-wrapper {
  height: 100%;
  border: 1px solid #d0d0d0;
  #editroContent {
    height: calc(100% - 41px);
    ::v-deep.w-e-text-container {
        background: none;
    }
  }
}
</style>