class RenderableBox extends spnr.GameEngine.Entity {
    constructor(name, localPosition, size, color=0xffffff, alpha=1) {
        super(name, localPosition, 0);
        this.createRenderablePlanes();
        this.size = size;
        this.color = color;
        this.alpha = alpha;
    }

    set size(size) {
        this._size = spnr.v.copy(size);
        this.updateRenderablePlanes();
    }

    get size() {
        return this._size;
    }

    set color(color) {
        this._color = color;
        this.updateRenderablePlanes();
    }

    get color() {
        return this._color;
    }

    set alpha(alpha) {
        this._alpha = alpha;
        this.updateRenderablePlanes();
    }

    get alpha() {
        return this._alpha;
    }

    createRenderablePlanes() {
        this.renderablePlanes = [];
        spnr.doNTimes(4, () => {
            var plane = new RenderablePlane(this.name + ' plane',
                spnr.v(0, 0), spnr.v(0, 0), 0);
            this.renderablePlanes.push(plane);
            this.addChild(plane);
        })
    }

    updateRenderablePlanes() {
        // Update the child renderable planes to match the params of this

        // Yes I know loops exist...
        // writing it inline is much faster though
        // (tested)

        this.renderablePlanes[0].color = this.color;
        this.renderablePlanes[0].alpha = this.alpha;
        this.renderablePlanes[0].height = this.size.z;

        this.renderablePlanes[1].color = this.color;
        this.renderablePlanes[1].alpha = this.alpha;
        this.renderablePlanes[1].height = this.size.z;

        this.renderablePlanes[2].color = this.color;
        this.renderablePlanes[2].alpha = this.alpha;
        this.renderablePlanes[2].height = this.size.z;

        this.renderablePlanes[3].color = this.color;
        this.renderablePlanes[3].alpha = this.alpha;
        this.renderablePlanes[3].height = this.size.z;

        var frontLeft = spnr.v(-this.size.x, this.size.y);
        var frontRight = spnr.v(this.size.x, this.size.y);
        var backLeft = spnr.v(-this.size.x, -this.size.y);
        var backRight = spnr.v(this.size.x, -this.size.y);

        this.renderablePlanes[0].start = frontLeft;
        this.renderablePlanes[0].end = frontRight;
        this.renderablePlanes[1].start = frontRight;
        this.renderablePlanes[1].end = backRight;
        this.renderablePlanes[2].start = backRight;
        this.renderablePlanes[2].end = backLeft;
        this.renderablePlanes[3].start = backLeft;
        this.renderablePlanes[3].end = frontLeft;
    }
}