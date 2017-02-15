var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var x = 0;
    var stage = new DisplayObject();
    //context2D.fillText("123",10,10);
    setInterval(function () {
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
        for (var _i = 0, _a = stage.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.Draw(context2D);
        }
    }, 100);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.array = [];
    }
    DisplayObject.prototype.Draw = function (context) { };
    DisplayObject.prototype.addChild = function (obj) {
        this.array.push(obj);
    };
    return DisplayObject;
}());
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(_text) {
        var _this = _super.call(this) || this;
        _this.text = _text;
        return _this;
    }
    TextField.prototype.Draw = function (context) {
        context.fillText(this.text, 10, 10);
    };
    return TextField;
}(DisplayObject));
// class Shape extends DisplayObject {
//     constructor() {
//         super();
//     }
//     Draw(context: CanvasRenderingContext2D) {
//     }
// }
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(_src) {
        var _this = _super.call(this) || this;
        _this.img = new Image();
        _this.img.src = _src;
        return _this;
    }
    Bitmap.prototype.Draw = function (context) {
        context.drawImage(this.img, 0, 0, 100, 100);
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map