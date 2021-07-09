const { ccclass, property } = cc._decorator;
const Input: { [k: string]: any } = {};
const State = {
  stand: 1,
  attack: 2,
  hurt: 3,
};

@ccclass
export default class Hero extends cc.Component {
  anima: string;
  heroAni: cc.Animation;
  heroState;
  combo: number;
  isHit: boolean;
  other: any;
  score: number;
  initialspeed: number;

  isPali: boolean;
  kCooling: number;
  kCoolingMax: number;
  lCooling: number;
  lCoolingMax: number;
  uCooling: number;
  uCoolingMax: number;

  @property
  speed: number = 5;

  @property
  hp: number = 100;

  @property(cc.Prefab)
  vision: cc.Prefab;

  onLoad() {
    this.heroState = State.stand;
    this.heroAni = this.node.getComponent(cc.Animation);
    this.anima = "idle";
    this.isHit = false;
    this.isPali = false;
    this.score = 0;
    this.initialspeed = this.speed;

    this.combo = 0;
    this.kCooling = 0;
    this.uCooling = 0;
    this.lCooling = 0;

    this.kCoolingMax = 15;
    this.uCoolingMax = 3;
    this.lCoolingMax = 5;

    this.node.getComponent(cc.BoxCollider).tag = 0;

    this.heroAni.on("finished", this.onAnimaFinished, this);
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_DOWN,
      (e) => {
        Input[e.keyCode] = 1;
      },
      this
    );
    cc.systemEvent.on(
      cc.SystemEvent.EventType.KEY_UP,
      (e) => {
        Input[e.keyCode] = 0;
      },
      this
    );
  }

  onAnimaFinished(e, data) {
    if (
      data.name == "attack1" ||
      data.name == "attack2" ||
      data.name == "pali" ||
      data.name == "zuhe" ||
      data.name == "yinzhang"
    ) {
      this.node.getComponent(cc.BoxCollider).tag = 0;
      this.heroState = State.stand;
      this.speed = 5;
      this.setAni("idle");
      this.combo = (this.combo + 1) % 2;

      setTimeout(() => {
        if (this.heroState == State.attack) return;
        this.combo = 0;
      }, 1000);
    } else if (data.name == "hurt") {
      if (this.hp <= 0) {
        this.ded();
      } else {
        setTimeout(() => {
          this.isHit = false;
          this.heroState = State.stand;
          this.setAni("idle");
        }, 30);
      }
    }
  }

  setAni(anima) {
    if (this.anima == anima) {
      return;
    }
    this.anima = anima;
    this.heroAni.play(anima);
  }

  spwanVision(pos) {
    let vision = cc.instantiate(this.vision);
    this.node.parent.addChild(vision);
    let Ani = vision.getComponent(cc.Animation);

    vision.setPosition(pos);

    if (Math.random() <= 0.5) {
      Ani.play("vision1");
    } else {
      Ani.play("vision2");
    }

    setTimeout(() => {
      vision.destroy();
    }, 200);
  }

  add(addhealth) {
    this.hp += addhealth;
    if (this.hp > 100) this.hp = 100;
  }

  hurt(losehealth: number) {
    this.hp -= losehealth;
    if (this.isHit) return;
    this.isHit = true;
    this.heroState = State.hurt;

    this.setAni("hurt");
  }

  attack() {
    if (Input[cc.macro.KEY.j]) {
      if (this.combo == 0) {
        this.setAni("attack1");
      } else if (this.combo == 1) {
        this.setAni("attack2");
      }
    } else if (Input[cc.macro.KEY.k] && this.kCooling <= 0) {
      this.isPali = true;
      this.setAni("pali");
      this.kCooling = this.kCoolingMax;
      setTimeout(() => {
        this.isPali = false;
      }, 5000);
    } else if (Input[cc.macro.KEY.l] && this.lCooling <= 0) {
      this.setAni("zuhe");
      this.lCooling = this.lCoolingMax;
      this.node.x = this.node.x + this.node.scaleX * 50;
      setTimeout(() => {
        this.node.x = this.node.x + this.node.scaleX * 50;
        setTimeout(() => {
          this.node.x = this.node.x + this.node.scaleX * 50;
        }, 400);
      }, 400);
    } else if (Input[cc.macro.KEY.u] && this.uCooling <= 0) {
      this.setAni("yinzhang");
      this.uCooling = this.uCoolingMax;
    }
  }

  move() {
    let scaleX = Math.abs(this.node.scaleX);
    if (
      Input[cc.macro.KEY.w] ||
      Input[cc.macro.KEY.s] ||
      Input[cc.macro.KEY.d] ||
      Input[cc.macro.KEY.a]
    ) {
      if (Input[cc.macro.KEY.w]) {
        this.node.y += this.speed;
        this.setAni("run");
      }
      if (Input[cc.macro.KEY.s]) {
        this.node.y -= this.speed;
        this.setAni("run");
      }
      if (Input[cc.macro.KEY.a]) {
        this.node.scaleX = -scaleX;
        this.node.x -= this.speed;
        this.setAni("run");
      }
      if (Input[cc.macro.KEY.d]) {
        this.node.scaleX = scaleX;
        this.node.x += this.speed;
        this.setAni("run");
      }
    } else {
      this.setAni("idle");
    }
  }

  ded() {
    this.heroAni.play("ded");
    setTimeout(() => {
      this.node.destroy();
      cc.find("Canvas/Main Camera/UI").getComponent("UI").failed();
    }, 700);
  }

  addScore(score: number) {
    this.score += score;
  }

  update(dt) {
    //技能cd
    if (this.kCooling > 0) {
      this.kCooling -= dt;
    }
    if (this.lCooling > 0) {
      this.lCooling -= dt;
    }
    if (this.uCooling > 0) {
      this.uCooling -= dt;
    }

    //状态切换
    if (this.isHit == false) {
      switch (this.heroState) {
        case State.stand: {
          if (
            Input[cc.macro.KEY.j] ||
            (Input[cc.macro.KEY.k] && this.kCooling <= 0) ||
            (Input[cc.macro.KEY.l] && this.lCooling <= 0) ||
            (Input[cc.macro.KEY.u] && this.uCooling <= 0)
          ) {
            Input[cc.macro.KEY.u]
              ? (this.node.getComponent(cc.BoxCollider).tag = 2)
              : (this.node.getComponent(cc.BoxCollider).tag = 1);
            this.heroState = State.attack;
          }
          break;
        }
      }
    }

    if (this.heroState == State.attack) {
      this.attack();
    } else if (this.heroState == State.stand) {
      this.move();
    }
  }

  onDestroy() {
    this.heroAni.off("finished", this.onAnimaFinished, this);
    cc.systemEvent.off(
      cc.SystemEvent.EventType.KEY_DOWN,
      (e) => {
        Input[e.keyCode] = 1;
      },
      this
    );
    cc.systemEvent.off(
      cc.SystemEvent.EventType.KEY_UP,
      (e) => {
        Input[e.keyCode] = 0;
      },
      this
    );
  }
}
