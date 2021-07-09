const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroCollision extends cc.Component {
  enemyNode: cc.Node;
  Hero: any;

  losehealth: number;
  addhealth: number;

  scaleX: number;
  ChildID: number;
  Prefab: cc.Asset;
  pos_x: number;
  pos_y: number;

  onLoad() {
    this.scaleX = this.node.scaleX;
    this.Hero = this.node.parent.getComponent("Hero");
    this.ChildID = 0;
  }

  onCollisionEnter(other, self) {
    this.losehealth = 0;
    this.addhealth = 0;

    if (other.node.group == "EnemyArms" && other.tag == 1) {
      if (other.name == "Blood<BoxCollider>") {
        cc.isValid(other.node, true) && other.node.destroy();
        this.losehealth = 12 + Math.floor(Math.random() * 4);

        this.enemyNode = cc.find("Canvas/BonesC");
        let pos = this.node.parent.position;
        this.enemyNode.getComponent("BonesC").spwanVision(pos);
      } else if (other.name == "Snowball<BoxCollider>") {
        cc.isValid(other.node, true) && other.node.destroy();
        this.losehealth = 5 + Math.floor(Math.random() * 3);

        this.enemyNode = cc.find("Canvas/Snowman");
        let pos = this.node.parent.position;
        this.enemyNode.getComponent("Snowman").spwanVision(pos);
      } else if (other.name == "Slurry<BoxCollider>") {
        this.losehealth = 8 + Math.floor(Math.random() * 3);
      } else if (other.name == "BonesC<BoxCollider>") {
        this.losehealth = 15 + Math.floor(Math.random() * 6);
      }
      if (this.Hero.isPali) this.losehealth = Math.ceil(this.losehealth / 2);
      this.Hero.hurt(this.losehealth);
      this.createReview(this.losehealth, "herohurt/");
    } else if (other.node.group == "Add") {
      other.node.destroy();
      if (other.name == "LesserHea<BoxCollider>") {
        this.addhealth = 10 + Math.floor(Math.random() * 5);
        this.Hero.add(this.addhealth);
      } else if (other.name == "SurvivalKit<BoxCollider>") {
        this.addhealth = 25 + Math.floor(Math.random() * 5);
      }
      this.Hero.add(this.addhealth);
      this.createReview(this.addhealth, "heroadd/");
    }
  }

  async createReview(parm: number, path: string) {
    let hp = new Array();

    if (parm < 10) {
      hp.push(String(parm));
    } else {
      hp.push(String(Math.floor(parm / 10)));
      hp.push(String(parm % 10));
    }

    for (let i = 0; i < hp.length; i++) {
      let _path = path + hp[i];

      if (i == 0) {
        let node = new cc.Node(String(this.ChildID));
        this.pos_x = (Math.random() - 0.5) * 2 * 50;
        this.pos_y = (Math.random() - 0.5) * 2 * 100;

        this.node.addChild(node);
        node.addComponent(cc.Layout);
        node.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
        node.setPosition(this.pos_x + 100, this.pos_y - 10);
        setTimeout(() => {
          node.destroy();
        }, 1200);
      }

      await new Promise((resolve, reject) => {
        cc.resources.load(_path, cc.Prefab, (err, Prefab) => {
          Prefab.addRef();
          this.Prefab = Prefab;
          resolve("");
        });
      });
      this.spwanReview(this.Prefab);
    }
    this.ChildID += 1;
  }

  spwanReview(Prefab) {
    let Review = cc.instantiate(Prefab);

    console.log(this.ChildID);
    this.node.getChildByName(String(this.ChildID)).addChild(Review);

    setTimeout(() => {
      Review.destroy();
    }, 1000);
  }

  update() {
    this.node.scaleX = this.node.parent.scaleX < 0 ? -this.scaleX : this.scaleX;
  }
}
