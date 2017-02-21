var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset = 0;
    var stage = new DisplayObjectContainer();
    // setInterval(() => {
    //     stage.array = [];
    //     context2D.clearRect(0, 0, 400, 400);
    //     var img2 = new Bitmap("/pic.jpg");
    //     img2.rotation = 45;
    //     stage.addChild(img2);
    //     stage.Draw(context2D);
    // }, 100)
    setInterval(function () {
        offset++;
        ////////////clear area and stage's Child
        stage.array = [];
        context2D.clearRect(0, 0, 400, 400);
        ////////////
        var tf1 = new TextField("hello");
        tf1.x = 10;
        tf1.y = offset;
        tf1.localAlpha = 0.8;
        tf1.rotation = 90;
        tf1.scaleX = 2;
        var tf2 = new TextField("world");
        tf2.x = 35;
        tf2.y = 20;
        console.log(tf2.globalMat.toString());
        var img1 = new Bitmap("/pic.jpg");
        img1.x = offset;
        img1.scaleY = 2;
        img1.rotation = 45; //unfinish
        stage.localAlpha = 0.6;
        //stage.x = offset;//加上后图片有Y轴偏移 不知道怎么回事
        stage.addChild(tf1);
        stage.addChild(tf2);
        stage.addChild(img1);
        stage.Draw(context2D);
    }, 100);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.width = 100; //怎么设置成图片默认尺寸???
        this.height = 100;
        this.localAlpha = 1;
        this.globalAlpha = 1;
        this.localMat = new math.Matrix;
        this.globalMat = new math.Matrix;
    }
    DisplayObject.prototype.Draw = function (context) { };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super.call(this) || this;
        _this.array = [];
        _this.parent = _this; //////////container不能再添加到别的container里？？？？
        return _this;
    }
    DisplayObjectContainer.prototype.Draw = function (context) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalMat = this.localMat;
        this.globalAlpha = this.localAlpha;
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.Draw(context);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (obj) {
        obj.parent = this;
        this.array.push(obj);
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(_text) {
        var _this = _super.call(this) || this;
        _this.globalAlpha = 1;
        _this.text = _text;
        return _this;
    }
    TextField.prototype.Draw = function (context) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        this.globalMat = math.matrixAppendMatrix(this.parent.globalMat, this.localMat);
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        context.fillText(this.text, 0, 0);
        //还原
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(_src) {
        var _this = _super.call(this) || this;
        _this.img = new Image();
        _this.img.src = _src;
        return _this;
    }
    Bitmap.prototype.Draw = function (context) {
        this.localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        this.globalMat = math.matrixAppendMatrix(this.parent.globalMat, this.localMat);
        context.globalAlpha = this.globalAlpha;
        context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        context.drawImage(this.img, 0, 0, this.width, this.height);
        ////还原
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map