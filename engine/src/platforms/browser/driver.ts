namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

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
        return stage;
    }
}