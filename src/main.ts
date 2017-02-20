window.onload = () => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset: number = 0;
    var stage = new DisplayObjectContainer();


    setInterval(() => {
        offset++;
        ////////////clear area and stage's Child
        stage.array = [];
        context2D.clearRect(0, 0, 400, 400);
        ////////////
        var tf1 = new TextField("hello");
        tf1.x = 10;
        tf1.y = offset;
        tf1.localAlpha=0.3;
        var tf2 = new TextField("world");
        tf2.x = 35;
        tf2.y = offset;
        var img1 = new Bitmap("/pic.jpg");
        img1.x = offset;
        img1.y = 0;
        img1.localAlpha = 0.5;
        stage.localAlpha=0.6;

        stage.addChild(tf1);
        stage.addChild(tf2);
        stage.addChild(img1);
        stage.Draw(context2D);
    }, 100);
};

interface Drawable {

    Draw(context: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {
    x: number = 0;
    y: number = 0;
    width: number = 100;//怎么设置成图片默认尺寸
    height: number = 100;
    localAlpha: number = 1;
    globalAlpha: number = 1;
    localMat: math.Matrix;
    globalMat: math.Matrix;

    Draw(context: CanvasRenderingContext2D) { }
}

class DisplayObjectContainer extends DisplayObject {
    array: DisplayObject[] = [];

    parent: DisplayObject;

    constructor() {
        super();
        this.parent = this;//////////container不能再添加到别的container里
    }

    Draw(context: CanvasRenderingContext2D) {
        this.globalAlpha=this.localAlpha;
        for (let drawable of this.array) {
            drawable.Draw(context);
            console.log(drawable.globalAlpha)
        }
    }

    addChild(obj: DisplayObjectContainer) {
        obj.parent = this;
        this.array.push(obj);
    }
}

class TextField extends DisplayObjectContainer {

    text: string;
    globalAlpha = 1;
    parent: DisplayObjectContainer;

    constructor(_text: string) {
        super();
        this.text = _text;
    }

    Draw(context: CanvasRenderingContext2D) {
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        //this.globalMat=math.matrixAppendMatrix(this.parent.globalMat,this.localMat);
        context.globalAlpha = this.globalAlpha;
        context.fillText(this.text, this.x, this.y);
        context.globalAlpha = 1;

    }
}

class Bitmap extends DisplayObjectContainer {
    img = new Image();

    constructor(_src: string) {
        super();
        this.img.src = _src;

    }

    Draw(context: CanvasRenderingContext2D) {
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;

        //this.globalMat=math.matrixAppendMatrix(this.parent.globalMat,this.localMat);
        //console.log(this.globalMat);
        context.globalAlpha = this.globalAlpha;
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
        context.globalAlpha = 1;
    }
}