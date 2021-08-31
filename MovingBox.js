class MovingBox extends RenderableBox {
    maxSpeed = 10;
    maxAcceleration = 3;
    maxDeltaTime = 0.1;

    constructor(name, localPosition, size, boundingBoxPosition, boundingBoxSize, color=0xffffff, alpha=1) {
        super(name, localPosition, size, color, alpha);
        this.boundingBoxPosition = spnr.v.copy(boundingBoxPosition);
        this.boundingBoxSize = spnr.v.copy(boundingBoxSize);

        this.velocity = spnr.v(0, 0);
    }

    constrainSpeed() {
        var mag = spnr.v.mag(this.velocity);
        if (mag > this.maxSpeed) {
            spnr.v.mult(this.velocity, mag / this.maxSpeed);
        }
    }
    
    stayInBounds() {

        // store in var because globalPosition is slow
        var globalPos = this.globalPosition;

        var maxX = this.boundingBoxPosition.x + this.boundingBoxSize.x - this.size.x / 2;
        var newX = spnr.constrain(globalPos.x, -maxX, maxX);
        var maxY = this.boundingBoxPosition.y + this.boundingBoxSize.y - this.size.y / 2;
        var newY = spnr.constrain(globalPos.y, -maxY, maxY);
        var maxZ = this.boundingBoxPosition.z + this.boundingBoxSize.z - this.size.z / 2;
        var newZ = spnr.constrain(globalPos.z, -maxZ, maxZ);

        this.setGlobalPosition(spnr.v(newX, newY, newZ));

        // Bounce if the position was capped in any direction
        // (ie it hit the edge)
        if (globalPos.x != newX) {
            this.velocity.x *= -0.5;
        }
        if (globalPos.y != newY) {
            this.velocity.y *= -0.5;
        }
        if (globalPos.z != newZ) {
            this.velocity.z *= -0.5;
        }
    }

    update() {
        if (spnr.GameEngine.deltaTime <= this.maxDeltaTime) {
            var accelGenerator = () => spnr.randflt(-this.maxAcceleration, this.maxAcceleration);
            var acceleration = spnr.v(accelGenerator(), accelGenerator(), accelGenerator());
            spnr.v.mult(acceleration, spnr.GameEngine.deltaTime);

            spnr.v.add(this.velocity, acceleration);
            this.constrainSpeed();
            var movement = spnr.v.copyMult(this.velocity, spnr.GameEngine.deltaTime);
            spnr.v.add(this.localPosition, movement);
        }

        this.constrainSpeed();
        this.stayInBounds();
    }
}