<template>
  <div class="canvas-draw" id="canvasDraw">
    <div class="operate-btns">
      <el-button
        :type="drawType == item.type ? 'primary' : ''"
        v-for="item in btnList"
        :key="item.name"
        circle
        size="mini"
        :icon="item.icon"
        @click="changeDrawType(item.type)"
      ></el-button>
      <span class="sp-label">粗细</span>
      <el-select
        style="width: 65px"
        size="mini"
        v-model="thickness"
        @change="changeThickness"
        placeholder="请选择"
      >
        <el-option
          v-for="item in thicknessOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="sp-label">颜色</span>
      <input
        v-model="strokeColor"
        @change="setStrokeColor"
        type="color"
        size="mini"
        style="width: 65px"
      />
      <el-button
        style="margin-left: 10px"
        circle
        size="mini"
        @click="clearCanvas"
        icon="el-icon-delete"
      ></el-button>
      <div class="editor-bar">
        <Toolbar
          v-if="showText"
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
      </div> 
      
      <el-button size="mini" @click="aminateOne">动画1</el-button>
      <el-button size="mini" @click="aminateTwo">动画2</el-button>
      <el-button size="mini" @click="animateThree">动画3</el-button>
    </div>
    <canvas
      id="canvasDom"
      @mousedown="mouseStart"
      @mousemove="mouseMove"
      @mouseup="mouseEnd"
    ></canvas>
    <canvas id="canvasDom-back"></canvas>
    <!-- 输入框 -->
    <div class="input-content" v-if="showText" :style="textStyle">
      <div class="editor-content" id="editroContent">
        <Editor
          style="overflow-y: hidden; height: 100%"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import CanvasTool from "./utils.js";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  data() {
    return {
      ctx: null,
      activeMouse: { x: 0, y: 0 },
      drawType: null,
      thickness: 3,
      btnList: [
        {
          type: "straightLine",
          icon: "dr-icon-fengexian",
          name: "直线",
        },
        {
          type: "curve",
          icon: "dr-icon-quxian",
          name: "曲线",
        },
        {
          type: "rectangle",
          icon: "dr-icon-xingzhuang-juxing",
          name: "矩形",
        },
        {
          type: "ellipse",
          icon: "dr-icon-xingzhuang-tuoyuanxing",
          name: "椭圆",
        },
        {
          type: "text",
          icon: "dr-icon-fuzhiwenzi",
          name: "文字",
        },
        {
          type: "eraser",
          icon: "dr-icon-xiangpi",
          name: "橡皮擦",
        },
      ],
      thicknessOptions: [
        {
          value: 1,
          label: "1",
        },
        {
          value: 2,
          label: "2",
        },
        {
          value: 3,
          label: "3",
        },
        {
          value: 4,
          label: "4",
        },
        {
          value: 5,
          label: "5",
        },
      ],
      strokeColor: "#F44336",
      recordImg: null,
      isDrawIng: false,
      topBrush: null,
      bottomBrush: null,
      drawData: [],
      curvePointList: [],
      showText: false,
      textVal: "",
      textStyle: {},
      screenshotImg: "",
      recordDrawData: [],
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
  created(){
    window.requestAnimFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame
        );
    })();
  },
  mounted() {
    this.initCanvasDraw();
    this.topBrush = new CanvasTool("canvasDom");
    this.topBrush.setStyle({
      lineWidth: this.thickness,
      strokeStyle: this.strokeColor,
    });
    this.bottomBrush = new CanvasTool("canvasDom-back");
    this.bottomBrush.setStyle({
      lineWidth: this.thickness,
      strokeStyle: this.strokeColor,
    });
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      let config = this.editor.getAllMenuKeys();
    },
    downLoadImage(img, name) {
      var a = document.createElement("a");
      a.href = img;
      a.download = name;
      a.click();
    },
    // 切换类型
    changeDrawType(type) {
      this.drawType = this.drawType != type ? type : null;
      if (this.drawType == "eraser") {
        this.bottomBrush.setStyle({
          lineWidth: this.thickness + 3,
          strokeStyle: "#fff",
        });
      } else if (this.drawType == "text") {
        this.topBrush.setStyle({
          lineWidth: 1,
          strokeStyle: "#000",
          setLineDash: [10, 10],
        });
      } else {
        this.setDrawStyle();
      }
    },
    initCanvasDraw() {
      // 上层canvas,用来绘制
      const topCanvas = document.querySelector("#canvasDom");
      topCanvas.width = window.innerWidth;
      topCanvas.height = window.innerHeight;

      // 下层canvas，用来显示绘制的结果
      const bottomCanvas = document.getElementById("canvasDom-back");
      bottomCanvas.width = window.innerWidth;
      bottomCanvas.height = window.innerHeight;
    },
    // 开始绘制
    mouseStart(e) {
      e.preventDefault();
      if (this.drawType) {
        this.isDrawIng = true;
        let [x, y] = [e.clientX, e.clientY];
        this.drawData = [[x, y]];
        // 曲线保持记录点
        if (this.drawType == "curve") {
          this.curvePointList.push([x, y]);
        }
      }
    },
    // 鼠标移动绘制
    mouseMove(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      if (this.isDrawIng) {
        // 绘制任意线
        if (this.drawType == "curve" || this.drawType == "eraser") {
          if (this.drawData[0] != undefined) {
            this.drawData[1] = [x, y];
            this.bottomBrush.drawCurve(this.drawData);
            this.drawData[0] = [x, y];
            this.curvePointList.push(...this.drawData);
          }
        }
        //绘制直线,直线绘制需要不断的清空记录
        if (this.drawType == "straightLine") {
          this.topBrush.clear({});
          if (this.drawData[0] != undefined) {
            this.topBrush.drawLine({ p1: this.drawData[0], p2: [x, y] });
            this.drawData[1] = [x, y];
          }
        }
        if (this.drawType == "rectangle" || this.drawType == "text") {
          this.topBrush.clear({});
          if (this.drawData[0] != undefined) {
            this.topBrush.drawRect({ start: this.drawData[0], end: [x, y] });
            this.drawData[1] = [x, y];
          }
        }
        if (this.drawType == "ellipse") {
          this.topBrush.clear({});
          if (this.drawData[0] != undefined) {
            this.topBrush.drawellipse({ start: this.drawData[0], end: [x, y] });
            this.drawData[1] = [x, y];
          }
        }
      }
    },
    // 结束绘制
    // 不是所有的绘制元素需要移动到bottomBrush底层的canvas
    mouseEnd(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      if (this.drawType == "straightLine") {
        if (this.drawData[0] != undefined) {
          this.bottomBrush.drawLine({ p1: this.drawData[0], p2: [x, y] });
          this.drawData[1] = [x, y];
        }
        this.drawData = [];
      }
      if (this.drawType == "curve") {
        this.topBrush.clear({});
        if (this.curvePointList.length > 0) {
          this.bottomBrush.drawCurve(this.curvePointList);
          this.curvePointList = [];
        }
      }
      if (this.drawType == "rectangle") {
        this.topBrush.clear({});
        if (this.drawData[0] != undefined) {
          this.bottomBrush.drawRect({ start: this.drawData[0], end: [x, y] });
        }
      }
      if (this.drawType == "ellipse") {
        this.topBrush.clear({});
        if (this.drawData[0] != undefined) {
          this.bottomBrush.drawellipse({
            start: this.drawData[0],
            end: [x, y],
          });
        }
      }
      if (this.drawType == "text") {
        this.topBrush.clear({});
        this.showText = !this.showText;
        if (this.showText) {
          this.drawData[1] = [x, y];
          this.recordDrawData = [...this.drawData];
          this.setTextStyle();
        }
        if (!this.showText) {
          let [x, y] = this.recordDrawData[0];
          let width = this.recordDrawData[1][0] - this.recordDrawData[0][0];
          let height = this.recordDrawData[1][1] - this.recordDrawData[0][1];
          if (
            this.html != "<p> </p>" &&
            this.html != "<p><br></p>" &&
            this.html != " "
          ) {
            // backgroundColor:'none'可以设置生成图片背景透明
            html2canvas(
              document.getElementsByClassName("w-e-text-container")[0],
              {
                backgroundColor:'none'
              }
            ).then((canvas) => {
              this.screenshotImg = canvas.toDataURL("image/png", 1);
              this.$nextTick(() => {
                var renderImg = new Image();
                renderImg.src = this.screenshotImg;
                renderImg.onload = () => {
                  this.bottomBrush.drawImage(
                    renderImg,
                    x,
                    y,
                    width - 20,
                    height - 20
                  );
                };
                this.html = " ";
              });
            });
          }
        }
      }
      this.isDrawIng = false;
    },
    drawImg() {
      this.$nextTick(() => {
        this.bottomBrush.drawImage("", 100, 100, 300, 200);
      });
    },
    setTextStyle() {
      this.textStyle = {
        display: "block",
        left: `${this.drawData[0][0]}px`,
        top: `${this.drawData[0][1]}px`,
        width: `${this.drawData[1][0] - this.drawData[0][0]}px`,
        height: `${this.drawData[1][1] - this.drawData[0][1]}px`,
      };
    },
    // 设置颜色
    changeThickness() {
      this.setDrawStyle();
    },
    // 设置颜色
    setStrokeColor() {
      this.setDrawStyle();
    },
    setDrawStyle() {
      this.topBrush.setStyle({
        lineWidth: this.thickness,
        strokeStyle: this.strokeColor,
        setLineDash: [],
      });
      this.bottomBrush.setStyle({
        lineWidth: this.thickness,
        strokeStyle: this.strokeColor,
        setLineDash: [],
      });
    },
    // 动画
    aminateOne() {
      window.requestAnimFrame(this.animateCanvas);
    },
    animateCanvasOne() {
      window.requestAnimFrame(this.animateCanvas);
      this.bottomBrush.requesAnimFrameOne();
    },
    aminateTwo() {
      window.requestAnimFrame(this.animateCanvasTwo);
    },
    animateCanvasTwo() {
      window.requestAnimFrame(this.animateCanvasTwo);
      this.bottomBrush.requesAnimFrameTwo();
    },
    animateThree(){
      window.requestAnimFrame(this.particularSimulateLoop);
    },
    particularSimulateLoop() {
      window.requestAnimFrame(this.particularSimulateLoop);
      this.bottomBrush.createParticles();
      this.bottomBrush.updateParticles();
      this.bottomBrush.killParticles();
      this.bottomBrush.drawParticles();
    },
    // 清除画板
    clearCanvas() {
      this.bottomBrush.clear({});
      this.topBrush.clear({});
    },
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
@import "./index.scss";
.editor-bar {
  margin-left: 10px;
  display: inline-block;
}
</style>