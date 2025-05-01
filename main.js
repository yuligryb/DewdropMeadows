class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    this.load.image('MM_Background', 'assets/Main%20Menu/MM_Background.png');
    this.load.image('DDM_Logo', 'assets/Main%20Menu/DDM_Logo.png');
    this.load.image('Start_Button', 'assets/Main%20Menu/Start_Button.png');
    this.load.image('Quit_Button', 'assets/Main%20Menu/Quit_Button.png');
    this.load.image('Settings_Button', 'assets/Main%20Menu/Settings_Button.png');
    this.load.image('UI_Short', 'assets/Main%20Menu/UI_Short.png');
    this.load.image('Sound_Bar', 'assets/Main%20Menu/Sound_Bar.png');
    this.load.image('Sound_Toggle', 'assets/Main%20Menu/Sound_Toggle.png');
    this.load.image('Settings_Close', 'assets/Main%20Menu/Settings_Close.png');
    this.load.audio('Water_Sound', 'assets/Main%20Menu/Water_Sound.mp3');
    this.load.spritesheet('Bubble_Sheet', 'assets/Main%20Menu/Bubble_Sheet.png', {
      frameWidth: 1920,
      frameHeight: 1080
    });
    for (let i = 1; i <= 8; i++) {
      this.load.image(`BG${i}`, `assets/Game%20Scene/BG${i}.png`);
    }
    this.load.image('PG_Fish_Book', 'assets/Game%20Scene/PG_Fish_Book.png');
    this.load.image('PG_Shopping_Cart', 'Assets/Game%20Scene/PG_Shopping_Cart.png');

    this.load.image('Char_throw', 'assets/Game%20Scene/Char_throw.png');
    this.load.image('Char_throw2', 'assets/Game%20Scene/Char_throw2.png');
    this.load.image('Char_idle1', 'assets/Game%20Scene/Char_idle1.png');
    this.load.image('Char_idle2', 'assets/Game%20Scene/Char_idle2.png');
    this.load.image('Select_1', 'assets/Game%20Scene/Select_1.png');
    this.load.image('Select_2', 'assets/Game%20Scene/Select_2.png');
  }

  create() {
    this.swayTime = 0;
    this.add.image(960, 540, 'MM_Background').setDepth(-3);

    this.music = this.sound.add('Water_Sound', { loop: true, volume: 1 });
    this.music.play();

    const correctFrameOrder = [0, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2];
    this.anims.create({
      key: 'bubbleFloat',
      frames: correctFrameOrder.map(i => ({ key: 'Bubble_Sheet', frame: i })),
      frameRate: 3,
      repeat: -1
    });
    this.bubble = this.add.sprite(960, 540, 'Bubble_Sheet').play('bubbleFloat').setDepth(-2);

    this.backgroundBubbles = [];
    for (let i = 0; i < 15; i++) {
      const g = this.add.graphics();
      g.lineStyle(4, 0xFFFFFF, 0.3);
      g.strokeCircle(0, 0, Phaser.Math.Between(5, 15));
      const container = this.add.container(Phaser.Math.Between(0, 1920), Phaser.Math.Between(1080, 2000), [g]);
      container.speed = Phaser.Math.FloatBetween(0.8, 1.4);
      container.setDepth(-1);
      this.backgroundBubbles.push(container);
    }

    this.add.image(960, 250, 'DDM_Logo').setDepth(1);

    const startButton = this.add.image(960, 500, 'Start_Button').setInteractive().setDepth(1);
    const quitButton = this.add.image(960, 620, 'Quit_Button').setInteractive().setDepth(1);
    const settingsButton = this.add.image(960, 740, 'Settings_Button').setInteractive().setScale(0.5).setDepth(1);

    startButton.on('pointerover', () => startButton.setScale(1.05));
    startButton.on('pointerout', () => startButton.setScale(1));
    startButton.on('pointerdown', () => startButton.setTint(0xcccccc));
    startButton.on('pointerup', () => {
      startButton.clearTint();
      this.scene.start('NextScene');
    });

    quitButton.on('pointerover', () => quitButton.setScale(1.05));
    quitButton.on('pointerout', () => quitButton.setScale(1));
    quitButton.on('pointerdown', () => quitButton.setTint(0xcccccc));
    quitButton.on('pointerup', () => quitButton.clearTint());

    settingsButton.on('pointerover', () => settingsButton.setScale(0.55));
    settingsButton.on('pointerout', () => settingsButton.setScale(0.5));
    settingsButton.on('pointerdown', () => settingsButton.setTint(0xcccccc));
    settingsButton.on('pointerup', () => {
      settingsButton.clearTint();
      this.showSettings();
    });

    const vignette = this.add.graphics().setDepth(0);
    vignette.fillStyle(0x032e3e, 0.4);
    vignette.fillRect(0, 0, 1920, 1080);
    this.tweens.add({ targets: vignette, alpha: { from: 0.2, to: 0.4 }, duration: 4000, yoyo: true, repeat: -1 });
  }

  showSettings() {
    const bg = this.add.image(960, 540, 'UI_Short').setDepth(10);
    const bar = this.add.image(960, 550, 'Sound_Bar').setDepth(11);
    const toggle = this.add.image(1200, 550, 'Sound_Toggle').setInteractive().setDepth(12);
    const close = this.add.image(960, 670, 'Settings_Close').setInteractive().setDepth(12).setScale(0.5);
    const text = this.add.text(960, 600, '100%', { fontSize: '32px', color: '#000' }).setOrigin(0.5).setDepth(12);

    let isDragging = false;
    toggle.on('pointerdown', () => isDragging = true);
    this.input.on('pointerup', () => isDragging = false);
    this.input.on('pointermove', (pointer) => {
      if (!isDragging) return;
      const minX = 720;
      const maxX = 1200;
      toggle.x = Phaser.Math.Clamp(pointer.x, minX, maxX);
      const percent = Math.round(((toggle.x - minX) / (maxX - minX)) * 100);
      text.setText(`${percent}%`);
      this.music.setVolume(percent / 100);
    });

    close.on('pointerup', () => {
      bg.destroy(); bar.destroy(); toggle.destroy(); close.destroy(); text.destroy();
    });
  }

  update(_, delta) {
    this.swayTime += delta * 0.001;
    this.bubble.x = 960 + Math.sin(this.swayTime) * 30;
    const scale = 1 + Math.sin(this.swayTime * 1.5) * 0.01;
    this.bubble.setScale(scale);
    this.backgroundBubbles.forEach(b => {
      b.y -= b.speed;
      if (b.y < -50) {
        b.x = Phaser.Math.Between(0, 1920);
        b.y = Phaser.Math.Between(1100, 1500);
      }
    });
  }
}

