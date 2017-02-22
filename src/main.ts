//较上版本完善父物体移动对子的影响
window.onload = () => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset: number = 0;
    var stage = new DisplayObjectContainer();

    var text1 = new TextField("text1");
    var text2 = new TextField("text2");
    text1.y = 100;
    text1.x = 100;
    text2.y = 100;
    text2.x = 130;
    //stage.rotation = 45;
    stage.addChild(text1);
    stage.addChild(text2);

    stage.draw(context2D);


    // setInterval(() => {
    //     offset++;
    //     ////////////clear area and stage's Child
    //     stage.array = [];
    //     context2D.clearRect(0, 0, 400, 400);
    //     ////////////
    //     var tf1 = new TextField("hello");
    //     tf1.x = 10;
    //     tf1.y = offset;
    //     tf1.localAlpha = 0.8;
    //     tf1.rotation = 90;
    //     tf1.scaleX = 2;
    //     var tf2 = new TextField("world");
    //     tf2.x = 35;
    //     tf2.y = 20;
    //     var img1 = new Bitmap("/pic.jpg");
    //     img1.x = offset;
    //     img1.scaleY = 2;
    //     img1.rotation = 45;//unfinish

    //     stage.localAlpha = 0.6;
    //     stage.x = offset;
    //     stage.rotation = 45;

    //     stage.addChild(tf1);
    //     stage.addChild(tf2);
    //     stage.addChild(img1);
    //     stage.draw(context2D);
    // }, 100);

    //鼠标点击
    window.onmousedown = (e) => {//onclick buyong youwenti  buyaoyong

        //console.log(e);
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mousedown";//mousemove,
        let target: DisplayObject = stage.hitTest(190, 10);
        let result = target;

        if (result) {
            //result.dispatchEvent();
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                //result.dispatchEvent();
                result = result.parent;
            }
        }
    }


    // //模拟点击
    // setTimeout(() => {
    //     let result: DisplayObject = stage.hitTest(190, 10);
    //     if (result) {
    //         //result.dispatchEvent();
    //         while (result.parent) {
    //             //result.dispatchEvent();
    //             result = result.parent;
    //         }
    //     }
    // }, 1000);
};

interface Drawable {

    render(context: CanvasRenderingContext2D);
}

abstract class DisplayObject implements Drawable {
    x: number = 0;
    y: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;
    width: number = 100;//怎么设置成图片默认尺寸???
    height: number = 100;
    localAlpha: number = 1;
    globalAlpha: number = 1;
    localMat: math.Matrix = new math.Matrix;
    globalMat: math.Matrix = new math.Matrix;

    parent: DisplayObject;

    touchEnabled: boolean;
    //捕获冒泡机制
    //消息机制
    //模板方法方式
    draw(context: CanvasRenderingContext2D) {
        var localMat: math.Matrix = new math.Matrix;
        localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
            this.globalMat = math.matrixAppendMatrix(localMat, this.parent.globalMat);
        } else {
            this.globalAlpha = this.localAlpha;
            this.globalMat = localMat;
        }
        context.save();
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        this.render(context);
        context.restore();
        //restore
        // context.globalAlpha=1;
        // context.setTransform(1,0,0,1,0,0);
    }

    abstract render(context: CanvasRenderingContext2D)

    abstract hitTest(x, y): DisplayObject;
}

class DisplayObjectContainer extends DisplayObject {
    array: DisplayObject[] = [];

    constructor() {
        super();
    }
    //render
    render(context: CanvasRenderingContext2D) {

        for (let drawable of this.array) {
            drawable.draw(context);
        }
    }

    addChild(obj: DisplayObject) {
        obj.parent = this;
        this.array.push(obj);
    }

    hitTest(x, y) {
        for (let i = this.array.length - 1; i >= 0; i--) {
            let child = this.array[i];
            let point = new math.Point(x, y);
            let invertChildLocalMatrix = math.invertMatrix(child.localMat);
            let pointBaseOnChild = math.pointAppendMatrix(point, invertChildLocalMatrix);
        }
        return null
    }
}

class TextField extends DisplayObject {

    text: string;
    parent: DisplayObjectContainer;

    constructor(_text: string) {
        super();
        this.text = _text;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillText(this.text, 0, 0);
    }

    hitTest(x: number, y: number) {
        var rect = new math.Rectangle();
        rect.width = 5 * this.text.length;
        rect.height = 10;
        var point = new math.Point(x, y);
        return null;
        //return rect.isPointInRectangle(point);//fanhui DisplayObject
    }
}

class Bitmap extends DisplayObject {
    img = new Image();
    parent: DisplayObjectContainer;

    constructor(_src: string) {
        super();
        this.img.src = _src;
    }

    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.img, 0, 0, this.width, this.height);
    }

    hitTest(x: number, y: number) {
        let rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.img.width;
        rect.height = this.img.height;
        if (rect.isPointInRectangle(new math.Point(x, y))) {
            return this;
        }
    }
}