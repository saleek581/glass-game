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
let gameReady = false;

function preload() {
    this.load.image("black", "assets/black.jpg");
    this.load.image("glass", "assets/glass1.png");
    this.load.audio("break", "assets/break.mp3");
}

function create() {

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Background
    blackBg = this.add.image(
        screenWidth / 2,
        screenHeight / 2,
        "black"
    );

    fitImageToHeight(blackBg, screenHeight);

    // Broken glass image
    glass = this.add.image(
        screenWidth / 2,
        screenHeight / 2,
        "glass"
    );

    fitImageToHeight(glass, screenHeight);
    glass.setVisible(false);

    // Sound
    breakSound = this.sound.add("break");

    // Prevent accidental trigger during load
    this.time.delayedCall(1000, () => {
        gameReady = true;
    });

    // Break on click/tap
    this.input.on("pointerup", () => {

        if (!gameReady) return;
        if (broken) return;

        breakGlass.call(this);
    });
}

function breakGlass() {

    if (broken) return;

    broken = true;

    breakSound.play({
        volume: 1
    });

    this.cameras.main.shake(
        400,
        0.02
    );

    glass.setVisible(true);
}

function fitImageToHeight(image, maxHeight) {

    const aspectRatio = image.width / image.height;

    const newHeight = maxHeight;
    const newWidth = newHeight * aspectRatio;

    image.setDisplaySize(
        newWidth,
        newHeight
    );
}

window.addEventListener("resize", () => {
    location.reload();
});
