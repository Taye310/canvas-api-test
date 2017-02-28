var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// function.call方法
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FF0000";
    var offset = 0;
    var stage = new DisplayObjectContainer();
    //stage.rotation = 45;
    var pic1 = new Bitmap("/pic.jpg");
    pic1.x = 200;
    pic1.addEventListener(TouchType.TOUCH_TAP, function () {
        alert("pic1 mousedown");
    });
    pic1.touchEnabled = true;
    stage.addChild(pic1);
    var pic2 = new Bitmap("/pic2.jpg");
    pic2.touchEnabled = true;
    stage.addChild(pic2);
    var text = new TextField("TEXT");
    text.x = 100;
    text.y = 100;
    text.scaleX = 5;
    text.scaleY = 5;
    text.touchEnabled = true;
    stage.addChild(text);
    setTimeout(function () {
        stage.draw(context2D);
    }, 1000);
    //鼠标点击
    window.onmousedown = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var type = "mousedown"; //mousemove
        var target = stage.hitTest(x, y);
        var result = target;
        console.log(result);
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                var currentTarget = result.parent;
                var e_1 = { type: type, target: target, currentTarget: currentTarget };
                result = result.parent;
                result.dispatchEvent(e_1);
            }
        }
    };
    window.onmousemove = function (e) {
    };
    window.onmouseup = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var type = "mouseup"; //mousemove
        var target = stage.hitTest(x, y);
        var result = target;
        console.log(result);
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                var currentTarget = result.parent;
                var e_2 = { type: type, target: target, currentTarget: currentTarget };
                result = result.parent;
                result.dispatchEvent(e_2);
            }
        }
    };
};
var TouchType;
(function (TouchType) {
    TouchType[TouchType["TOUCH_TAP"] = 0] = "TOUCH_TAP";
    TouchType[TouchType["TOUCH_MOVE"] = 1] = "TOUCH_MOVE";
})(TouchType || (TouchType = {}));
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
        this.type = [];
        this.function = [];
        this.isMouseDown = false;
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
    DisplayObject.prototype.addEventListener = function (_type, listener, useCatch) {
        this.type.push(_type);
        this.function.push(listener);
    };
    DisplayObject.prototype.dispatchEvent = function (e) {
        console.log(e.type);
        if (e.type == "mousedown") {
            this.isMouseDown = true;
        }
        else if (e.type == "mouseup" && this.isMouseDown == true) {
            for (var i = 0; i < this.type.length; i++) {
                if (this.type[i] == TouchType.TOUCH_TAP) {
                    this.function[i]();
                }
            }
            this.isMouseDown = false;
        }
        else if (e.type == "mousemove") {
        }
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super.call(this) || this;
        _this.array = [];
        _this.touchEnabled = true;
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
            var invertChildGlobalMatrix = math.invertMatrix(child.globalMat);
            var pointBaseOnChild = math.pointAppendMatrix(point, invertChildGlobalMatrix); //stage不能动 其他container可以
            if (child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y)) {
                return child;
            }
        }
        if (this.touchEnabled) {
            return this; //所有child都没有点到就返回container
        }
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
        rect.y = -10;
        rect.width = 7 * this.text.length;
        rect.height = 10;
        if (rect.isPointInRectangle(new math.Point(x, y)) && this.touchEnabled) {
            return this;
        }
        else {
            return null;
        }
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
        rect.width = this.width; //老师用的this.img.width为什么要用图片原尺寸？？？
        rect.height = this.height;
        if (rect.isPointInRectangle(new math.Point(x, y)) && this.touchEnabled) {
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map