const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  tt: number;
  allNum: number;
  bossNum: number;
  Camera;
  box;

  @property(cc.Prefab)
  add1: cc.Prefab;

  @property(cc.Prefab)
  add2: cc.Prefab;

  @property(cc.Prefab)
  enemy1: cc.Prefab;

  @property(cc.Prefab)
  enemy2: cc.Prefab;

  @property(cc.Prefab)
  Boss: cc.Prefab;

  @property()
  maxNum: number = 5;

  onLoad() {
    this.Boss != null ? (this.bossNum = 1) : (this.bossNum = 0);
    this.allNum = this.maxNum + this.bossNum;
    this.tt = 0;

    this.Camera = cc.find("Canvas/Main Camera").getComponent("Camera");
    this.box = cc.find("Canvas/bg/box");

    cc.director.getCollisionManager().enabled = true;
  }

  spwanPrefab(Prefab, x?: number, y?: number) {
    let newPrefab = cc.instantiate(Prefab);
    let pos_x = Math.random() * this.box.width;
    let pos_y = (Math.random() - 0.5) * 2 * this.box.height;

    if (x != null) pos_x = x;
    if (y != null) pos_y = y;
    console.log("x:" + pos_x + "y:" + pos_y);

    this.node.addChild(newPrefab);
    let p = setInterval(() => {
      if (!cc.isValid(newPrefab, true)) {
        this.allNum--;
        console.log(this.allNum);
        clearInterval(p);
      }
    }, 800);

    newPrefab.setPosition(cc.v2(pos_x, pos_y));
  }

  spwanAdd(pos) {
    let add =
      Math.random() < 0.5
        ? Math.random() < 0.8
          ? this.add1
          : this.add2
        : null;
    if (add == null) return;

    let newAdd = cc.instantiate(add);
    this.node.addChild(newAdd);

    let p = setInterval(() => {
      cc.isValid(newAdd, true)
        ? newAdd.getComponent(cc.Animation).play("add")
        : clearInterval(p);
    }, 5000);

    setTimeout(() => {
      cc.isValid(newAdd, true) ? newAdd.destroy() : clearTimeout();
    }, 25000);

    newAdd.setPosition(pos);
  }

  update(dt) {
    if (this.allNum == 0) {
      this.Camera.getComponentInChildren("UI").win();
      this.allNum++;
    }
    this.tt += dt;

    if (this.tt >= 0.3) {
      if (this.maxNum) {
        if (this.enemy1 != null && this.enemy2 != null) {
          if (Math.random() <= 0.5) {
            this.spwanPrefab(this.enemy1);
          } else {
            this.spwanPrefab(this.enemy2);
          }
        } else if (this.enemy1 != null) {
          this.spwanPrefab(this.enemy1);
        } else if (this.enemy2 != null) {
          this.spwanPrefab(this.enemy2);
        }
        this.tt = 0;
        this.maxNum--;
      }
    }
    if (this.maxNum == 0) {
      if (this.Boss != null && this.bossNum != 0) {
        this.spwanPrefab(this.Boss, this.Camera.max_x, 0);
        this.bossNum--;
      }
    }
  }
}
