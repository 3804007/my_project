// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  foot: any;
  onLoad() {
    let footname = this.node.parent.name;
    console.log(footname);
    this.foot = this.node.parent.getComponent(footname);
  }

  onCollisionStay(other, self) {
    if (other.tag == 3) {
      this.foot.speed = this.foot.initialspeed;
    }
  }

  onCollisionExit(other, self) {
    if (other.tag == 3) {
      if (this.node.x > 0) {
        this.node.parent.x -= 6;
      }
      if (this.node.parent.x < 0) {
        this.node.parent.x += 6;
      }
      if (this.node.parent.y < 0) {
        this.node.parent.y += 6;
      }
      if (this.node.parent.y > 0) {
        this.node.parent.y -= 6;
      }
      this.foot.speed = 0.1;
    }
  }
}
