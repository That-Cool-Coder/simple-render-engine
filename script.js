spnr.GameEngine.init(spnr.v(800, 500), 1, 0x000000);
var canvasSizer = new spnr.GameEngine.FixedARCanvasSizer(spnr.v(800, 500), spnr.v(20, 20));
spnr.GameEngine.selectCanvasSizer(canvasSizer);
spnr.GameEngine.selectScene(new MainScene());