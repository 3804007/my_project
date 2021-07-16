// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  Hero;
  k;
  l;
  u;

  @property(cc.ProgressBar)
  lifeprogress: cc.ProgressBar;

  onLoad() {
    this.node.zIndex = 9999;

    if (cc.isValid(cc.find("Canvas/Hero"), true))
      this.Hero = cc.find("Canvas/Hero").getComponent("Hero");

    this.k = this.node.getChildByName("k");
    this.l = this.node.getChildByName("l");
    this.u = this.node.getChildByName("u");
  }

  info() {
    this.node.getChildByName("info").getComponent(cc.Animation).play("info");
    setTimeout(() => {
      cc.director.pause();
    }, 600);
  }

  infoback() {
    this.node.getChildByName("info").y = 1000;
    cc.director.resume();
  }

  home() {
    cc.director.loadScene("MainMenu");
  }

  exit() {
    console.log("Game already exit!");
    cc.director.end();
  }

  pause() {
    if (cc.director.isPaused()) {
      cc.director.resume();
    } else {
      cc.director.pause();
    }
  }

  failed() {
    let score = this.Hero.score;
    let failed = this.node.getChildByName("failed");

    failed.getComponent(cc.Animation).play("failed");
    failed.getChildByName("score").getComponent(cc.Label).string =
      "Score:" + String(score);

    failed.getChildByName("xp").getComponent(cc.Label).string = String(
      Math.ceil((Math.random() * score) / 10)
    );

    failed.getChildByName("jb").getComponent(cc.Label).string = String(
      Math.ceil(Math.random() * (score / 100))
    );
  }

  replay() {
    cc.director.loadScene(cc.director.getScene().name);
  }

  next() {
    if (cc.director.getScene().name == "Scene1") {
      cc.director.loadScene("Scene2");
    } else if (cc.director.getScene().name == "Scene2") {
      cc.director.loadScene("Scene3");
    } else {
      cc.director.loadScene("MainMenu");
    }
  }

  win() {
    let score = this.Hero.score;
    let win = this.node.getChildByName("win");

    win.getComponent(cc.Animation).play("failed");
    win.getChildByName("score").getComponent(cc.Label).string =
      "Score:" + String(score);

    win.getChildByName("xp").getComponent(cc.Label).string = String(
      Math.ceil((Math.random() * score) / 10)
    );

    win.getChildByName("jb").getComponent(cc.Label).string = String(
      Math.ceil(Math.random() * (score / 100))
    );
  }

  Gravi() {
    let Gravi = this.node.getChildByName("Gravi");
    if (this.Hero.isPali) Gravi.opacity = 255;
    else Gravi.opacity = 0;
  }

  update(dt) {
    let score = this.Hero.score;
    this.node.getComponentInChildren(cc.Label).string =
      "Score:" + String(score);
    this.Gravi();

    this.lifeprogress.progress = this.Hero.hp / this.Hero.Maxhp;

    this.k.opacity =
      ((this.Hero.kCoolingMax - this.Hero.kCooling) / this.Hero.kCoolingMax) *
      255;
    this.l.opacity =
      ((this.Hero.lCoolingMax - this.Hero.lCooling) / this.Hero.lCoolingMax) *
      255;
    this.u.opacity =
      ((this.Hero.uCoolingMax - this.Hero.uCooling) / this.Hero.uCoolingMax) *
      255;

    this.k.getComponentInChildren(cc.Sprite).fillRange = -(
      (this.Hero.kCoolingMax - this.Hero.kCooling) /
      this.Hero.kCoolingMax
    );
    this.l.getComponentInChildren(cc.Sprite).fillRange = -(
      (this.Hero.lCoolingMax - this.Hero.lCooling) /
      this.Hero.lCoolingMax
    );
    this.u.getComponentInChildren(cc.Sprite).fillRange = -(
      (this.Hero.uCoolingMax - this.Hero.uCooling) /
      this.Hero.uCoolingMax
    );
  }
}
