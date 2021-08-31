class Player extends spnr.GameEngine.Entity {
    moveSpeed = 5;
    turnSpeed = spnr.radians(270);
    verticalTurnSpeed = spnr.radians(60);
    maxVerticalAngle = spnr.radians(15);

    constructor(position, angle) {
        super('Player', position, angle);
    }

    update() {
        var movement = spnr.v(0, 0);
        if (spnr.GameEngine.keyboard.keyIsDown('KeyW')) {
            movement.y += this.moveSpeed;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('KeyS')) {
            movement.y -= this.moveSpeed;
        }

        // For some reason that I cannot explain after a year of making raycasters,
        // the movement x value must be the inverse of what you'd expect
        if (spnr.GameEngine.keyboard.keyIsDown('KeyA')) {
            movement.x += this.moveSpeed;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('KeyD')) {
            movement.x -= this.moveSpeed;
        }

        var rotation = 0;
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowLeft')) {
            rotation -= this.turnSpeed;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowRight')) {
            rotation += this.turnSpeed;
        }

        var camera = this.children[0];
        var verticalRotation = 0;
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowUp')) {
            verticalRotation -= this.verticalTurnSpeed;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowDown')) {
            verticalRotation += this.verticalTurnSpeed;
        }

        // Return vertical rotation to center if no keys pressed
        if (verticalRotation == 0) {
            if (spnr.abs(camera.verticalAngle) >=
                this.verticalTurnSpeed * spnr.GameEngine.deltaTime) {
                verticalRotation += -spnr.sign(camera.verticalAngle) * this.verticalTurnSpeed;
            }
            else {
                verticalRotation = 0;
                camera.verticalAngle = 0;
            }
        }

        spnr.v.rotate(movement, this.localAngle);
        spnr.v.mult(movement, spnr.GameEngine.deltaTime);
        spnr.v.add(this.localPosition, movement);

        this.localAngle += rotation * spnr.GameEngine.deltaTime;

        camera.verticalAngle += verticalRotation * spnr.GameEngine.deltaTime;
        camera.verticalAngle = spnr.constrain(camera.verticalAngle,
            -this.maxVerticalAngle, this.maxVerticalAngle);
    }
}