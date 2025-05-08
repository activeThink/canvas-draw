function CanvasTool(canvasDomId) {
    if (canvasDomId == undefined) {
        console.log('canvas节点必须提供');
        return;
    }
    this.canvas = document.getElementById(canvasDomId);
    if (this.canvas == undefined) {
        console.log('canvas节点不存在');
        return;
    }
    if (!this.canvas.getContext) {
        console.log('浏览器不支持canvas');
        return;
    } else {
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.log('canvas 2d对象获取失败');
            return;
        }
    }
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.fillStyle = '#000';
    this.ctx.font = "20px Consolas,Courier,monospace";
    // this.ctx.globalAlpha = 50/100; 
    //设置样式
    this.setStyle = function (prop) {
        if (prop.lineWidth) {
            this.ctx.lineWidth = prop.lineWidth;
        }
        if (prop.fillStyle) {
            this.ctx.fillStyle = prop.fillStyle;
        }
        if (prop.setLineDash) {
            this.ctx.setLineDash(prop.setLineDash)
        }
        if (prop.fontSize) {
            this.ctx.font = prop.fontSize + ' Consolas,Courier,monospace';
        }
        if (prop.strokeStyle) {
            this.ctx.strokeStyle = prop.strokeStyle;
        }
    }
    //清除画板
    this.clear = function (prop) {
        var width = prop.width || this.canvas.width;
        var height = prop.height || this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);
        return { 'width': width, 'height': height };
    }
    //写字(根据像素计算换行和绘制)
    this.drawText = function (textarea, x, y, width, lineHeight) {
        var lines = [],
            line = '',
            len = 0;
        for (var i = 0; i < textarea.length; i++) {
            var char = textarea.substr(i, 1);
            line += char;
            if (char == '\n') {
                lines.push(line);
                len += line.length;
                line = '';
            } else {
                var cwidth = this.ctx.measureText(line).width;
                if (cwidth > width) {
                    lines.push(line.substr(0, line.length - 1));
                    len += line.length - 1;
                    line = line.substr(line.length - 1, 1);
                }
            }
        }
        if (len < textarea.length) {
            lines.push(textarea.substr(len));
        }
        for (var i in lines) {
            var text = lines[i];
            this.ctx.fillText(text, x, y + i * lineHeight, 400);
        }
    }
    //三角形
    this.drawTriangle = function (args) {
        var p1 = _getPoint(args.p1);
        var p2 = _getPoint(args.p2);
        var p3 = _getPoint(args.p3);
        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.lineTo(p3[0], p3[1]);
        this.ctx.closePath();
        this.ctx.stroke();
        return { 'p1': p1, 'p2': p2, 'p3': p3 };
    }
    //获取点
    function _getPoint(p) {
        var p1 = [];
        if (p && p.length == 2) {
            p1[0] = parseInt(p[0]) || 0;
            p1[1] = parseInt(p[1]) || 0;
        } else {
            p1 = [0, 0];
        }
        return p1;
    }
    //画直线
    this.drawLine = function (args) {
        var p1 = _getPoint(args.p1);
        var p2 = _getPoint(args.p2);
        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.stroke();
        return { 'p1': p1, 'p2': p2 };
    }

    //画曲线
    this.drawCurve = function (pList) {
        if (pList.length > 0) {
            this.ctx.beginPath();
            for (let i = 0; i < pList.length - 1; i++) {
                this.ctx.moveTo(pList[i][0], pList[i][1]);
                this.ctx.lineTo(pList[i + 1][0], pList[i + 1][1]);
                this.ctx.stroke();
            }
        }
        return { 'pList': pList };
    }
    //画矩形
    this.drawRect = function ({ start, end }) {
        if (start && end) {
            this.ctx.beginPath()
            var width = end[0] - start[0];
            var height = end[1] - start[1];
            this.ctx.rect(start[0], start[1], width, height);
            this.ctx.stroke()
            this.ctx.closePath()
        }
    }
    this.drawellipse = function ({ start, end }) {
        var axisx = Math.abs((end[0] - start[0]) / 2); 	
        var axisy = Math.abs((end[1] - start[1]) / 2);
        var centerx = axisx + Math.min(start[0], end[0]);
        var centery = axisy + Math.min(start[1], end[1]);
        var step = (axisx > axisy) ? 1 / axisx : 1 / axisy; 
        this.ctx.beginPath();
        this.ctx.moveTo(centerx + axisx, centery);
        for (var i = 0; i < 2 * Math.PI; i += step) {
            this.ctx.lineTo(centerx + axisx * Math.cos(i), centery + axisy * Math.sin(i)); 
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
    // 绘制图片
    this.drawImage = function (imgDom, x, y, width, height) {
        this.ctx.drawImage(imgDom, x, y);
    }
    this.x = 0;
    // 动画样例
    this.requesAnimFrameOne = function () {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x, 100, 200, 100);
        this.x += 5;
    }
    this.requesAnimFrameTwo = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x, 100, 200, 100);
        this.x += 5;
    }

    // 动画粒子效果
    var particles = [];
    var tick = 0;
    let colors = ['#1abc9c','#2ecc71','#3498db','#9b59b6','#34495e','#16a085','#e74c3c','#f1c40f','#f39c12','#c0392b'];
    this.createParticles = function () {
        //check on every 10th tick check
        if (tick % 10 == 0) {
            if (particles.length < 100) {
                particles.push({
                    x: Math.random() * this.canvas.width,
                    y: 0,
                    speed: 2 + Math.random() * 3, //between 2 and 5
                    radius: 5 + Math.random() * 5, //between 5 and 10
                    color: "#000",
                });
            }
        }
    }

    this.updateParticles = function () {
        for (var i in particles) {
            var part = particles[i];
            part.y += part.speed;
        }
    }
    this.killParticles = function () {
        for (var i in particles) {
            var part = particles[i];
            if (part.y > this.canvas.height) {
                part.y = 0;
            }
        }
    }

    this.drawParticles = function () {
        this.ctx.fillStyle ='#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i in particles) {
            var part = particles[i];
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fillStyle = colors[Math.floor(Math.random()*10)];
            this.ctx.fill();
        }
    }
}

export default CanvasTool;