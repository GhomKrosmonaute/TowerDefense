var app = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    setup: () => setup,
    windowResized: () => windowResized
  });

  // src/app/clock.ts
  var tickInterval = 100;
  var info = {
    lastTick: Date.now() - tickInterval,
    gameDuration: 0
  };
  function tick() {
    if (info.lastTick > Date.now() + tickInterval) {
      info.gameDuration += tickInterval;
      info.lastTick = Date.now();
      this(info);
      requestAnimationFrame(tick.bind(this));
    }
  }

  // src/app/space.ts
  var board = new Set();
  var boxSize = [48, 48];
  var boardBoxes = [15, 10];
  var boardSize = [
    boxSize[0] * boardBoxes[0],
    boxSize[1] * boardBoxes[1]
  ];
  function boardPosition() {
    return sticky([width / 2 - boardSize[0] / 2, height / 2 - boardSize[1] / 2]);
  }
  function arrayBoard() {
    return [...board];
  }
  function sticky(v) {
    return mult(floor(div(sub(v, div(boxSize, [3, 3])), div(boxSize, [2, 2]))), div(boxSize, [2, 2]));
  }
  function mouse() {
    return [mouseX, mouseY];
  }
  function stickyMouse() {
    return sticky(max(min(mouse(), sub(add(boardPosition(), boardSize), div(boxSize, [3, 3]))), add(boardPosition(), div(boxSize, [3, 3]))));
  }
  function min(v1, v2) {
    return [Math.min(v1[0], v2[0]), Math.min(v1[1], v2[1])];
  }
  function max(v1, v2) {
    return [Math.max(v1[0], v2[0]), Math.max(v1[1], v2[1])];
  }
  function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  }
  function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  }
  function div(v1, v2) {
    return [v1[0] / v2[0], v1[1] / v2[1]];
  }
  function mult(v1, v2) {
    return [v1[0] * v2[0], v1[1] * v2[1]];
  }
  function floor(v) {
    return [Math.floor(v[0]), Math.floor(v[1])];
  }
  function place(item) {
    if (item.gridSlave)
      arrayBoard().forEach((boardItem) => {
        if (boardItem.gridSlave && boardItem.position.toString() === item.position.toString()) {
          board.delete(boardItem);
        }
      });
    board.add(item);
  }
  function isDisplayable(item) {
    return "zIndex" in item && "draw" in item;
  }

  // src/app/sprite.ts
  var defaultTowerSprite = (angle, position) => {
    fill("blue");
    noStroke();
    ellipse(...position, ...boxSize);
  };

  // src/app/tower.ts
  var defaultEffect = (game2, weapon, enemy) => {
    enemy.life -= weapon.damage * game2.damageMultiplier;
  };
  var towers = [
    [
      {
        name: "Pellet",
        cost: 5,
        rate: 0.5 / 60,
        damage: 10,
        range: 10,
        sellCost: 10,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      }
    ]
  ];
  var Tower = class {
    constructor(game2, position, base) {
      this.game = game2;
      this.position = position;
      this.base = base;
      this._level = 0;
      this.zIndex = 1;
      this.angle = 0;
      this.gridSlave = false;
    }
    get level() {
      return this.base[this._level];
    }
    upgrade() {
      const nextLevel = this.base[this._level + 1];
      if (!nextLevel)
        return false;
      this.game.money -= nextLevel.cost;
      this._level++;
      return true;
    }
    update() {
    }
    draw() {
      this.level.sprite(this.angle, this.position);
    }
  };

  // src/game.ts
  var Game = class {
    constructor() {
      this.life = 20;
      this.money = 100;
      this.score = 0;
      this.time = 0;
      this.bonuses = [];
      this.lastTimeGiven = Date.now();
      board.clear();
    }
    get damageMultiplier() {
      return 1;
    }
    update(info2) {
    }
    draw() {
      background(0);
      drawBoard();
      drawSelectionRect();
      drawPositionableItems();
    }
    keyPressed() {
      place(new Tower(this, stickyMouse(), towers[0]));
    }
    keyReleased() {
    }
  };
  var game_default = Game;
  function drawSelectionRect() {
    noStroke();
    fill(40);
    rect(...stickyMouse(), ...boxSize);
  }
  function drawBoard() {
    stroke(50);
    strokeWeight(2);
    fill(20);
    rect(...boardPosition(), ...boardSize);
  }
  function drawPositionableItems() {
    arrayBoard().filter((item) => isDisplayable(item)).sort((a, b) => a.zIndex - b.zIndex).forEach((item) => item.draw());
  }

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  var game;
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    game = new game_default();
    tick.bind(game.update.bind(game))();
  }
  function draw() {
    game.draw();
  }
  function keyPressed() {
    game.keyPressed();
  }
  function keyReleased() {
    game.keyReleased();
  }
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvYXBwL3Nwcml0ZS50cyIsICJzcmMvYXBwL3Rvd2VyLnRzIiwgInNyYy9nYW1lLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCAqIGFzIGNsb2NrIGZyb20gXCIuL2FwcC9jbG9ja1wiXG5cbmltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5sZXQgZ2FtZTogR2FtZVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZSA9IG5ldyBHYW1lKClcblxuICBjbG9jay50aWNrLmJpbmQoZ2FtZS51cGRhdGUuYmluZChnYW1lKSkoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgZ2FtZS5kcmF3KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7XG4gIGdhbWUua2V5UHJlc3NlZCgpXG59XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7XG4gIGdhbWUua2V5UmVsZWFzZWQoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2luZG93UmVzaXplZCgpIHtcbiAgcmVzaXplQ2FudmFzKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpXG59XG4iLCAiZXhwb3J0IGNvbnN0IHRpY2tJbnRlcnZhbCA9IDEwMFxuXG5leHBvcnQgY29uc3QgaW5mbzogVGltZUluZm8gPSB7XG4gIGxhc3RUaWNrOiBEYXRlLm5vdygpIC0gdGlja0ludGVydmFsLFxuICBnYW1lRHVyYXRpb246IDAsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUluZm8ge1xuICBsYXN0VGljazogbnVtYmVyXG4gIGdhbWVEdXJhdGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWNrKHRoaXM6IChpbmZvOiBUaW1lSW5mbykgPT4gdm9pZCkge1xuICBpZiAoaW5mby5sYXN0VGljayA+IERhdGUubm93KCkgKyB0aWNrSW50ZXJ2YWwpIHtcbiAgICBpbmZvLmdhbWVEdXJhdGlvbiArPSB0aWNrSW50ZXJ2YWxcbiAgICBpbmZvLmxhc3RUaWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMoaW5mbylcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljay5iaW5kKHRoaXMpKVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGJvYXJkID0gbmV3IFNldDxQb3NpdGlvbmFibGU+KClcbmV4cG9ydCBjb25zdCBib3hTaXplOiBWZWN0b3IgPSBbNDgsIDQ4XVxuZXhwb3J0IGNvbnN0IGJvYXJkQm94ZXM6IFZlY3RvciA9IFsxNSwgMTBdXG5leHBvcnQgY29uc3QgYm9hcmRTaXplOiBWZWN0b3IgPSBbXG4gIGJveFNpemVbMF0gKiBib2FyZEJveGVzWzBdLFxuICBib3hTaXplWzFdICogYm9hcmRCb3hlc1sxXSxcbl1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvYXJkUG9zaXRpb24oKTogVmVjdG9yIHtcbiAgcmV0dXJuIHN0aWNreShbd2lkdGggLyAyIC0gYm9hcmRTaXplWzBdIC8gMiwgaGVpZ2h0IC8gMiAtIGJvYXJkU2l6ZVsxXSAvIDJdKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlCb2FyZCgpIHtcbiAgcmV0dXJuIFsuLi5ib2FyZF1cbn1cblxuZXhwb3J0IHR5cGUgVmVjdG9yID0gW3g6IG51bWJlciwgeTogbnVtYmVyXVxuXG5leHBvcnQgZnVuY3Rpb24gc3RpY2t5KHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBtdWx0KFxuICAgIGZsb29yKGRpdihzdWIodiwgZGl2KGJveFNpemUsIFszLCAzXSkpLCBkaXYoYm94U2l6ZSwgWzIsIDJdKSkpLFxuICAgIGRpdihib3hTaXplLCBbMiwgMl0pXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlKCk6IFZlY3RvciB7XG4gIHJldHVybiBbbW91c2VYLCBtb3VzZVldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGlja3lNb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KFxuICAgIG1heChcbiAgICAgIG1pbihtb3VzZSgpLCBzdWIoYWRkKGJvYXJkUG9zaXRpb24oKSwgYm9hcmRTaXplKSwgZGl2KGJveFNpemUsIFszLCAzXSkpKSxcbiAgICAgIGFkZChib2FyZFBvc2l0aW9uKCksIGRpdihib3hTaXplLCBbMywgM10pKVxuICAgIClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWluKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGgubWluKHYxWzBdLCB2MlswXSksIE1hdGgubWluKHYxWzFdLCB2MlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXgodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5tYXgodjFbMF0sIHYyWzBdKSwgTWF0aC5tYXgodjFbMV0sIHYyWzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSArIHYyWzBdLCB2MVsxXSArIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC0gdjJbMF0sIHYxWzFdIC0gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXYodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gLyB2MlswXSwgdjFbMV0gLyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG11bHQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKiB2MlswXSwgdjFbMV0gKiB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsb29yKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5mbG9vcih2WzBdKSwgTWF0aC5mbG9vcih2WzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKHBvc2l0aW9uOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gYWRkKHBvc2l0aW9uLCBbMCwgMF0pXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25hYmxlIHtcbiAgZ3JpZFNsYXZlOiBib29sZWFuXG4gIHBvc2l0aW9uOiBWZWN0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdyaWRTbGF2ZUF0KGF0OiBWZWN0b3IpOiBQb3NpdGlvbmFibGUgfCB1bmRlZmluZWQge1xuICByZXR1cm4gYXJyYXlCb2FyZCgpLmZpbmQoXG4gICAgKGl0ZW0pID0+XG4gICAgICBpdGVtLmdyaWRTbGF2ZSAmJlxuICAgICAgc3RpY2t5KGl0ZW0ucG9zaXRpb24pLnRvU3RyaW5nKCkgPT09IHN0aWNreShhdCkudG9TdHJpbmcoKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJdGVtc0F0KGF0OiBWZWN0b3IpOiBQb3NpdGlvbmFibGVbXSB7XG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmlsdGVyKFxuICAgIChpdGVtKSA9PiBzdGlja3koaXRlbS5wb3NpdGlvbikudG9TdHJpbmcoKSA9PT0gc3RpY2t5KGF0KS50b1N0cmluZygpXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlKGl0ZW06IFBvc2l0aW9uYWJsZSkge1xuICBpZiAoaXRlbS5ncmlkU2xhdmUpXG4gICAgYXJyYXlCb2FyZCgpLmZvckVhY2goKGJvYXJkSXRlbSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBib2FyZEl0ZW0uZ3JpZFNsYXZlICYmXG4gICAgICAgIGJvYXJkSXRlbS5wb3NpdGlvbi50b1N0cmluZygpID09PSBpdGVtLnBvc2l0aW9uLnRvU3RyaW5nKClcbiAgICAgICkge1xuICAgICAgICBib2FyZC5kZWxldGUoYm9hcmRJdGVtKVxuICAgICAgfVxuICAgIH0pXG5cbiAgYm9hcmQuYWRkKGl0ZW0pXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGxheWFibGUge1xuICB6SW5kZXg6IG51bWJlclxuICBkcmF3KCk6IHVua25vd25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlzcGxheWFibGUoaXRlbTogb2JqZWN0KTogaXRlbSBpcyBEaXNwbGF5YWJsZSB7XG4gIHJldHVybiBcInpJbmRleFwiIGluIGl0ZW0gJiYgXCJkcmF3XCIgaW4gaXRlbVxufVxuIiwgImltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL3NwYWNlXCJcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUb3dlclNwcml0ZTogU3ByaXRlID0gKGFuZ2xlLCBwb3NpdGlvbikgPT4ge1xuICBmaWxsKFwiYmx1ZVwiKVxuICBub1N0cm9rZSgpXG4gIGVsbGlwc2UoLi4ucG9zaXRpb24sIC4uLnNwYWNlLmJveFNpemUpXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RW5lbXlTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24pID0+IHtcbiAgZmlsbChcInJlZFwiKVxuICBub1N0cm9rZSgpXG4gIGVsbGlwc2UoLi4ucG9zaXRpb24sIC4uLnNwYWNlLmJveFNpemUpXG59XG5cbmV4cG9ydCB0eXBlIFNwcml0ZSA9IChhbmdsZTogbnVtYmVyLCBwb3NpdGlvbjogc3BhY2UuVmVjdG9yKSA9PiB1bmtub3duXG4iLCAiaW1wb3J0ICogYXMgZW5lbXkgZnJvbSBcIi4vZW5lbXlcIlxuaW1wb3J0ICogYXMgc3BhY2UgZnJvbSBcIi4vc3BhY2VcIlxuaW1wb3J0ICogYXMgc3ByaXRlIGZyb20gXCIuL3Nwcml0ZVwiXG5cbmltcG9ydCBHYW1lIGZyb20gXCIuLi9nYW1lXCJcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRFZmZlY3Q6IFRvd2VyRWZmZWN0ID0gKGdhbWUsIHdlYXBvbiwgZW5lbXkpID0+IHtcbiAgZW5lbXkubGlmZSAtPSB3ZWFwb24uZGFtYWdlICogZ2FtZS5kYW1hZ2VNdWx0aXBsaWVyXG59XG5cbmV4cG9ydCBjb25zdCB0b3dlcnM6IEJhc2VUb3dlcltdID0gW1xuICBbXG4gICAge1xuICAgICAgbmFtZTogXCJQZWxsZXRcIixcbiAgICAgIGNvc3Q6IDUsXG4gICAgICByYXRlOiAwLjUgLyA2MCwgLy8gdW4gdGlyIHRvdXRlcyBsZXMgZGV1eCBzZWNvbmRlc1xuICAgICAgZGFtYWdlOiAxMCxcbiAgICAgIHJhbmdlOiAxMCxcbiAgICAgIHNlbGxDb3N0OiAxMCxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjEsIC8vIHVuZSBjaGFuY2Ugc3VyIGRpeCBkZSBmYWlyZSB1biBjcml0aXF1ZVxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gIF0sXG5dXG5cbmV4cG9ydCB0eXBlIEJhc2VUb3dlciA9IFRvd2VyTGV2ZWxbXVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvd2VyTGV2ZWwge1xuICBuYW1lOiBzdHJpbmdcbiAgcmF0ZTogbnVtYmVyXG4gIGRhbWFnZTogbnVtYmVyXG4gIGNvc3Q6IG51bWJlclxuICBzZWxsQ29zdDogbnVtYmVyXG4gIHNwcml0ZTogc3ByaXRlLlNwcml0ZVxuICByYW5nZTogbnVtYmVyXG4gIGNyaXRpY2FsOiBudW1iZXJcbiAgZWZmZWN0OiBUb3dlckVmZmVjdFxufVxuXG5leHBvcnQgY2xhc3MgVG93ZXIgaW1wbGVtZW50cyBzcGFjZS5Qb3NpdGlvbmFibGUsIHNwYWNlLkRpc3BsYXlhYmxlIHtcbiAgcHJpdmF0ZSBfbGV2ZWwgPSAwXG5cbiAgekluZGV4ID0gMVxuICBhbmdsZSA9IDBcbiAgZ3JpZFNsYXZlID0gZmFsc2VcblxuICBnZXQgbGV2ZWwoKTogVG93ZXJMZXZlbCB7XG4gICAgcmV0dXJuIHRoaXMuYmFzZVt0aGlzLl9sZXZlbF1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBnYW1lOiBHYW1lLFxuICAgIHB1YmxpYyBwb3NpdGlvbjogc3BhY2UuVmVjdG9yLFxuICAgIHB1YmxpYyByZWFkb25seSBiYXNlOiBCYXNlVG93ZXJcbiAgKSB7fVxuXG4gIHVwZ3JhZGUoKSB7XG4gICAgY29uc3QgbmV4dExldmVsID0gdGhpcy5iYXNlW3RoaXMuX2xldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5nYW1lLm1vbmV5IC09IG5leHRMZXZlbC5jb3N0XG4gICAgdGhpcy5fbGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoKSB7fVxuXG4gIGRyYXcoKSB7XG4gICAgdGhpcy5sZXZlbC5zcHJpdGUodGhpcy5hbmdsZSwgdGhpcy5wb3NpdGlvbilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUb3dlcihpdGVtOiBzcGFjZS5Qb3NpdGlvbmFibGUpOiBpdGVtIGlzIFRvd2VyIHtcbiAgcmV0dXJuIFwiYmFzZVwiIGluIGl0ZW0gJiYgXCJsZXZlbFwiIGluIGl0ZW1cbn1cblxuZXhwb3J0IHR5cGUgVG93ZXJFZmZlY3QgPSAoXG4gIGdhbWU6IEdhbWUsXG4gIHRvd2VyOiBUb3dlckxldmVsLFxuICBlbmVteTogZW5lbXkuRW5lbXlcbikgPT4gdW5rbm93blxuIiwgImltcG9ydCAqIGFzIHRvd2VyIGZyb20gXCIuL2FwcC90b3dlclwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgbGlmZSA9IDIwXG4gIG1vbmV5ID0gMTAwXG4gIHNjb3JlID0gMFxuICB0aW1lID0gMFxuICBib251c2VzID0gW11cblxuICBwcml2YXRlIGxhc3RUaW1lR2l2ZW4gPSBEYXRlLm5vdygpXG5cbiAgZ2V0IGRhbWFnZU11bHRpcGxpZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3BhY2UuYm9hcmQuY2xlYXIoKVxuICB9XG5cbiAgdXBkYXRlKGluZm86IGNsb2NrLlRpbWVJbmZvKSB7fVxuXG4gIGRyYXcoKSB7XG4gICAgYmFja2dyb3VuZCgwKVxuXG4gICAgZHJhd0JvYXJkKClcbiAgICBkcmF3U2VsZWN0aW9uUmVjdCgpXG4gICAgZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKClcbiAgfVxuXG4gIGtleVByZXNzZWQoKSB7XG4gICAgc3BhY2UucGxhY2UobmV3IHRvd2VyLlRvd2VyKHRoaXMsIHNwYWNlLnN0aWNreU1vdXNlKCksIHRvd2VyLnRvd2Vyc1swXSkpXG4gIH1cblxuICBrZXlSZWxlYXNlZCgpIHt9XG59XG5cbmZ1bmN0aW9uIGRyYXdTZWxlY3Rpb25SZWN0KCkge1xuICBub1N0cm9rZSgpXG4gIGZpbGwoNDApXG4gIHJlY3QoLi4uc3BhY2Uuc3RpY2t5TW91c2UoKSwgLi4uc3BhY2UuYm94U2l6ZSlcbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICBzdHJva2UoNTApXG4gIHN0cm9rZVdlaWdodCgyKVxuICBmaWxsKDIwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkUG9zaXRpb24oKSwgLi4uc3BhY2UuYm9hcmRTaXplKVxufVxuXG5mdW5jdGlvbiBkcmF3UG9zaXRpb25hYmxlSXRlbXMoKSB7XG4gIHNwYWNlXG4gICAgLmFycmF5Qm9hcmQoKVxuICAgIC5maWx0ZXIoKGl0ZW0pOiBpdGVtIGlzIHNwYWNlLlBvc2l0aW9uYWJsZSAmIHNwYWNlLkRpc3BsYXlhYmxlID0+XG4gICAgICBzcGFjZS5pc0Rpc3BsYXlhYmxlKGl0ZW0pXG4gICAgKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgIC5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmRyYXcoKSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDQU8sTUFBTSxlQUFlO0FBRXJCLE1BQU0sT0FBaUI7QUFBQSxJQUM1QixVQUFVLEtBQUssUUFBUTtBQUFBLElBQ3ZCLGNBQWM7QUFBQTtBQVFULGtCQUE4QztBQUNuRCxRQUFJLEtBQUssV0FBVyxLQUFLLFFBQVEsY0FBYztBQUM3QyxXQUFLLGdCQUFnQjtBQUNyQixXQUFLLFdBQVcsS0FBSztBQUNyQixXQUFLO0FBQ0wsNEJBQXNCLEtBQUssS0FBSztBQUFBO0FBQUE7OztBQ2pCN0IsTUFBTSxRQUFRLElBQUk7QUFDbEIsTUFBTSxVQUFrQixDQUFDLElBQUk7QUFDN0IsTUFBTSxhQUFxQixDQUFDLElBQUk7QUFDaEMsTUFBTSxZQUFvQjtBQUFBLElBQy9CLFFBQVEsS0FBSyxXQUFXO0FBQUEsSUFDeEIsUUFBUSxLQUFLLFdBQVc7QUFBQTtBQUduQiwyQkFBaUM7QUFDdEMsV0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLFVBQVUsS0FBSyxHQUFHLFNBQVMsSUFBSSxVQUFVLEtBQUs7QUFBQTtBQUdwRSx3QkFBc0I7QUFDM0IsV0FBTyxDQUFDLEdBQUc7QUFBQTtBQUtOLGtCQUFnQixHQUFtQjtBQUN4QyxXQUFPLEtBQ0wsTUFBTSxJQUFJLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxPQUN6RCxJQUFJLFNBQVMsQ0FBQyxHQUFHO0FBQUE7QUFJZCxtQkFBeUI7QUFDOUIsV0FBTyxDQUFDLFFBQVE7QUFBQTtBQUdYLHlCQUErQjtBQUNwQyxXQUFPLE9BQ0wsSUFDRSxJQUFJLFNBQVMsSUFBSSxJQUFJLGlCQUFpQixZQUFZLElBQUksU0FBUyxDQUFDLEdBQUcsT0FDbkUsSUFBSSxpQkFBaUIsSUFBSSxTQUFTLENBQUMsR0FBRztBQUFBO0FBS3JDLGVBQWEsSUFBWSxJQUFvQjtBQUNsRCxXQUFPLENBQUMsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHO0FBQUE7QUFHOUMsZUFBYSxJQUFZLElBQW9CO0FBQ2xELFdBQU8sQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUc7QUFBQTtBQUc5QyxlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixnQkFBYyxJQUFZLElBQW9CO0FBQ25ELFdBQU8sQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHO0FBQUE7QUFHN0IsaUJBQWUsR0FBbUI7QUFDdkMsV0FBTyxDQUFDLEtBQUssTUFBTSxFQUFFLEtBQUssS0FBSyxNQUFNLEVBQUU7QUFBQTtBQTBCbEMsaUJBQWUsTUFBb0I7QUFDeEMsUUFBSSxLQUFLO0FBQ1AsbUJBQWEsUUFBUSxDQUFDLGNBQWM7QUFDbEMsWUFDRSxVQUFVLGFBQ1YsVUFBVSxTQUFTLGVBQWUsS0FBSyxTQUFTLFlBQ2hEO0FBQ0EsZ0JBQU0sT0FBTztBQUFBO0FBQUE7QUFJbkIsVUFBTSxJQUFJO0FBQUE7QUFRTCx5QkFBdUIsTUFBbUM7QUFDL0QsV0FBTyxZQUFZLFFBQVEsVUFBVTtBQUFBOzs7QUMzR2hDLE1BQU0scUJBQTZCLENBQUMsT0FBTyxhQUFhO0FBQzdELFNBQUs7QUFDTDtBQUNBLFlBQVEsR0FBRyxVQUFVLEdBQVM7QUFBQTs7O0FDQ3pCLE1BQU0sZ0JBQTZCLENBQUMsT0FBTSxRQUFRLFVBQVU7QUFDakUsVUFBTSxRQUFRLE9BQU8sU0FBUyxNQUFLO0FBQUE7QUFHOUIsTUFBTSxTQUFzQjtBQUFBLElBQ2pDO0FBQUEsTUFDRTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTSxNQUFNO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixPQUFPO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixRQUFlO0FBQUEsUUFDZixVQUFVO0FBQUEsUUFDVixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBbUJQLG9CQUE2RDtBQUFBLElBV2xFLFlBQ1MsT0FDQSxVQUNTLE1BQ2hCO0FBSE87QUFDQTtBQUNTO0FBYlYsb0JBQVM7QUFFakIsb0JBQVM7QUFDVCxtQkFBUTtBQUNSLHVCQUFZO0FBQUE7QUFBQSxRQUVSLFFBQW9CO0FBQ3RCLGFBQU8sS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLElBU3hCLFVBQVU7QUFDUixZQUFNLFlBQVksS0FBSyxLQUFLLEtBQUssU0FBUztBQUMxQyxVQUFJLENBQUM7QUFBVyxlQUFPO0FBQ3ZCLFdBQUssS0FBSyxTQUFTLFVBQVU7QUFDN0IsV0FBSztBQUNMLGFBQU87QUFBQTtBQUFBLElBR1QsU0FBUztBQUFBO0FBQUEsSUFFVCxPQUFPO0FBQ0wsV0FBSyxNQUFNLE9BQU8sS0FBSyxPQUFPLEtBQUs7QUFBQTtBQUFBOzs7QUM5RHZDLG1CQUEwQjtBQUFBLElBYXhCLGNBQWM7QUFaZCxrQkFBTztBQUNQLG1CQUFRO0FBQ1IsbUJBQVE7QUFDUixrQkFBTztBQUNQLHFCQUFVO0FBRUYsMkJBQWdCLEtBQUs7QUFPM0IsTUFBTSxNQUFNO0FBQUE7QUFBQSxRQUxWLG1CQUEyQjtBQUM3QixhQUFPO0FBQUE7QUFBQSxJQU9ULE9BQU8sT0FBc0I7QUFBQTtBQUFBLElBRTdCLE9BQU87QUFDTCxpQkFBVztBQUVYO0FBQ0E7QUFDQTtBQUFBO0FBQUEsSUFHRixhQUFhO0FBQ1gsTUFBTSxNQUFNLElBQVUsTUFBTSxNQUFNLEFBQU0sZUFBZSxBQUFNLE9BQU87QUFBQTtBQUFBLElBR3RFLGNBQWM7QUFBQTtBQUFBO0FBL0JoQixNQUFPLGVBQVA7QUFrQ0EsK0JBQTZCO0FBQzNCO0FBQ0EsU0FBSztBQUNMLFNBQUssR0FBRyxBQUFNLGVBQWUsR0FBUztBQUFBO0FBR3hDLHVCQUFxQjtBQUNuQixXQUFPO0FBQ1AsaUJBQWE7QUFDYixTQUFLO0FBQ0wsU0FBSyxHQUFHLEFBQU0saUJBQWlCLEdBQVM7QUFBQTtBQUcxQyxtQ0FBaUM7QUFDL0IsSUFDRyxhQUNBLE9BQU8sQ0FBQyxTQUNQLEFBQU0sY0FBYyxPQUVyQixLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQzVCLFFBQVEsQ0FBQyxTQUFTLEtBQUs7QUFBQTs7O0FMckQ1QixXQUFTLGlCQUFpQixlQUFlLENBQUMsVUFBVSxNQUFNO0FBRTFELE1BQUk7QUFFRyxtQkFBaUI7QUFDdEIsaUJBQ0UsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGFBQWEsT0FBTyxjQUFjLElBQ3BFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixjQUFjLE9BQU8sZUFBZTtBQUd4RSxXQUFPLElBQUk7QUFFWCxJQUFNLEtBQUssS0FBSyxLQUFLLE9BQU8sS0FBSztBQUFBO0FBRzVCLGtCQUFnQjtBQUNyQixTQUFLO0FBQUE7QUFHQSx3QkFBc0I7QUFDM0IsU0FBSztBQUFBO0FBRUEseUJBQXVCO0FBQzVCLFNBQUs7QUFBQTtBQUdBLDJCQUF5QjtBQUM5QixpQkFBYSxhQUFhO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
