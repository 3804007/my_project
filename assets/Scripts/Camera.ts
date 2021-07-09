const { ccclass, property } = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

  @property(cc.Node)
  playerNode: cc.Node;

  @property(cc.ProgressBar)
  lifeprogress: cc.ProgressBar;

  @property
  min_x: number = 0;

  @property
  max_x: number = 0;

  @property
  min_y: number = 0;

  @property
  max_y: number = 0;

  onLoad() {
    this.node.zIndex = 9999;
  }

  update(dt) {
    if (cc.isValid(this.playerNode, true)) {
      if (this.playerNode.x > this.min_x && this.playerNode.x < this.max_x) {
        this.node.x = this.playerNode.x;
      }
      if (this.playerNode.y > this.min_y && this.playerNode.y < this.max_y) {
        this.node.y = this.playerNode.y;
      }
    }
  }
}
