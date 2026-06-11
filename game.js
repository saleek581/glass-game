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
    this.load.image("black", "assets/black.jpg.jpg");
    this.load.image("glass", "assets/glass1.png");
    this.load.audio("break", "assets/break.mp3");
}

function create() {

    const w = this.scale.width;
    const h = this.scale.height;

    // Background
    blackBg = this.add.image(w / 2, h / 2, "black");
    fitImageToHeight(blackBg, h);

    // Glass
    glass = this.add.image(w / 2, h / 2, "glass");
    fitImageToHeight(glass, h);
    glass.setVisible(false);

    // Sound
    breakSound = this.sound.add("break");

    // 🔥 IMPORTANT: unlock audio on first touch (mobile requirement)
    this.input.once("pointerdown", () => {
        this.sound.context.resume();
    });

    // 📱 PHONE SHAKE DETECTION
    if (window.DeviceMotionEvent) {

        let lastX = 0, lastY = 0, lastZ = 0;

        window.addEventListener("devicemotion", (event) => {

            if (broken) return;

            const acc = event.accelerationIncludingGravity;

            if (!acc) return;

            const x = acc.x || 0;
            const y = acc.y || 0;
            const z = acc.z || 0;

            // calculate movement strength
            const diff =
                Math.abs(x - lastX) +
                Math.abs(y - lastY) +
                Math.abs(z - lastZ);

            lastX = x;
            lastY = y;
            lastZ = z;

            // shake sensitivity (increase if too sensitive)
            if (diff > 25) {
                breakGlass.call(this);
            }
        });
    }
}

function breakGlass() {

    if (broken) return;

    broken = true;

    // sound play
    breakSound.play({ volume: 1 });

    // camera shake effect
    this.cameras.main.shake(400, 0.02);

    // show broken glass
    glass.setVisible(true);
}

function fitImageToHeight(image, h) {
    const ratio = image.width / image.height;
    image.setDisplaySize(h * ratio, h);
}

window.addEventListener("resize", () => {
    location.reload();
});