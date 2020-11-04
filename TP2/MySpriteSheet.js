const TEXT_SPRITE_SHEET = "images/textspritesheet.png";
const TEXT_SPRITE_SHEET_M = 16;
const TEXT_SPRITE_SHEET_N = 8;


class MySpriteSheet {
    
    static shader = null;

    constructor(texture, sizeM, sizeN){
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
    }

    static initShader(gl) {
        MySpriteSheet.shader = new CGFshader(gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");
    }

    activateCellMN(m, n) {
        MySpriteSheet.shader.setUniformsValues({
            M: this.sizeM,
            N: this.sizeN,
            m: m,
            n: n
        });
    }

    activateCellP(p) {
        this.activateCellMN(p % this.sizeM, Math.floor(p / this.sizeM));
    }

    apply(scene) {
        scene.pushTexture(this.texture);
        scene.pushShader(MySpriteSheet.shader);
        // this.scene.reapplyCurrentMaterial();
    }

    deapply(scene) {
        scene.popTexture();
        scene.popShader();
    }

}

class MySpriteText {

    static textSheet = null;
    static rectangle = null;

    constructor(scene, text){
        if (MySpriteText.textSheet === null) {
            MySpriteText.textSheet = new MySpriteSheet(new CGFtexture(scene, TEXT_SPRITE_SHEET), TEXT_SPRITE_SHEET_M, TEXT_SPRITE_SHEET_N);
        }
        if (MySpriteText.rectangle == null) {
            MySpriteText.rectangle = new MyRectangle(scene, 0, 0, 1, 1, 1, 1);
        }
        this.scene = scene;
        this.lines = text.split('\n');

        for(let character of text)
            console.log(character);
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0) - 32;
    }

    moveMatrixRight(pos) {
        let translationMatrix;
        translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, [pos, 0, 0]);
        this.scene.multMatrix(translationMatrix);
    }

    _displayLine(line) {
        for(let character of line){
            MySpriteText.textSheet.activateCellP(this.getCharacterPosition(character));
            MySpriteText.rectangle.display();
            this.moveMatrixRight(1);
        }
    }

    display() {
        MySpriteText.textSheet.apply(this.scene);

        let oldMatrix = this.scene.activeMatrix;

        let height = this.lines.length / 2;
        let mat = mat4.create();
        for (let i = 0; i < this.lines.length; i++) {
            mat4.translate(mat, oldMatrix, [-this.lines[i].length / 2, height - i, 0]);
            this.scene.setMatrix(mat);
            this._displayLine(this.lines[i]);
        }

        this.scene.activeMatrix = oldMatrix;
        MySpriteText.textSheet.deapply(this.scene);
    }

}

class MySpriteAnimation {

    constructor(spriteSheet, startCell, endCell, animationTime){
        this.spriteSheet = spriteSheet;
        this.startCell = startCell;
        this.endCell = endCell;
        this.animationTime = animationTime;
    }

    update(t) {

    }
}