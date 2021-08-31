class RenderablePlane extends spnr.GameEngine.Entity {
    constructor(name, start, end, height, color=0xffffff, alpha=1) {
        // The vertical position will be set to mean of start.z and end.z
        super(name, spnr.v(0, 0), 0);
        this.addTag('RenderablePlane');
        this.start = spnr.v.copy(start);
        this.end = spnr.v.copy(end);
        this.height = height;
        this.color = color;
        this.alpha = alpha;

        this.cachedGlobalPosition = spnr.v.copy(this.localPosition);
    }

    intersectPosition(ray) {
        // returns intersection point of this with ray
        // returns null if no intersection

        // Cache these two because they're VERY slow to eval
        var thisGlobalStart = this.getGlobalStart();
        var thisGlobalEnd = this.getGlobalEnd();

        var intersection = null;
        var den = (thisGlobalStart.x - thisGlobalEnd.x) * (ray.start.y - ray.end.y) -
            (thisGlobalStart.y - thisGlobalEnd.y) * (ray.start.x - ray.end.x);

        // if lines intersect (simple check)
        if (den != 0) {
            var t = ((thisGlobalStart.x - ray.start.x) * (ray.start.y - ray.end.y) -
                (thisGlobalStart.y - ray.start.y) * (ray.start.x - ray.end.x)) / den;
            var u = -((thisGlobalStart.x - thisGlobalEnd.x) * (thisGlobalStart.y - ray.start.y) -
                (thisGlobalStart.y - thisGlobalEnd.y) * (thisGlobalStart.x - ray.start.x)) / den;
            // if lines intersect (cpu intensive check)
            if (t > 0 && t < 1 && u > 0) {
                intersection = spnr.v(0, 0);
                intersection.x = thisGlobalStart.x + t * (thisGlobalEnd.x - thisGlobalStart.x);
                intersection.y = thisGlobalStart.y + t * (thisGlobalEnd.y - thisGlobalStart.y);
            }
        }
        return intersection;
    }

    clearCachedGlobalPosition() {
        this.getCacheableGlobalPosition(false);
    }

    getCacheableGlobalPosition(useCache=true) {
        if (useCache) {
            return spnr.v.copy(this.cachedGlobalPosition);
        }
        else {
            this.cachedGlobalPosition = this.globalPosition;
            return this.cachedGlobalPosition;
        }
    }

    getVerticalPosition(useGlobalPositionCache=true) {
        return spnr.mean(this.getGlobalStart(useGlobalPositionCache).z,
            this.getGlobalEnd(useGlobalPositionCache).z);
    }

    getGlobalStart(useGlobalPositionCache=true) {
        return spnr.v.copyAdd(
            this.getCacheableGlobalPosition(useGlobalPositionCache), this.start);
    }

    getGlobalEnd(useGlobalPositionCache=true) {
        return spnr.v.copyAdd(
            this.getCacheableGlobalPosition(useGlobalPositionCache), this.end);
    }

    update() {
        this.clearCachedGlobalPosition();
    }
}