<template>
    <div>
        <div>
            <el-button type="primary" @click="getCropperCanvas">getCropperCanvas</el-button>
            <el-button type="primary" @click="getCropperImage">getCropperImage</el-button>
            <el-button type="primary" @click="getCropperSelection">getCropperSelection</el-button>
            <el-button type="primary" @click="getCropperSelections">getCropperSelections</el-button>
            <el-button type="primary" @click="convertToCanvas">convert to canvas</el-button>
            <el-button type="primary" @click="shadeChange">shadeChange</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <div class="cropper-container"></div>

            </el-col>
            <el-col :span="12">
                <div id="canvas-parent"></div>
                <img :src="canvasImage" alt="">
                <img :src="partImage" alt="">
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Cropper from 'cropperjs';
import { debounce } from '@/utils/index'

export default {
    data() {
        return {
            src: './img/avatar.png',
            cropper: null,
            canvas: null,
            image: null,
            selection: null,
            selections: null,
            renderCanvas: null,
            canvasImage: null,
            debounceAction: null,
            cropperShade: null,
            partImage:null
        }
    },
    created() {
        this.debounceAction = debounce(1000, this.convertToCanvas);
    },
    mounted() {
        this.initCropper();
    },
    methods: {
        initCropper() {
            const image = new Image();

            image.src = this.src;
            image.alt = 'Picture';

            const cropper = new Cropper(image, {
                container: '.cropper-container',
                template: `
                <cropper-canvas background="true" scaleStep="1" themeColor="#39f">
                    <cropper-image rotatable scalable skewable translatable
                    initial-center-size="cover"></cropper-image>
                    <cropper-shade hidden></cropper-shade>
                    <cropper-handle action="select" plain></cropper-handle>
                    <cropper-selection id="cropperSelection" initial-coverage="0.5" movable resizable>
                        <cropper-grid role="grid" bordered covered></cropper-grid>
                        <cropper-crosshair centered></cropper-crosshair>
                        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                        <cropper-handle action="n-resize"></cropper-handle>
                        <cropper-handle action="e-resize"></cropper-handle>
                        <cropper-handle action="s-resize"></cropper-handle>
                        <cropper-handle action="w-resize"></cropper-handle>
                        <cropper-handle action="ne-resize"></cropper-handle>
                        <cropper-handle action="nw-resize"></cropper-handle>
                        <cropper-handle action="se-resize"></cropper-handle>
                        <cropper-handle action="sw-resize"></cropper-handle>
                    </cropper-selection>
                </cropper-canvas>
                <div class="cropper-viewers">
                    <cropper-viewer selection="#cropperSelection" style="width: 320px;"></cropper-viewer>
                    <cropper-viewer selection="#cropperSelection" style="width: 160px;"></cropper-viewer>
                    <cropper-viewer selection="#cropperSelection" style="width: 80px;"></cropper-viewer>
                    <cropper-viewer selection="#cropperSelection" style="width: 40px;"></cropper-viewer>
                </div>
                `
            });
            this.cropper = cropper;
            this.canvas = this.cropper.getCropperCanvas(); 
            this.image = this.cropper.getCropperImage();
            this.selection = this.cropper.getCropperSelection();
            this.selections = this.cropper.getCropperSelections();

            // 绘制动作监听
            this.canvas.addEventListener('action', (event) => {
                this.debounceAction();
            });
            this.image.$ready((image) => {
                console.log(image.naturalWidth, image.naturalHeight);
            });

        },
        getCropperCanvas() {
            let canvas = this.cropper.getCropperCanvas();
            console.log(canvas);
        },
        getCropperImage() {
            let image = this.cropper.getCropperImage();
            this.image.src = './img/img2.png';
        },
        getCropperSelection() {
            let selection = this.cropper.getCropperSelection();
            console.log(selection);
        },
        getCropperSelections() {
            let selections = this.cropper.getCropperSelections();
            console.log(selections);
        },
        async convertToCanvas() {
            let canvas = await this.canvas.$toCanvas();
            this.renderCanvas = canvas;
            this.canvasImage = canvas.toDataURL();
            document.getElementById('canvas-parent').innerHTML = null;
            document.getElementById('canvas-parent').appendChild(canvas);

            // 获取截取的图片
            let partImgCanvas = await this.selection.$toCanvas();
            let partImg = partImgCanvas.toDataURL();
            this.partImage = partImg;
            
        },
        shadeChange() {
            let cropperShade = document.querySelector('cropper-shade');
            this.cropperShade = cropperShade;

        }

    }

}
</script>

<style lang="scss" scoped>
.cropper-container {
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 1.25rem 1.5rem;
    width: 500px;

    ::v-deep cropper-canvas {
        height: 360px;
        width: 500px;
    }
}
</style>