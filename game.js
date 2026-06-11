const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,

    scene: {
        preload: preload,
        create: create
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);

let blackBg;
let glass;
let breakSound;
let broken = false;

function preload() {
    this.load.image("black", "assets/black.jpg");
    this.load.image("glass", "assets/glass1.PNG");
    this.load.audio("break", "assets/break.mp3");
}

function create() {

    const w = this.scale.width;
    const h = this.scale.height;

    // background
    blackBg = this.add.image(w / 2, h / 2, "black");
    blackBg.setDisplaySize(w, h);

    // glass
    glass = this.add.image(w / 2, h / 2, "glass");
    glass.setDisplaySize(w, h);
    glass.setVisible(false);

    // sound
    breakSound = this.sound.add("break");

    // unlock audio (must for mobile)
    this.input.once("pointerdown", () => {
        this.sound.context.resume();
    });

    // 📱 PHONE SHAKE PERMISSION (IMPORTANT FIX FOR iPhone)
    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {

        document.body.addEventListener("click", async () => {
            try {
                await DeviceMotionEvent.requestPermission();
            } catch (e) {
                console.log("Motion permission denied");
            }
        }, { once: true });
    }

    // 📱 SHAKE DETECTION
    if (window.DeviceMotionEvent) {

        let lastX = 0, lastY = 0, lastZ = 0;

        window.addEventListener("devicemotion", (event) => {

            if (broken) return;

            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const x = acc.x || 0;
            const y = acc.y || 0;
            const z = acc.z || 0;

            const diff =
                Math.abs(x - lastX) +
                Math.abs(y - lastY) +
                Math.abs(z - lastZ);

            lastX = x;
            lastY = y;
            lastZ = z;

            // sensitivity (adjust if needed)
            if (diff > 25) {
                breakGlass.call(this);
            }
        });
    }
}

function breakGlass() {

    if (broken) return;

    broken = true;

    // sound
    breakSound.play({ volume: 1 });

    // camera shake
    this.cameras.main.shake(400, 0.02);

    // show broken glass
    glass.setVisible(true);
}

window.addEventListener("resize", () => {
    location.reload();
});
