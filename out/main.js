var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//较上版本完善父物体移动对子的影响
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset = 0;
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
    window.onmousedown = function (e) {
        //console.log(e);
        var x = e.offsetX;
        var y = e.offsetY;
        var type = "mousedown"; //mousemove,
        var target = stage.hitTest(190, 10);
        var result = target;
        if (result) {
            //result.dispatchEvent();
            while (result.parent) {
                var currentTarget = result.parent;
                var e_1 = { type: type, target: target, currentTarget: currentTarget };
                //result.dispatchEvent();
                result = result.parent;
            }
        }
    };
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
    //捕获冒泡机制
    //消息机制
    //模板方法方式
    DisplayObject.prototype.draw = function (context) {
        var localMat = new math.Matrix;
        localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
            this.globalMat = math.matrixAppendMatrix(localMat, this.parent.globalMat);
        }
        else {
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
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super.call(this) || this;
        _this.array = [];
        return _this;
    }
    //render
    DisplayObjectContainer.prototype.render = function (context) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (obj) {
        obj.parent = this;
        this.array.push(obj);
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        for (var i = this.array.length - 1; i >= 0; i--) {
            var child = this.array[i];
            var point = new math.Point(x, y);
            var invertChildLocalMatrix = math.invertMatrix(child.localMat);
            var pointBaseOnChild = math.pointAppendMatrix(point, invertChildLocalMatrix);
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(_text) {
        var _this = _super.call(this) || this;
        _this.text = _text;
        return _this;
    }
    TextField.prototype.render = function (context) {
        context.fillText(this.text, 0, 0);
    };
    TextField.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.width = 5 * this.text.length;
        rect.height = 10;
        var point = new math.Point(x, y);
        return null;
        //return rect.isPointInRectangle(point);//fanhui DisplayObject
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
    Bitmap.prototype.render = function (context) {
        context.drawImage(this.img, 0, 0, this.width, this.height);
    };
    Bitmap.prototype.hitTest = function (x, y) {
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.img.width;
        rect.height = this.img.height;
        if (rect.isPointInRectangle(new math.Point(x, y))) {
            return this;
        }
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map