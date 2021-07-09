const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    scaleX
    onLoad(){
        this.scaleX=this.node.scaleX
    }

    update (dt) {
        this.node.scaleX=this.node.parent.scaleX<0?this.scaleX:-this.scaleX
    }
}
