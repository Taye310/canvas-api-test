namespace engine {

    export type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[]
    }
    export type MovieClipFrameData = {
        "image": string
    }

    export enum TouchType {
        TOUCH_TAP,
        TOUCH_MOVE,
        TOUCH_DRAG
    }

    export interface Drawable {

        render(context: CanvasRenderingContext2D);
    }

    export abstract class DisplayObject implements Drawable {
        x: number = 0;
        y: number = 0;
        scaleX: number = 1;
        scaleY: number = 1;
        rotation: number = 0;
        width: number = 100;//怎么设置成图片默认尺寸???
        height: number = 100;
        localAlpha: number = 1;
        globalAlpha: number = 1;
        localMat: Matrix = new Matrix;
        globalMat: Matrix = new Matrix;

        parent: DisplayObject;

        touchEnabled: boolean = false;
        //捕获冒泡机制
        //消息机制
        //模板方法方式
        draw(context: CanvasRenderingContext2D) {
            var localMat: Matrix = new Matrix;
            localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
                this.globalMat = matrixAppendMatrix(localMat, this.parent.globalMat);
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
        useCapture: boolean[] = [];
        isMouseDown: boolean = false;

        addEventListener(_type: TouchType, listener: (e: MouseEvent) => void, _useCapture?: boolean) {
            this.type.push(_type);
            this.function.push(listener);
            this.useCapture.push(_useCapture);
        }

        dispatchEvent(e: any) {
            //console.log(e.type);
            if (e.type == "mousedown") {
                this.isMouseDown = true;
            } else if (e.type == "mouseup" && this.isMouseDown == true) {
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

    export class DisplayObjectContainer extends DisplayObject {
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
            if (this.useCapture[0] == true) {/////////////////////////////////////////////
                return this;
            }
            for (let i = this.array.length - 1; i >= 0; i--) {
                let child = this.array[i];
                let point = new Point(x, y);
                let invertChildGlobalMatrix = invertMatrix(child.globalMat);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildGlobalMatrix);//stage不能动 其他container可以
                if (child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y)) {
                    return child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                }
            }
            if (this.touchEnabled) {
                return this;//所有child都没有点到就返回container
            }
        }
    }

    export class TextField extends DisplayObject {

        text: string;
        parent: DisplayObjectContainer;

        private _measureTextWidth: number = 0;

        constructor(_text: string) {
            super();
            this.text = _text;
        }

        render(context: CanvasRenderingContext2D) {
            context.fillText(this.text, 0, 0);
            this._measureTextWidth = context.measureText(this.text).width;
        }

        hitTest(x: number, y: number) {
            var rect = new Rectangle();
            rect.y = -10
            rect.width = 7 * this.text.length;
            rect.height = 10;
            if (rect.isPointInRectangle(new Point(x, y)) && this.touchEnabled) {
                return this;
            } else {
                return null;
            }
        }
    }

    export class Bitmap extends DisplayObject {
        img = new Image();
        parent: DisplayObjectContainer;

        constructor() {
            super();
        }

        render(context: CanvasRenderingContext2D) {
            context.drawImage(this.img, 0, 0, this.width, this.height);
        }

        hitTest(x: number, y: number) {
            let rect = new Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.width;//老师用的this.img.width为什么要用图片原尺寸？？？
            rect.height = this.height;
            if (rect.isPointInRectangle(new Point(x, y)) && this.touchEnabled) {
                return this;
            } else {
                return null;
            }
        }
    }

    export class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 10;

        private currentFrameIndex: number;

        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }
}