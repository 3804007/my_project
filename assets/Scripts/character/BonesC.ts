const { ccclass, property } = cc._decorator;
const State = {
  stand: 1,
  attackMelee: 2,
  attackShooter: 3,
  hurt: 4,
};

@ccclass
export default class BonesC extends cc.Component {
  isHit: boolean;
  enemyAni: cc.Animation;
  enemyState;
  anima: string;
  tt: number;
  attackspace: number;

  moveLeft: boolean;
  moveRight: boolean;
  moveTop: boolean;
  moveDown: boolean;
  speed: number;
  initialspeed: number;

  playerNode: cc.Node;

  @property
  hp: number = 200;

  @property(cc.Prefab)
  Blood: cc.Prefab;

  @property(cc.Prefab)
  vision: cc.Prefab;

  @property(cc.ProgressBar)
  lifeprogress: cc.ProgressBar;

  onLoad() {
    this.isHit = false;

    this.anima = "idle";
    this.enemyState = State.stand;

    this.enemyAni = this.node.getComponent(cc.Animation);
    this.tt = 0;
    this.attackspace = 0;

    this.speed = 1;
    this.initialspeed = this.speed;
    this.moveRight = false;
    this.moveLeft = false;
    this.moveTop = false;
    this.moveDown = false;

    cc.find("Canvas/Hero") && (this.playerNode = cc.find("Canvas/Hero"));

    this.enemyAni.on(
      "finished",
      (e, data) => {
        if (data.name == "hurt") {
          if (this.hp <= 0) {
            this.ded();
          } else {
            this.node.x = this.node.x + this.node.scaleX * 15;

            setTimeout(() => {
              this.isHit = false;
              this.enemyState = State.stand;
              this.setAni("idle");
            }, 100);
          }
        } else if (data.name == "attack1" || data.name == "attack2") {
          if (data.name == "attack2") this.spwanBlood();
          this.setAni("idle");
          this.enemyState = State.stand;
        }
      },
      this
    );
  }

  hurt(losehealth: number) {
    if (this.isHit) return;

    this.hp -= losehealth;
    this.isHit = true;
    this.enemyState = State.hurt;

    this.setAni("hurt");
  }

  attack() {
    if (this.enemyState == State.attackMelee) {
      if (this.attackspace >= 2.3) {
        this.setAni("attack1");
        this.attackspace = 0;
      }
    } else {
      if (this.attackspace >= 1.8) {
        this.setAni("attack2");
        this.attackspace = 0;
      }
    }
  }

  setAni(anima) {
    if (this.anima == anima) {
      return;
    }
    this.anima = anima;
    this.enemyAni.play(anima);
  }

  move() {
    let scaleX = Math.abs(this.node.scaleX);
    if (this.moveRight || this.moveLeft || this.moveTop || this.moveDown) {
      if (this.moveTop) {
        this.node.y += this.speed;
        this.setAni("run");
      }
      if (this.moveDown) {
        this.node.y -= this.speed;
        this.setAni("run");
      }
      if (this.moveLeft) {
        this.node.scaleX = scaleX;
        this.node.x -= this.speed;
        this.setAni("run");
      }
      if (this.moveRight) {
        this.node.scaleX = -scaleX;
        this.node.x += this.speed;
        this.setAni("run");
      }
    } else {
      this.setAni("idle");
    }
  }

  spwanBlood() {
    let scaleX = this.node.scaleX;
    let Blood = cc.instantiate(this.Blood);
    this.node.addChild(Blood);
    let Ani = Blood.getComponent(cc.Animation);
    Blood.setPosition(cc.v2(scaleX * 80, 30));

    Ani.play("blood");

    setTimeout(() => {
      Blood.destroy();
    }, 900);
  }

  spwanVision(pos) {
    let vision = cc.instantiate(this.vision);
    this.node.parent.addChild(vision);
    let Ani = vision.getComponent(cc.Animation);

    vision.setPosition(pos);

    Ani.play("Bloodvision");

    setTimeout(() => {
      vision.destroy();
    }, 500);
  }

  enemyAction() {
    if (cc.isValid(this.playerNode, true)) {
      let attack = this.node.getChildByName("attack");
      let a_pos = attack.convertToWorldSpaceAR(cc.v3(0, 0));
      a_pos = this.playerNode.convertToNodeSpaceAR(a_pos);

      let p_pos = this.playerNode.position;
      let e_pos = this.node.position;
      let dis = cc.Vec2.distance(p_pos, e_pos);
      let v = p_pos.sub(e_pos);

      if (Math.abs(a_pos.x) < 150 && Math.abs(a_pos.y) < 170) {
        this.moveRight = false;
        this.moveLeft = false;
        this.moveTop = false;
        this.moveDown = false;
        this.enemyState = State.attackMelee;
      } else if (dis < 900 && Math.abs(v.y) < 40) {
        this.moveRight = false;
        this.moveLeft = false;
        this.moveTop = false;
        this.moveDown = false;
        this.enemyState = State.attackShooter;
      } else if (dis < 1200) {
        if (v.x < 0) {
          this.moveRight = false;
          this.moveLeft = true;
        }
        if (v.x > 0) {
          this.moveRight = true;
          this.moveLeft = false;
        }
        if (v.y < 0) {
          this.moveTop = false;
          this.moveDown = true;
        }
        if (v.y > 0) {
          this.moveTop = true;
          this.moveDown = false;
        }
        this.enemyState = State.stand;
      } else {
        this.moveRight = false;
        this.moveLeft = false;
        this.moveTop = false;
        this.moveDown = false;
        this.enemyState = State.stand;
      }
    }
  }

  ded() {
    this.enemyAni.play("ded");
    setTimeout(() => {
      this.node.parent.getComponent("Game").spwanAdd(this.node.position);
      this.node.destroy();
      this.playerNode.getComponent("Hero").addScore(500);
    }, 280);
  }

  update(dt) {
    this.lifeprogress.progress = this.hp / 200;
    //状态切换
    this.tt += dt;
    this.attackspace += dt;
    if (this.tt >= 0.2 && this.enemyState == State.stand) {
      this.enemyAction();
      this.tt = 0;
    }

    if (
      this.enemyState == State.attackMelee ||
      this.enemyState == State.attackShooter
    ) {
      this.attack();
    } else if (this.enemyState == State.stand) {
      this.move();
    }
  }
}
