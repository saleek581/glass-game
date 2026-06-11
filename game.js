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

let glass;
let breakSound;
let broken = false;

function preload() {
    this.load.image("glass", "assets/glass1.png");
    this.load.audio("break", "assets/break.mp3");
}

function create() {

    const w = this.scale.width;
    const h = this.scale.height;

    // glass image
    glass = this.add.image(w / 2, h / 2, "glass");
    glass.setDisplaySize(w, h);

    // sound
    breakSound = this.sound.add("break");

    // 🔥 UNLOCK AUDIO (MUST for mobile)
    this.input.once("pointerdown", () => {
        this.sound.context.resume();
    });

    // 📱 PHONE SHAKE DETECTION
    if (window.DeviceMotionEvent) {

        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;

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

            // 🔥 shake sensitivity (adjust if needed)
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

    // visual effect
    this.cameras.main.shake(400, 0.02);

    glass.setVisible(false);

    // optional: replace with broken image if you want
}
