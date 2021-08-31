class Ray {
    constructor(start, end) {
        this.start = spnr.v.copy(start);
        this.end = spnr.v.copy(end);
    }

    static fromAngle(start, angle, length) {
        var delta = spnr.v(0, length);
        spnr.v.rotate(delta, angle);
        spnr.v.add(delta, start);
        return new Ray(start, delta);
    }

    copy() {
        var copyOfStart = spnr.v.copy(this.start);
        var copyOfEnd = spnr.v.copy(this.end);
        return new Ray(copyOfStart, copyOfEnd);
    }

    heading() {
        return spnr.v.heading(this.getDelta());
    }

    getDelta() {
        return spnr.v.copySub(this.end, this.start);
    }

    rotateEndAroundStart(angleCW) {
        var thisDelta = this.getDelta();
        spnr.v.rotate(thisDelta, angleCW);
        this.end = spnr.v.add(thisDelta, this.start);
    }
}