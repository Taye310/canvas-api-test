window.onload = () => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset: number = 0;
    var stage = new DisplayObjectContainer();

    // setInterval(() => {
    //     stage.array = [];
    //     context2D.clearRect(0, 0, 400, 400);
    //     var img2 = new Bitmap("/pic.jpg");
    //     img2.rotation = 45;
    //     stage.addChild(img2);
    //     stage.Draw(context2D);
    // }, 100)

    setInterval(() => {
        offset++;
        ////////////clear area and stage's Child
        stage.array = [];
        context2D.clearRect(0, 0, 400, 400);
        ////////////
        var tf1 = new TextField("hello");
        tf1.x = 10;
        tf1.y = offset;
        tf1.localAlpha = 0.8;
        tf1.rotation=90;
        tf1.scaleX=2;
        var tf2 = new TextField("world");
        tf2.x = 35;
        tf2.y = 20;
        console.log(tf2.globalMat.toString())
        var img1 = new Bitmap("/pic.jpg");
        img1.x = offset;
        img1.scaleY = 2;
        img1.rotation = 45;//unfinish

        stage.localAlpha = 0.6;
        //stage.x = offset;//加上后图片有Y轴偏移 不知道怎么回事

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

    Draw(context: CanvasRenderingContext2D) { }
}

class DisplayObjectContainer extends DisplayObject {
    array: DisplayObject[] = [];

    constructor() {
        super();
        this.parent = this;//////////container不能再添加到别的container里？？？？
    }

    Draw(context: CanvasRenderingContext2D) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalMat = this.localMat;
        this.globalAlpha = this.localAlpha;
        for (let drawable of this.array) {
            drawable.Draw(context);
        }
    }

    addChild(obj: DisplayObject) {
        obj.parent = this;
        this.array.push(obj);
    }
}

class TextField extends DisplayObject {

    text: string;
    globalAlpha = 1;
    parent: DisplayObjectContainer;

    constructor(_text: string) {
        super();
        this.text = _text;
    }

    Draw(context: CanvasRenderingContext2D) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        this.globalMat = math.matrixAppendMatrix(this.parent.globalMat, this.localMat);
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        context.fillText(this.text, 0, 0);
        //还原
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class Bitmap extends DisplayObject {
    img = new Image();
    parent: DisplayObjectContainer;

    constructor(_src: string) {
        super();
        this.img.src = _src;
    }

    Draw(context: CanvasRenderingContext2D) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        this.globalMat = math.matrixAppendMatrix(this.parent.globalMat, this.localMat);
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        context.drawImage(this.img, 0, 0, this.width, this.height);
        ////还原
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}