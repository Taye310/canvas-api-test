window.onload = () => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var x: number = 0;
    var stage = new DisplayObject();

    //context2D.fillText("123",10,10);

    setInterval(() => {
        x++;
        context2D.clearRect(0, 0, 400, 400);
        // context2D.fillRect(x, 0, 100, 100);
        // context2D.beginPath();
        // context2D.rect(x,0,100,100);
        // context2D.fill();
        // context2D.closePath();

        var tf1 = new TextField("hello");
        var tf2 = new TextField("world");
        var img1 = new Bitmap("/pic.jpg");
        stage.addChild(img1);
        stage.addChild(tf1);
        stage.addChild(tf2);

        for (let drawable of stage.array) {
            drawable.Draw(context2D);
        }
    }, 100);

};

interface Drawable {
    Draw(context: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {
    array = [];

    Draw(context: CanvasRenderingContext2D) { }

    addChild(obj: DisplayObject) {
        this.array.push(obj);
    }
}

class TextField extends DisplayObject {
    text: string;
    constructor(_text: string) {
        super();
        this.text = _text;
    }

    Draw(context: CanvasRenderingContext2D) {

        context.fillText(this.text, 10, 10);
    }
}

// class Shape extends DisplayObject {
//     constructor() {
//         super();
//     }

//     Draw(context: CanvasRenderingContext2D) {

//     }
// }

class Bitmap extends DisplayObject {
    img = new Image();

    constructor(_src: string) {
        super();
        this.img.src = _src;
    }

    Draw(context: CanvasRenderingContext2D) {

        context.drawImage(this.img, 0, 0,100,100);
    }
}