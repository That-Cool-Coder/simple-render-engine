class Camera extends spnr.GameEngine.Entity {
    constructor(localPosition, angle, fov, maxViewDist=20, verticalAngle=0) {
        super('Camera', localPosition, angle);
        this.addTag('Camera');
        this.fov = fov;
        this.maxViewDist = maxViewDist;
        this.verticalAngle = 0;
    }
}