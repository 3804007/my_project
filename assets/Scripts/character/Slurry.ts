const { ccclass, property } = cc._decorator;
const State = {
  stand: 1,
  attack: 2,
  hurt: 3,
};

@ccclass
export default class Slurry extends cc.Component {
  isHit: boolean;
  enemyAni: cc.Animation;
  enemyState;
  anima: string;
  tt: number;
  attackspace: number;
  hp: number;

  moveLeft: boolean;
  moveRight: boolean;
  moveTop: boolean;
  moveDown: boolean;
  speed: number;
  initialspeed: number;

  playerNode: cc.Node;

  @property
  Maxhp: number = 80;

  @property(cc.ProgressBar)
  lifeprogress: cc.ProgressBar;

  onLoad() {
    this.isHit = false;

    this.anima = "idle";
    this.enemyState = State.stand;

    this.enemyAni = this.node.getComponent(cc.Animation);
    this.tt = 0;
    this.attackspace = 0;
    this.hp = this.Maxhp;

    this.speed = 0.8;
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
        } else if (data.name == "attack") {
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
    if (this.attackspace >= 1.5) {
      this.setAni("attack");
      this.enemyState = State.attack;
      this.attackspace = 0;
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

  enemyAction(dt) {
    if (cc.isValid(this.playerNode, true)) {
      let attack = this.node.getChildByName("attack");
      let a_pos = attack.convertToWorldSpaceAR(cc.v3(0, 0));
      a_pos = this.playerNode.convertToNodeSpaceAR(a_pos);

      let p_pos = this.playerNode.position;
      let e_pos = this.node.position;
      let dis = cc.Vec2.distance(p_pos, e_pos);
      let v = p_pos.sub(e_pos);

      if (Math.abs(a_pos.x) < 130 && Math.abs(a_pos.y) < 130) {
        this.moveRight = false;
        this.moveLeft = false;
        this.moveTop = false;
        this.moveDown = false;
        this.enemyState = State.attack;
      } else if (dis < 500) {
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
      this.playerNode.getComponent("Hero").addScore(100);
    }, 300);
  }

  update(dt) {
    this.lifeprogress.progress = this.hp / this.Maxhp;
    //状态切换

    this.tt += dt;
    this.attackspace += dt;
    if (this.tt >= 0.2 && this.enemyState == State.stand) {
      this.enemyAction(dt);
      this.tt = 0;
    }

    if (this.enemyState == State.attack) {
      this.attack();
    } else if (this.enemyState == State.stand) {
      this.move();
    }
  }
}
