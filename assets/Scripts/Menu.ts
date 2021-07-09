// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  Scene: string;

  onLoad() {
    this.Scene = "";
  }

  Play() {
    if (this.Scene == "") {
      this.node.getChildByName("tips").opacity = 255;
      this.node.getChildByName("tips").getComponent(cc.Animation).play("tips");
    } else {
      cc.director.loadScene(this.Scene);
    }
  }

  tipsOK() {
    this.Scene = "Scene1";
    cc.director.loadScene(this.Scene);
  }

  tipsResume() {
    this.node.getChildByName("tips").y = 400;
  }

  Set() {
    this.node.getChildByName("setlevel").y = 0;
  }

  toggleContainer() {
    let toggle1 = cc.find("Canvas/setlevel/toggleContainer/toggle1");
    let toggle2 = cc.find("Canvas/setlevel/toggleContainer/toggle2");
    let toggle3 = cc.find("Canvas/setlevel/toggleContainer/toggle3");
    if (toggle1.getComponent(cc.Toggle).isChecked == true) {
      this.Scene = "Scene1";
    } else if (toggle2.getComponent(cc.Toggle).isChecked == true) {
      this.Scene = "Scene2";
    } else if (toggle3.getComponent(cc.Toggle).isChecked == true) {
      this.Scene = "Scene3";
    }
    console.log(this.Scene);
    this.node.getChildByName("setlevel").y = -700;
  }
}
