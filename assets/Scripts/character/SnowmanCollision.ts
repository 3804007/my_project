// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    losehealth: number;
    scaleX:number;
    ChildID:number;
    Prefab:cc.Asset;
    pos_x:number;
    pos_y:number;

    onLoad() {
        this.scaleX = this.node.scaleX;
        this.ChildID = 0;
    }

    onCollisionEnter(other, self) {
        if (other.node.group == "HeroArms" && other.tag > 0) {
            this.losehealth = 10 + Math.floor(Math.random() * 5);
            this.node.parent.getComponent("Snowman").hurt(this.losehealth);

            let playerNode = cc.find("Canvas/Hero");
            let pos = this.node.parent.position;
            playerNode.getComponent("Hero").spwanVision(pos);

            if (other.tag == 2) {
                this.node.parent.x = this.node.parent.x + this.node.parent.scaleX * 70;
            }
            this.createReview();
        }
    }

    async createReview() {
        let losehealth = new Array();

        if (this.losehealth < 10) {
            losehealth.push(String(this.losehealth));
        } else {
            losehealth.push(String(Math.floor(this.losehealth / 10)));
            losehealth.push(String(this.losehealth % 10));
        }
        console.log(losehealth)

        for (let i = 0; i < losehealth.length; i++) {
            let path = "heroattack/" + losehealth[i];

            if (i == 0) {
                let node = new cc.Node(String(this.ChildID));
                this.pos_x = (Math.random() - 0.5) * 2 * 50;
                this.pos_y = (Math.random() - 0.5) * 2 * 100;

                this.node.addChild(node);
                node.addComponent(cc.Layout);
                node.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
                node.setPosition(this.pos_x + 100, this.pos_y - 20);
                setTimeout(() => {
                    node.destroy();
                }, 1200);
            }

            await new Promise((resolve, reject) => {
                cc.resources.load(path, cc.Prefab, (err, Prefab) => {
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
