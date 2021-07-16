const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  RockerBtn: cc.Node;

  onLoad() {
    this.RockerBtn = this.node.children[0];

    this.node.on("touchstart", this.onTouchStart, this);
    this.node.on("touchmove", this.onTouchMove, this);
    this.node.on("touchend", this.onTouchEnd, this);
    this.node.on("touchcancel", this.onTouchCancel, this);
  }

  onTouchStart(event) {
    let pos = this.node.convertToNodeSpaceAR(event.getLocation());
    this.RockerBtn.setPosition(pos);
  }

  onTouchMove(event) {
    let posDelta = event.getDelta();
    this.RockerBtn.setPosition(this.RockerBtn.position.add(posDelta));
  }

  onTouchEnd() {
    this.RockerBtn.setPosition(cc.v2(0, 0));
  }

  onTouchCancel() {
    this.RockerBtn.setPosition(cc.v2(0, 0));
  }

  update() {
    let len = this.RockerBtn.position.mag();
    let Maxlen = this.node.width / 2;
    let ratio = len / Maxlen;

    if (ratio > 1) {
      this.RockerBtn.setPosition(this.RockerBtn.position.div(ratio));
    }
  }

  onDestroy() {
    this.node.off("touchstart", this.onTouchStart, this);
    this.node.off("touchmove", this.onTouchMove, this);
    this.node.off("touchend", this.onTouchEnd, this);
    this.node.off("touchcancel", this.onTouchCancel, this);
  }
}
