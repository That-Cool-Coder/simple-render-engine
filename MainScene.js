class MainScene extends spnr.GameEngine.Scene {
    movingBoxColors = [0xff0000, 0xffff00, 0xff7700, 0xff00ff, 0x00ff00, 0x00ffff];
    movingBoxAlpha = 0.5;
    
    constructor() {
        super('MainScene');

        this.addChild(new RenderCanvas('MainRenderCanvas', spnr.GameEngine.canvasSize,
            0x000000));
        this.player = new Player(spnr.v(0, 0), 0);
        this.addChild(this.player);
        this.player.addChild(new Camera(spnr.v(0, 0), 0, spnr.radians(60), 30));

        this.addChild(new RenderableBox('Walls', spnr.v(0, 0, 0), spnr.v(10, 10, 1)));
        
        this.movingBoxColors.forEach(color => {
            this.addChild(new MovingBox('Moving box', spnr.v(5, 5, 0), spnr.v(0.25, 0.25, 0.25),
                spnr.v(0, 0), spnr.v(10, 10, 1), color, this.movingBoxAlpha));
        })
    }
}