class NextScene extends Phaser.Scene {
  constructor() {
    super('NextScene');
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.add.image(cx, cy, 'BG1').setDisplaySize(this.scale.width, this.scale.height).setDepth(1);
    this.sun = this.add.image(cx + 250, cy - 300, 'BG4').setScale(0.8).setDepth(4);
    this.tweens.add({ targets: this.sun, alpha: { from: 1, to: 0.7 }, duration: 2000, yoyo: true, repeat: -1 });

    this.clouds = this.add.image(cx, cy - 100, 'BG5').setDepth(5);
    this.trees = this.add.image(cx, cy, 'BG2').setDepth(2);
    this.add.image(cx, cy, 'BG3').setDepth(3);
    this.foilage = this.add.image(cx, cy, 'BG6').setDepth(6);
    this.add.image(cx, cy, 'BG7').setDepth(7);
    this.add.image(cx, cy, 'BG8').setDepth(8);

    const book = this.add.image(0, 0, 'PG_Fish_Book').setOrigin(1, 1).setScale(0.5).setInteractive().setDepth(10);
    const cart = this.add.image(0, 0, 'PG_Shopping_Cart').setOrigin(1, 1).setScale(0.5).setInteractive().setDepth(10);
    cart.setPosition(this.cameras.main.width - 40, this.cameras.main.height - 40);
    book.setPosition(cart.x - cart.displayWidth - 20, this.cameras.main.height - 40);

    [book, cart].forEach(icon => {
      icon.on('pointerdown', () => icon.setTint(0xcccccc));
      icon.on('pointerup', () => icon.clearTint());
    });

    this.char = this.add.image(cx, cy + 100, 'Char_throw').setDepth(9);
    this.cursor = this.add.image(cx + 140, cy + 160, 'Select_1').setDepth(10);
    this.cursorFrames = ['Select_1', 'Select_2'];
    this.cursorFrameIndex = 0;
    this.cursorTimer = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.cursorFrameIndex = (this.cursorFrameIndex + 1) % this.cursorFrames.length;
        this.cursor.setTexture(this.cursorFrames[this.cursorFrameIndex]);
      },
      loop: true
    });

    this.input.once('pointerdown', () => {
      this.cursor.destroy();
      this.char.setTexture('Char_throw2');
      this.time.delayedCall(500, () => {
        this.idleState = 0;
        this.char.setTexture('Char_idle1');
        this.time.addEvent({
          delay: 800,
          callback: () => {
            this.idleState = 1 - this.idleState;
            this.char.setTexture(this.idleState === 0 ? 'Char_idle1' : 'Char_idle2');
          },
          loop: true
        });
      });
    });
  }

  update(_, delta) {
    this.swayTime = (this.swayTime || 0) + delta * 0.001;
    this.trees.x = this.cameras.main.centerX + Math.sin(this.swayTime) * 5;
    this.foilage.x = this.cameras.main.centerX + Math.sin(this.swayTime + 1) * 5;
    this.clouds.x += 0.8;
    if (this.clouds.x > this.cameras.main.width + 200) this.clouds.x = -200;
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: '#000000',
  scene: [MainMenu, NextScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {
    disableWebAudio: false
  }
};

new Phaser.Game(config);
