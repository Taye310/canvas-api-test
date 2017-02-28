// function.call方法
window.onload = () => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset: number = 0;
    var stage = new DisplayObjectContainer();

    // var pic1 = new Bitmap("/pic.jpg");
    // pic1.x = 200;
    // pic1.addEventListener(TouchType.TOUCH_TAP, () => {
    //     alert("tap pic1");
    // })
    // pic1.touchEnabled = true;
    // stage.addChild(pic1);
    // var pic2 = new Bitmap("/pic2.jpg");
    // pic2.touchEnabled = true;
    // stage.addChild(pic2);

    ////////////////////////////////////////////////////////////////////
    var panel = new DisplayObjectContainer();
    panel.width = 200;
    panel.height = 200;
    panel.addEventListener(TouchType.TOUCH_TAP, (e) => {
        alert("tap panel")
    })//这里可以测试捕获
    panel.touchEnabled = true;
    var text = new TextField("TEXT");
    text.x = 100;
    text.y = 100;
    text.scaleX = 5;
    text.scaleY = 5;
    // text.addEventListener(TouchType.TOUCH_TAP, (e) => {
    //     alert("tap text")
    // })
    panel.addEventListener(TouchType.TOUCH_MOVE, (e) => {
        text.x = e.offsetX;
        text.y = e.offsetY;
        console.log(e.offsetX)
    })
    text.touchEnabled = true;
    // panel.addChild(text);
    // stage.addChild(panel);

    // setTimeout(function () {
    //     stage.draw(context2D);
    // }, 1000);


    setInterval(() => {
        stage.array = [];
        context2D.clearRect(0, 0, 400, 400);
        ///////////////////////////////////
        panel.addChild(text);
        stage.addChild(panel);
        stage.draw(context2D);
    }, 50)


    //鼠标点击
    window.onmousedown = (e) => {//onclick buyong youwenti  buyaoyong
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mousedown";//mousemove
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }
    window.onmousemove = (e) => {
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mousemove";
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        //console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }

    window.onmouseup = e => {
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mouseup";
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        //console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }
}

enum TouchType {
    TOUCH_TAP,
    TOUCH_MOVE,
    TOUCH_DRAG
}

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

    touchEnabled: boolean = false;
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

    type: TouchType[] = [];
    function: Function[] = [];
    useCapture: boolean = false;
    isMouseDown: boolean = false;

    addEventListener(_type: TouchType, listener: (e: MouseEvent) => void, _useCapture?: boolean) {
        this.type.push(_type);
        this.function.push(listener);
        this.useCapture = _useCapture;
    }

    dispatchEvent(e: any) {
        //console.log(e.type);
        if (e.type == "mousedown") {
            this.isMouseDown = true;
        } else if (e.type == "mouseup" && this.isMouseDown == true) {//other types unfinish
            for (let i = 0; i < this.type.length; i++) {
                if (this.type[i] == TouchType.TOUCH_TAP) {
                    this.function[i](e);
                }
            }
            this.isMouseDown = false;
        } else if (e.type == "mousemove") {
            for (let i = 0; i < this.type.length; i++) {
                if (this.type[i] == TouchType.TOUCH_MOVE) {
                    this.function[i](e);
                }
            }
        }
    }
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
        if (this.useCapture == true) {
            return this;
        }
        for (let i = this.array.length - 1; i >= 0; i--) {
            let child = this.array[i];
            let point = new math.Point(x, y);
            let invertChildGlobalMatrix = math.invertMatrix(child.globalMat);
            let pointBaseOnChild = math.pointAppendMatrix(point, invertChildGlobalMatrix);//stage不能动 其他container可以
            if (child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y)) {
                return child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
            }
        }
        if (this.touchEnabled) {
            return this;//所有child都没有点到就返回container
        }
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
        rect.y = -10
        rect.width = 7 * this.text.length;
        rect.height = 10;
        if (rect.isPointInRectangle(new math.Point(x, y)) && this.touchEnabled) {
            return this;
        } else {
            return null;
        }
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
        rect.width = this.width;//老师用的this.img.width为什么要用图片原尺寸？？？
        rect.height = this.height;
        if (rect.isPointInRectangle(new math.Point(x, y)) && this.touchEnabled) {
            return this;
        } else {
            return null;
        }
    }
}