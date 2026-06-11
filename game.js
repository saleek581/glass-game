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

    glass = this.add.image(w / 2, h / 2, "glass");
    glass.setDisplaySize(w, h);

    breakSound = this.sound.add("break");

    // 🔥 IMPORTANT
