let Game = {
  display: null,
  map: {},
  player: null,
  engine: null,

  init: function() {
    this.display = new ROT.Display();
    document.body.appendChild(this.display.getContainer());
    this._generateMap();

    // game cycle
    let scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  },

  _createPlayer: function(freeCells) {
    // generate player instance
    let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    let key = freeCells.splice(index, 1)[0];
    let parts = key.split(",");
    let x = parseInt(parts[0]);
    let y = parseInt(parts[1]);
    this.player = new Player(x, y);
  },

  _generateMap: function() {
    let digger = new ROT.Map.Digger();
    let freeCells = [];

    let digCallback = function(x, y, value) {
      if (value) return;

      let key = `${x},${y}`;
      freeCells.push(key);
      this.map[key] = "・";
    };
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);

    this._drawWholeMap();

    this._createPlayer(freeCells);
  },

  _generateBoxes: function(freeCells) {
    //Prize boxes
    for (let i = 0; i < 10; i++) {
      let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      let key = freeCells.splice(index, 1)[0];
      this.map[key] = "P";
    }
  },

  _drawWholeMap: function() {
    for (let key in this.map) {
      let parts = key.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
  }
};

/* Player class */
let Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
};
Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "T", "#ff0");
};
/* player movement */
Player.prototype.act = function() {
  Game.engine.lock();
  window.addEventListener("keydown", this);
};
Player.prototype.handleEvent = function(e) {
  var keyMap = {};
  keyMap[37] = 6;
  keyMap[38] = 0;
  keyMap[39] = 2;
  keyMap[40] = 4;

  let code = e.keyCode;

  if (!(code in keyMap)) return; //if unregistered key is pressed, skip

  let diff = ROT.DIRS[8][keyMap[code]];
  let newX = this._x + diff[0];
  let newY = this._y + diff[1];

  let newKey = `${newX},${newY}`;
  if (!(newKey in Game.map)) return; //if its a wall. skip

  //move character and unlock the engine
  Game.display.draw(this._x, this._y, Game.map[(this._x, this._y)]);
  this._x = newX;
  this._y = newY;
  this._draw();
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
};
