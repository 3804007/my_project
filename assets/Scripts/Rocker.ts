const { ccclass, property } = cc._decorator;

@ccclass
export default class Rocker extends cc.Component {
  RockerBtn: cc.Node;

  Maxspeed: number;
  HeroScripts: any;
  dir;

  @property(cc.Node)
  Hero: cc.Node;

  onLoad() {
    this.HeroScripts = this.Hero.getComponent("Hero");
    this.Maxspeed = this.HeroScripts.speed;
    this.dir = cc.v2(0, 0);

    this.RockerBtn = this.node.children[0];

    this.node.on("touchstart", this.onTouchStart, this);
    this.node.on("touchmove", this.onTouchMove, this);
    this.node.on("touchend", this.onTouchEnd, this);
    this.node.on("touchcancel", this.onTouchCancel, this);
  }

  onTouchStart(event) {
    this.HeroScripts.isTouch = true;

    let pos = this.node.convertToNodeSpaceAR(event.getLocation());
    this.RockerBtn.setPosition(pos);
  }

  onTouchMove(event) {
    this.HeroScripts.isTouch = true;

    let posDelta = event.getDelta();
    this.RockerBtn.setPosition(this.RockerBtn.position.add(posDelta));

    this.dir = this.RockerBtn.position.normalize();
  }

  onTouchEnd() {
    this.HeroScripts.isTouch = false;

    this.RockerBtn.setPosition(cc.v2(0, 0));
  }

  onTouchCancel() {
    this.HeroScripts.isTouch = false;

    this.RockerBtn.setPosition(cc.v2(0, 0));
  }

  onDestroy() {
    this.node.off("touchstart", this.onTouchStart, this);
    this.node.off("touchmove", this.onTouchMove, this);
    this.node.off("touchend", this.onTouchEnd, this);
    this.node.off("touchcancel", this.onTouchCancel, this);
  }

  update() {
    let len = this.RockerBtn.position.mag();
    let Maxlen = this.node.width / 2;
    let ratio = len / Maxlen;

    if (ratio > 1) {
      this.RockerBtn.setPosition(this.RockerBtn.position.div(ratio));
    }

    let dis = this.dir.mul(this.Maxspeed * ratio);
    this.Hero.setPosition(this.Hero.position.add(dis));

    let HeroScaleX = Math.abs(this.Hero.scaleX);
    if (this.HeroScripts.isTouch) {
      this.Hero.scaleX = HeroScaleX * this.dir.x > 0 ? 1 : -1;
      console.log(this.Hero.scaleX);
    }
  }
}
