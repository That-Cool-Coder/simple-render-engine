class RenderCanvas extends spnr.GameEngine.DrawableEntity {
    segmentsPerColumn = 10;
    rayAmount = 300;

    /*
    How to use:
    -----------
    Create a Camera object and add the scene holding this canvas. Create a bunch of RenderablePlane objects and add them to the scene too. That's it!


    How this works:
    ---------------

    This render engine is an upgraded version of basic raycasting engines such as the one found at https://ray-casting-renderer.thatcoolcoder.repl.co/.
    
    These basic engines work by sending out a bunch of rays from the camera and finding where they intersect the walls. Each ray only 'remembers' the intersection with the least distance from the camera. Each ray is linked to a column on screen, and the height of the color in that column is determined by the distance from the camera to the closest intersection of that ray. In addition, some also change the brightness of the colors of the columns to create rudimentary lighting.

    This engine is similar to those mentioned above, but it also supports vertically moving walls up and down, and changing their heights. Instead of noting a single closest collision from each ray, it notes the closest n collisions, and calculates their height, vertical offset and color. Then, starting from the furthest away collision, it draws that section of the column, and works its way forward overwriting the previous ones.
    */

    RayIntersection = class {
        constructor(ray, renderablePlane, position, distance) {
            this.ray = ray;
            this.renderablePlane = renderablePlane;
            this.position = position;
            this.distance = distance;
        }
    }

    constructor(name, size, backgroundColor) {
        super(name, spnr.v(0, 0), 0, PIXI.Texture.WHITE,
            size, spnr.v(1, 1));
        this.setTint(backgroundColor);

        this.createColumnSprites();
    }

    createColumnSprites() {
        this.columnSprites = [];
        this.removeChildren();

        var size = spnr.v(this.textureSize.x / this.rayAmount, 0);
        for (var columnIdx = 0; columnIdx < this.rayAmount; columnIdx ++) {
            var position = spnr.v(size.x * (columnIdx + 0.5), 0);
            var crntColumn = [];
            for (var segmentIdx = 0; segmentIdx < this.segmentsPerColumn; segmentIdx ++) {
                var segment = new spnr.GameEngine.DrawableEntity('ColumnSprite',
                    position, 0, PIXI.Texture.WHITE, size);
                this.addChild(segment);
                crntColumn.push(segment);
            }
            this.columnSprites.push(crntColumn);
        }
    }

    createRays(camera) {
        var rays = [];
        var imagePlaneWidth = spnr.tan(camera.fov / 2) * 2;
        var rayXIncrement = imagePlaneWidth / this.rayAmount;
        var centerPoint = imagePlaneWidth / 2 - rayXIncrement / 2;
        for (var rayIdx = 0; rayIdx < this.rayAmount; rayIdx ++) {
            var rayDirectionVector = spnr.v(rayXIncrement * rayIdx - centerPoint, 1);
            var angle = spnr.atan(rayDirectionVector.x / rayDirectionVector.y);
            angle += camera.globalAngle;
            rays.push(Ray.fromAngle(camera.globalPosition, angle, camera.maxViewDist));
        }
        return rays;
    }

    chooseClosestIntersections(intersections) {
        // First sort the intersections from far at start to close at end
        intersections.sort(function(a, b) {
            return spnr.sign(b.distance - a.distance);
        });
        
        // Then choose the N closest intersections
        if (intersections.length <= this.segmentsPerColumn) {
            return intersections;
        }
        else {
            return intersections.slice(intersections.length - this.segmentsPerColumn);
        }
    }

    findIntersections(rays, renderablePlanes, camera) {
        var intersections = [];
        for (var rayIdx = 0; rayIdx < rays.length; rayIdx ++) {
            var ray = rays[rayIdx];
            var thisRayIntersections = [];
            for (var renderablePlaneIdx = 0; renderablePlaneIdx < renderablePlanes.length;
                renderablePlaneIdx ++) {
                var renderablePlane = renderablePlanes[renderablePlaneIdx];
                var intersectPosition = renderablePlane.intersectPosition(ray);
                if (intersectPosition != null) {
                    var distance = spnr.v.dist(intersectPosition, camera.globalPosition);
                    thisRayIntersections.push(new this.RayIntersection(ray,
                        renderablePlane, intersectPosition, distance));
                }
            }
            var closestIntersections = this.chooseClosestIntersections(thisRayIntersections);
            intersections.push(closestIntersections);
        }
        return intersections;
    }

    updateColumns(intersections, camera) {
        // First make all of the segments have no size
        for (var columnIdx = 0; columnIdx < this.columnSprites.length; columnIdx ++) {
            var column = this.columnSprites[columnIdx];
            for (var segmentIdx = 0; segmentIdx < column.length; segmentIdx ++) {
                var segment = column[segmentIdx];
                // Only change size if it's not already correct
                if (segment.textureSize.y != 0) {
                    segment.setTextureSize(spnr.v(segment.textureSize.x, 0));
                }
            }
        }

        var pixelsPerRadian = this.textureSize.x / camera.fov;
        
        for (var rayIdx = 0; rayIdx < intersections.length; rayIdx ++) {
            var thisRayIntersections = intersections[rayIdx];
            for (var intersectionIdx = 0; intersectionIdx < thisRayIntersections.length;
                intersectionIdx ++) {
                var intersection = thisRayIntersections[intersectionIdx];
                var heightOnScreen = this.calcSegmentHeight(intersection, pixelsPerRadian);
                var yPos = this.calcSegmentYPos(intersection, pixelsPerRadian, camera);
                var color = this.calcSegmentColor(intersection, camera);
                if (color == 0x000000) {
                    heightOnScreen = 0;
                }

                var sprite = this.columnSprites[rayIdx][intersectionIdx];
                sprite.setTextureSize(spnr.v(sprite.textureSize.x, heightOnScreen));
                sprite.setLocalPosition(spnr.v(sprite.localPosition.x, yPos));
                sprite.setTint(color);
                sprite.updateSpritePosition();
                sprite.setAlpha(intersection.renderablePlane.alpha);
            }
        }
    }

    calcSegmentHeight(intersection, pixelsPerRadian) {
        var angleToTop = spnr.atan(intersection.renderablePlane.height /
            intersection.distance);
        return angleToTop * 2 * pixelsPerRadian;
    }

    calcSegmentYPos(intersection, pixelsPerRadian, camera) {
        var yPos = this.textureSize.y / 2;
        var angle = spnr.atan(
            (-intersection.renderablePlane.getVerticalPosition() + camera.globalPosition.z) /
            intersection.distance);
        angle -= camera.verticalAngle;
        yPos += angle * pixelsPerRadian;
        return yPos;
    }

    calcSegmentColor(intersection, camera) {
        var brightnessMult = 1 - (intersection.distance / camera.maxViewDist);
        var rgb = decimalToRgb(intersection.renderablePlane.color);
        for (var idx = 0; idx < rgb.length; idx ++) {
            rgb[idx] *= brightnessMult;
        }
        return rgbToDecimal(rgb);
    }

    update() {
        spnr.dom.clearLogPara();
        var cameras = spnr.GameEngine.getEntitiesWithTag('Camera');
        if (cameras.length > 0) {
            var rays = this.createRays(cameras[0]);

            var renderablePlanes = spnr.GameEngine.getEntitiesWithTag('RenderablePlane');
            var intersections = this.findIntersections(rays, renderablePlanes, cameras[0]);
            this.updateColumns(intersections, cameras[0]);
        }
    }
}