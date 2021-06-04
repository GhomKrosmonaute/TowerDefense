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
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
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
    noStroke();
    fill(50);
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
        range: boxSize[0] * 3,
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
      this.gridSlave = true;
    }
    get level() {
      return this.base[this._level];
    }
    get center() {
      return add(this.position, div(boxSize, [2, 2]));
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
      if (this.position.toString() === stickyMouse().toString())
        this.drawRange();
      this.level.sprite(this.angle, this.center);
    }
    drawRange() {
      strokeWeight(2);
      stroke(255, 215, 0, 50);
      fill(255, 215, 0, 30);
      circle(...this.center, this.level.range * 2);
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
    }
    keyReleased() {
    }
    mousePressed() {
      this.pressedAt = stickyMouse();
    }
    mouseReleased() {
      var _a;
      const releasedAt = stickyMouse();
      if (((_a = this.pressedAt) == null ? void 0 : _a.toString()) === releasedAt.toString()) {
        place(new Tower(this, stickyMouse(), towers[0]));
      }
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
  function mousePressed() {
    game.mousePressed();
  }
  function mouseReleased() {
    game.mouseReleased();
  }
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvYXBwL3Nwcml0ZS50cyIsICJzcmMvYXBwL3Rvd2VyLnRzIiwgInNyYy9nYW1lLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCAqIGFzIGNsb2NrIGZyb20gXCIuL2FwcC9jbG9ja1wiXG5cbmltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5sZXQgZ2FtZTogR2FtZVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZSA9IG5ldyBHYW1lKClcblxuICBjbG9jay50aWNrLmJpbmQoZ2FtZS51cGRhdGUuYmluZChnYW1lKSkoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgZ2FtZS5kcmF3KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7XG4gIGdhbWUua2V5UHJlc3NlZCgpXG59XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7XG4gIGdhbWUua2V5UmVsZWFzZWQoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW91c2VQcmVzc2VkKCkge1xuICBnYW1lLm1vdXNlUHJlc3NlZCgpXG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VSZWxlYXNlZCgpIHtcbiAgZ2FtZS5tb3VzZVJlbGVhc2VkKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1Jlc2l6ZWQoKSB7XG4gIHJlc2l6ZUNhbnZhcyh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KVxufVxuIiwgImV4cG9ydCBjb25zdCB0aWNrSW50ZXJ2YWwgPSAxMDBcblxuZXhwb3J0IGNvbnN0IGluZm86IFRpbWVJbmZvID0ge1xuICBsYXN0VGljazogRGF0ZS5ub3coKSAtIHRpY2tJbnRlcnZhbCxcbiAgZ2FtZUR1cmF0aW9uOiAwLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVJbmZvIHtcbiAgbGFzdFRpY2s6IG51bWJlclxuICBnYW1lRHVyYXRpb246IG51bWJlclxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGljayh0aGlzOiAoaW5mbzogVGltZUluZm8pID0+IHZvaWQpIHtcbiAgaWYgKGluZm8ubGFzdFRpY2sgPiBEYXRlLm5vdygpICsgdGlja0ludGVydmFsKSB7XG4gICAgaW5mby5nYW1lRHVyYXRpb24gKz0gdGlja0ludGVydmFsXG4gICAgaW5mby5sYXN0VGljayA9IERhdGUubm93KClcbiAgICB0aGlzKGluZm8pXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2suYmluZCh0aGlzKSlcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBib2FyZCA9IG5ldyBTZXQ8UG9zaXRpb25hYmxlPigpXG5leHBvcnQgY29uc3QgYm94U2l6ZTogVmVjdG9yID0gWzQ4LCA0OF1cbmV4cG9ydCBjb25zdCBib2FyZEJveGVzOiBWZWN0b3IgPSBbMTUsIDEwXVxuZXhwb3J0IGNvbnN0IGJvYXJkU2l6ZTogVmVjdG9yID0gW1xuICBib3hTaXplWzBdICogYm9hcmRCb3hlc1swXSxcbiAgYm94U2l6ZVsxXSAqIGJvYXJkQm94ZXNbMV0sXG5dXG5cbmV4cG9ydCBmdW5jdGlvbiBib2FyZFBvc2l0aW9uKCk6IFZlY3RvciB7XG4gIHJldHVybiBzdGlja3koW3dpZHRoIC8gMiAtIGJvYXJkU2l6ZVswXSAvIDIsIGhlaWdodCAvIDIgLSBib2FyZFNpemVbMV0gLyAyXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Qm9hcmQoKSB7XG4gIHJldHVybiBbLi4uYm9hcmRdXG59XG5cbmV4cG9ydCB0eXBlIFZlY3RvciA9IFt4OiBudW1iZXIsIHk6IG51bWJlcl1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gbXVsdChcbiAgICBmbG9vcihkaXYoc3ViKHYsIGRpdihib3hTaXplLCBbMywgM10pKSwgZGl2KGJveFNpemUsIFsyLCAyXSkpKSxcbiAgICBkaXYoYm94U2l6ZSwgWzIsIDJdKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gW21vdXNlWCwgbW91c2VZXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RpY2t5TW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIHN0aWNreShcbiAgICBtYXgoXG4gICAgICBtaW4obW91c2UoKSwgc3ViKGFkZChib2FyZFBvc2l0aW9uKCksIGJvYXJkU2l6ZSksIGRpdihib3hTaXplLCBbMywgM10pKSksXG4gICAgICBhZGQoYm9hcmRQb3NpdGlvbigpLCBkaXYoYm94U2l6ZSwgWzMsIDNdKSlcbiAgICApXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLm1pbih2MVswXSwgdjJbMF0pLCBNYXRoLm1pbih2MVsxXSwgdjJbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGgubWF4KHYxWzBdLCB2MlswXSksIE1hdGgubWF4KHYxWzFdLCB2MlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKyB2MlswXSwgdjFbMV0gKyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Yih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAtIHYyWzBdLCB2MVsxXSAtIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGl2KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC8gdjJbMF0sIHYxWzFdIC8gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdWx0KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdICogdjJbMF0sIHYxWzFdICogdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGguZmxvb3IodlswXSksIE1hdGguZmxvb3IodlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZChwb3NpdGlvbiwgWzAsIDBdKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHcmlkU2xhdmVBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maW5kKFxuICAgIChpdGVtKSA9PlxuICAgICAgaXRlbS5ncmlkU2xhdmUgJiZcbiAgICAgIHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbXNBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlW10ge1xuICByZXR1cm4gYXJyYXlCb2FyZCgpLmZpbHRlcihcbiAgICAoaXRlbSkgPT4gc3RpY2t5KGl0ZW0ucG9zaXRpb24pLnRvU3RyaW5nKCkgPT09IHN0aWNreShhdCkudG9TdHJpbmcoKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZShpdGVtOiBQb3NpdGlvbmFibGUpIHtcbiAgaWYgKGl0ZW0uZ3JpZFNsYXZlKVxuICAgIGFycmF5Qm9hcmQoKS5mb3JFYWNoKChib2FyZEl0ZW0pID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgYm9hcmRJdGVtLmdyaWRTbGF2ZSAmJlxuICAgICAgICBib2FyZEl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gaXRlbS5wb3NpdGlvbi50b1N0cmluZygpXG4gICAgICApIHtcbiAgICAgICAgYm9hcmQuZGVsZXRlKGJvYXJkSXRlbSlcbiAgICAgIH1cbiAgICB9KVxuXG4gIGJvYXJkLmFkZChpdGVtKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VG93ZXJTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24pID0+IHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDUwKVxuICBlbGxpcHNlKC4uLnBvc2l0aW9uLCAuLi5zcGFjZS5ib3hTaXplKVxufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVuZW15U3ByaXRlOiBTcHJpdGUgPSAoYW5nbGUsIHBvc2l0aW9uKSA9PiB7XG4gIG5vU3Ryb2tlKClcbiAgZmlsbChcInJlZFwiKVxuICBlbGxpcHNlKC4uLnBvc2l0aW9uLCAuLi5zcGFjZS5kaXYoc3BhY2UuYm94U2l6ZSwgWzIsIDJdKSlcbn1cblxuZXhwb3J0IHR5cGUgU3ByaXRlID0gKGFuZ2xlOiBudW1iZXIsIHBvc2l0aW9uOiBzcGFjZS5WZWN0b3IpID0+IHVua25vd25cbiIsICJpbXBvcnQgKiBhcyBlbmVteSBmcm9tIFwiLi9lbmVteVwiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5pbXBvcnQgKiBhcyBzcHJpdGUgZnJvbSBcIi4vc3ByaXRlXCJcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIlxuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVmZmVjdDogVG93ZXJFZmZlY3QgPSAoZ2FtZSwgd2VhcG9uLCBlbmVteSkgPT4ge1xuICBlbmVteS5saWZlIC09IHdlYXBvbi5kYW1hZ2UgKiBnYW1lLmRhbWFnZU11bHRpcGxpZXJcbn1cblxuZXhwb3J0IGNvbnN0IHRvd2VyczogQmFzZVRvd2VyW10gPSBbXG4gIFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlBlbGxldFwiLFxuICAgICAgY29zdDogNSxcbiAgICAgIHJhdGU6IDAuNSAvIDYwLCAvLyB1biB0aXIgdG91dGVzIGxlcyBkZXV4IHNlY29uZGVzXG4gICAgICBkYW1hZ2U6IDEwLFxuICAgICAgcmFuZ2U6IHNwYWNlLmJveFNpemVbMF0gKiAzLFxuICAgICAgc2VsbENvc3Q6IDEwLFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgXSxcbl1cblxuZXhwb3J0IHR5cGUgQmFzZVRvd2VyID0gVG93ZXJMZXZlbFtdXG5cbmV4cG9ydCBpbnRlcmZhY2UgVG93ZXJMZXZlbCB7XG4gIG5hbWU6IHN0cmluZ1xuICByYXRlOiBudW1iZXJcbiAgZGFtYWdlOiBudW1iZXJcbiAgY29zdDogbnVtYmVyXG4gIHNlbGxDb3N0OiBudW1iZXJcbiAgc3ByaXRlOiBzcHJpdGUuU3ByaXRlXG4gIHJhbmdlOiBudW1iZXJcbiAgY3JpdGljYWw6IG51bWJlclxuICBlZmZlY3Q6IFRvd2VyRWZmZWN0XG59XG5cbmV4cG9ydCBjbGFzcyBUb3dlciBpbXBsZW1lbnRzIHNwYWNlLlBvc2l0aW9uYWJsZSwgc3BhY2UuRGlzcGxheWFibGUge1xuICBwcml2YXRlIF9sZXZlbCA9IDBcblxuICB6SW5kZXggPSAxXG4gIGFuZ2xlID0gMFxuICBncmlkU2xhdmUgPSB0cnVlXG5cbiAgZ2V0IGxldmVsKCk6IFRvd2VyTGV2ZWwge1xuICAgIHJldHVybiB0aGlzLmJhc2VbdGhpcy5fbGV2ZWxdXG4gIH1cblxuICBnZXQgY2VudGVyKCk6IHNwYWNlLlZlY3RvciB7XG4gICAgcmV0dXJuIHNwYWNlLmFkZCh0aGlzLnBvc2l0aW9uLCBzcGFjZS5kaXYoc3BhY2UuYm94U2l6ZSwgWzIsIDJdKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBnYW1lOiBHYW1lLFxuICAgIHB1YmxpYyBwb3NpdGlvbjogc3BhY2UuVmVjdG9yLFxuICAgIHB1YmxpYyByZWFkb25seSBiYXNlOiBCYXNlVG93ZXJcbiAgKSB7fVxuXG4gIHVwZ3JhZGUoKSB7XG4gICAgY29uc3QgbmV4dExldmVsID0gdGhpcy5iYXNlW3RoaXMuX2xldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5nYW1lLm1vbmV5IC09IG5leHRMZXZlbC5jb3N0XG4gICAgdGhpcy5fbGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgLy8gc2hvdCBlbmVtaWVzXG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uLnRvU3RyaW5nKCkgPT09IHNwYWNlLnN0aWNreU1vdXNlKCkudG9TdHJpbmcoKSlcbiAgICAgIHRoaXMuZHJhd1JhbmdlKClcbiAgICB0aGlzLmxldmVsLnNwcml0ZSh0aGlzLmFuZ2xlLCB0aGlzLmNlbnRlcilcbiAgfVxuXG4gIGRyYXdSYW5nZSgpIHtcbiAgICBzdHJva2VXZWlnaHQoMilcbiAgICBzdHJva2UoMjU1LCAyMTUsIDAsIDUwKVxuICAgIGZpbGwoMjU1LCAyMTUsIDAsIDMwKVxuICAgIGNpcmNsZSguLi50aGlzLmNlbnRlciwgdGhpcy5sZXZlbC5yYW5nZSAqIDIpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVG93ZXIoaXRlbTogc3BhY2UuUG9zaXRpb25hYmxlKTogaXRlbSBpcyBUb3dlciB7XG4gIHJldHVybiBcImJhc2VcIiBpbiBpdGVtICYmIFwibGV2ZWxcIiBpbiBpdGVtXG59XG5cbmV4cG9ydCB0eXBlIFRvd2VyRWZmZWN0ID0gKFxuICBnYW1lOiBHYW1lLFxuICB0b3dlcjogVG93ZXJMZXZlbCxcbiAgZW5lbXk6IGVuZW15LkVuZW15XG4pID0+IHVua25vd25cbiIsICJpbXBvcnQgKiBhcyB0b3dlciBmcm9tIFwiLi9hcHAvdG93ZXJcIlxuaW1wb3J0ICogYXMgcG93ZXIgZnJvbSBcIi4vYXBwL3Bvd2VyXCJcbmltcG9ydCAqIGFzIGJvbnVzIGZyb20gXCIuL2FwcC9ib251c1wiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9hcHAvc3BhY2VcIlxuaW1wb3J0ICogYXMgY2xvY2sgZnJvbSBcIi4vYXBwL2Nsb2NrXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGxpZmUgPSAyMFxuICBtb25leSA9IDEwMFxuICBzY29yZSA9IDBcbiAgdGltZSA9IDBcbiAgYm9udXNlcyA9IFtdXG5cbiAgcHJlc3NlZEF0Pzogc3BhY2UuVmVjdG9yXG5cbiAgcHJpdmF0ZSBsYXN0VGltZUdpdmVuID0gRGF0ZS5ub3coKVxuXG4gIGdldCBkYW1hZ2VNdWx0aXBsaWVyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHNwYWNlLmJvYXJkLmNsZWFyKClcbiAgfVxuXG4gIHVwZGF0ZShpbmZvOiBjbG9jay5UaW1lSW5mbykge31cblxuICBkcmF3KCkge1xuICAgIGJhY2tncm91bmQoMClcblxuICAgIGRyYXdCb2FyZCgpXG4gICAgZHJhd1NlbGVjdGlvblJlY3QoKVxuICAgIGRyYXdQb3NpdGlvbmFibGVJdGVtcygpXG4gIH1cblxuICBrZXlQcmVzc2VkKCkge31cblxuICBrZXlSZWxlYXNlZCgpIHt9XG5cbiAgbW91c2VQcmVzc2VkKCkge1xuICAgIHRoaXMucHJlc3NlZEF0ID0gc3BhY2Uuc3RpY2t5TW91c2UoKVxuICB9XG5cbiAgbW91c2VSZWxlYXNlZCgpIHtcbiAgICBjb25zdCByZWxlYXNlZEF0ID0gc3BhY2Uuc3RpY2t5TW91c2UoKVxuXG4gICAgaWYgKHRoaXMucHJlc3NlZEF0Py50b1N0cmluZygpID09PSByZWxlYXNlZEF0LnRvU3RyaW5nKCkpIHtcbiAgICAgIHNwYWNlLnBsYWNlKG5ldyB0b3dlci5Ub3dlcih0aGlzLCBzcGFjZS5zdGlja3lNb3VzZSgpLCB0b3dlci50b3dlcnNbMF0pKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDQwKVxuICByZWN0KC4uLnNwYWNlLnN0aWNreU1vdXNlKCksIC4uLnNwYWNlLmJveFNpemUpXG59XG5cbmZ1bmN0aW9uIGRyYXdCb2FyZCgpIHtcbiAgc3Ryb2tlKDUwKVxuICBzdHJva2VXZWlnaHQoMilcbiAgZmlsbCgyMClcbiAgcmVjdCguLi5zcGFjZS5ib2FyZFBvc2l0aW9uKCksIC4uLnNwYWNlLmJvYXJkU2l6ZSlcbn1cblxuZnVuY3Rpb24gZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKCkge1xuICBzcGFjZVxuICAgIC5hcnJheUJvYXJkKClcbiAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxuICAgICAgc3BhY2UuaXNEaXNwbGF5YWJsZShpdGVtKVxuICAgIClcbiAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5kcmF3KCkpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNBTyxNQUFNLGVBQWU7QUFFckIsTUFBTSxPQUFpQjtBQUFBLElBQzVCLFVBQVUsS0FBSyxRQUFRO0FBQUEsSUFDdkIsY0FBYztBQUFBO0FBUVQsa0JBQThDO0FBQ25ELFFBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQzdDLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssV0FBVyxLQUFLO0FBQ3JCLFdBQUs7QUFDTCw0QkFBc0IsS0FBSyxLQUFLO0FBQUE7QUFBQTs7O0FDakI3QixNQUFNLFFBQVEsSUFBSTtBQUNsQixNQUFNLFVBQWtCLENBQUMsSUFBSTtBQUM3QixNQUFNLGFBQXFCLENBQUMsSUFBSTtBQUNoQyxNQUFNLFlBQW9CO0FBQUEsSUFDL0IsUUFBUSxLQUFLLFdBQVc7QUFBQSxJQUN4QixRQUFRLEtBQUssV0FBVztBQUFBO0FBR25CLDJCQUFpQztBQUN0QyxXQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksVUFBVSxLQUFLLEdBQUcsU0FBUyxJQUFJLFVBQVUsS0FBSztBQUFBO0FBR3BFLHdCQUFzQjtBQUMzQixXQUFPLENBQUMsR0FBRztBQUFBO0FBS04sa0JBQWdCLEdBQW1CO0FBQ3hDLFdBQU8sS0FDTCxNQUFNLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQyxHQUFHLE9BQ3pELElBQUksU0FBUyxDQUFDLEdBQUc7QUFBQTtBQUlkLG1CQUF5QjtBQUM5QixXQUFPLENBQUMsUUFBUTtBQUFBO0FBR1gseUJBQStCO0FB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
