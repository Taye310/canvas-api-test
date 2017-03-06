var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var stage = engine.run(canvas);
var bitmap = new engine.Bitmap();
bitmap.img.src="pic.jpg";
stage.addChild(bitmap);
let speed = 10;

engine.Ticker.getInstance().register((deltaTime) => {
    console.log("aaa")
    bitmap.x += 1;
});