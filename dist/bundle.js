var app = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw2,
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
  function clone(v) {
    return add(v, [0, 0]);
  }
  function center(v) {
    return add(v, div(boxSize, [2, 2]));
  }
  function surface(v) {
    const shift = div(boxSize, [3, 3]);
    return [
      sticky(clone(v)),
      sticky(add(v, shift)),
      sticky(sub(v, shift)),
      sticky([v[0], v[1] - shift[1]]),
      sticky([v[0], v[1] + shift[1]]),
      sticky([v[0] - shift[0], v[1]]),
      sticky([v[0] + shift[0], v[1]]),
      sticky([v[0] - shift[0], v[1] + shift[0]]),
      sticky([v[0] + shift[0], v[1] - shift[0]])
    ];
  }
  function isSuperimposed(s1, s2) {
    return s1.some((v1) => s2.some((v2) => v1.toString() === v2.toString()));
  }
  function isDisplayable(item) {
    return "zIndex" in item && "draw" in item;
  }

  // src/app/sprite.ts
  var defaultTowerSprite = (angle, position, focus) => {
    if (focus) {
      stroke(200);
      strokeWeight(2);
    } else
      noStroke();
    fill(50);
    rect(...position, ...boxSize, 5);
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
      this.level.sprite(this.angle, this.position);
    }
    drawRange() {
      strokeWeight(2);
      stroke(255, 215, 0, 50);
      fill(255, 215, 0, 30);
      circle(...center(this.position), this.level.range * 2);
    }
  };

  // src/app/shop.ts
  var shopWidth = 100;
  function getSelection() {
    var _a;
    if (mouseX < width - shopWidth)
      return void 0;
    return (_a = towers[Math.floor(mouseY / shopWidth)]) != null ? _a : void 0;
  }
  function draw(selected) {
    drawTowers(selected);
    drawPowers();
    drawBonuses();
  }
  function drawTowers(selected) {
    noStroke();
    fill(20);
    rect(width - shopWidth, 0, shopWidth, shopWidth * towers.length, shopWidth / 4);
    towers.forEach((base, i) => {
      base[0].sprite(0, [
        width - shopWidth / 2 - boxSize[0] / 2,
        shopWidth / 2 - boxSize[1] / 2 + i * shopWidth
      ], selected === base);
    });
  }
  function drawBonuses() {
  }
  function drawPowers() {
  }

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
      draw(this.selectedTower);
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
      const selection = getSelection();
      if (selection) {
        this.selectedTower = selection;
      } else {
        const releasedAt = stickyMouse();
        if (((_a = this.pressedAt) == null ? void 0 : _a.toString()) === releasedAt.toString() && this.selectedTower) {
          if (!arrayBoard().some((item) => isSuperimposed(surface(releasedAt), surface(item.position)))) {
            board.add(new Tower(this, stickyMouse(), this.selectedTower));
          }
        }
      }
    }
  };
  var game_default = Game;
  function drawBoard() {
    stroke(50);
    strokeWeight(2);
    fill(20);
    rect(...boardPosition(), ...boardSize);
  }
  function drawSelectionRect() {
    noStroke();
    fill(40);
    rect(...stickyMouse(), ...boxSize);
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
  function draw2() {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvYXBwL3Nwcml0ZS50cyIsICJzcmMvYXBwL3Rvd2VyLnRzIiwgInNyYy9hcHAvc2hvcC50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge1xuICBnYW1lLmtleVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge1xuICBnYW1lLmtleVJlbGVhc2VkKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZ2FtZS5tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGdhbWUubW91c2VSZWxlYXNlZCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICByZXNpemVDYW52YXMod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodClcbn1cbiIsICJleHBvcnQgY29uc3QgdGlja0ludGVydmFsID0gMTAwXG5cbmV4cG9ydCBjb25zdCBpbmZvOiBUaW1lSW5mbyA9IHtcbiAgbGFzdFRpY2s6IERhdGUubm93KCkgLSB0aWNrSW50ZXJ2YWwsXG4gIGdhbWVEdXJhdGlvbjogMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lSW5mbyB7XG4gIGxhc3RUaWNrOiBudW1iZXJcbiAgZ2FtZUR1cmF0aW9uOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2sodGhpczogKGluZm86IFRpbWVJbmZvKSA9PiB2b2lkKSB7XG4gIGlmIChpbmZvLmxhc3RUaWNrID4gRGF0ZS5ub3coKSArIHRpY2tJbnRlcnZhbCkge1xuICAgIGluZm8uZ2FtZUR1cmF0aW9uICs9IHRpY2tJbnRlcnZhbFxuICAgIGluZm8ubGFzdFRpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcyhpbmZvKVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgYm9hcmQgPSBuZXcgU2V0PFBvc2l0aW9uYWJsZT4oKVxuZXhwb3J0IGNvbnN0IGJveFNpemU6IFZlY3RvciA9IFs0OCwgNDhdXG5leHBvcnQgY29uc3QgYm9hcmRCb3hlczogVmVjdG9yID0gWzE1LCAxMF1cbmV4cG9ydCBjb25zdCBib2FyZFNpemU6IFZlY3RvciA9IFtcbiAgYm94U2l6ZVswXSAqIGJvYXJkQm94ZXNbMF0sXG4gIGJveFNpemVbMV0gKiBib2FyZEJveGVzWzFdLFxuXVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRQb3NpdGlvbigpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KFt3aWR0aCAvIDIgLSBib2FyZFNpemVbMF0gLyAyLCBoZWlnaHQgLyAyIC0gYm9hcmRTaXplWzFdIC8gMl0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJvYXJkKCkge1xuICByZXR1cm4gWy4uLmJvYXJkXVxufVxuXG5leHBvcnQgdHlwZSBWZWN0b3IgPSBbeDogbnVtYmVyLCB5OiBudW1iZXJdXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGlja3kodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIG11bHQoXG4gICAgZmxvb3IoZGl2KHN1Yih2LCBkaXYoYm94U2l6ZSwgWzMsIDNdKSksIGRpdihib3hTaXplLCBbMiwgMl0pKSksXG4gICAgZGl2KGJveFNpemUsIFsyLCAyXSlcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIFttb3VzZVgsIG1vdXNlWV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreU1vdXNlKCk6IFZlY3RvciB7XG4gIHJldHVybiBzdGlja3koXG4gICAgbWF4KFxuICAgICAgbWluKG1vdXNlKCksIHN1YihhZGQoYm9hcmRQb3NpdGlvbigpLCBib2FyZFNpemUpLCBkaXYoYm94U2l6ZSwgWzMsIDNdKSkpLFxuICAgICAgYWRkKGJvYXJkUG9zaXRpb24oKSwgZGl2KGJveFNpemUsIFszLCAzXSkpXG4gICAgKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW4odjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5taW4odjFbMF0sIHYyWzBdKSwgTWF0aC5taW4odjFbMV0sIHYyWzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1heCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLm1heCh2MVswXSwgdjJbMF0pLCBNYXRoLm1heCh2MVsxXSwgdjJbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdICsgdjJbMF0sIHYxWzFdICsgdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWIodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gLSB2MlswXSwgdjFbMV0gLSB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpdih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAvIHYyWzBdLCB2MVsxXSAvIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbXVsdCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAqIHYyWzBdLCB2MVsxXSAqIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxvb3IodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLmZsb29yKHZbMF0pLCBNYXRoLmZsb29yKHZbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZCh2LCBbMCwgMF0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXIodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZCh2LCBkaXYoYm94U2l6ZSwgWzIsIDJdKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1cmZhY2UodjogVmVjdG9yKTogU3VyZmFjZSB7XG4gIGNvbnN0IHNoaWZ0ID0gZGl2KGJveFNpemUsIFszLCAzXSlcbiAgcmV0dXJuIFtcbiAgICBzdGlja3koY2xvbmUodikpLCAvLyBtaWRkbGVcbiAgICBzdGlja3koYWRkKHYsIHNoaWZ0KSksIC8vIGJvdHRvbSByaWdodFxuICAgIHN0aWNreShzdWIodiwgc2hpZnQpKSwgLy8gdG9wIGxlZnRcbiAgICBzdGlja3koW3ZbMF0sIHZbMV0gLSBzaGlmdFsxXV0pLCAvLyB0b3BcbiAgICBzdGlja3koW3ZbMF0sIHZbMV0gKyBzaGlmdFsxXV0pLCAvLyBib3R0b21cbiAgICBzdGlja3koW3ZbMF0gLSBzaGlmdFswXSwgdlsxXV0pLCAvLyBsZWZ0XG4gICAgc3RpY2t5KFt2WzBdICsgc2hpZnRbMF0sIHZbMV1dKSwgLy8gcmlnaHRcbiAgICBzdGlja3koW3ZbMF0gLSBzaGlmdFswXSwgdlsxXSArIHNoaWZ0WzBdXSksIC8vIGJvdHRvbSBsZWZ0XG4gICAgc3RpY2t5KFt2WzBdICsgc2hpZnRbMF0sIHZbMV0gLSBzaGlmdFswXV0pLCAvLyB0b3AgcmlnaHRcbiAgXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdXBlcmltcG9zZWQoczE6IFN1cmZhY2UsIHMyOiBTdXJmYWNlKTogYm9vbGVhbiB7XG4gIHJldHVybiBzMS5zb21lKCh2MSkgPT4gczIuc29tZSgodjIpID0+IHYxLnRvU3RyaW5nKCkgPT09IHYyLnRvU3RyaW5nKCkpKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbi8vIHByZXR0aWVyLWlnbm9yZVxuZXhwb3J0IHR5cGUgU3VyZmFjZSA9IFtcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvcixcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvcixcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvclxuXVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JpZFNsYXZlQXQoYXQ6IFZlY3Rvcik6IFBvc2l0aW9uYWJsZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmluZChcbiAgICAoaXRlbSkgPT5cbiAgICAgIGl0ZW0uZ3JpZFNsYXZlICYmXG4gICAgICBzdGlja3koaXRlbS5wb3NpdGlvbikudG9TdHJpbmcoKSA9PT0gc3RpY2t5KGF0KS50b1N0cmluZygpXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEl0ZW1zQXQoYXQ6IFZlY3Rvcik6IFBvc2l0aW9uYWJsZVtdIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maWx0ZXIoXG4gICAgKGl0ZW0pID0+IHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VG93ZXJTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoNTApXG4gIHJlY3QoLi4ucG9zaXRpb24sIC4uLnNwYWNlLmJveFNpemUsIDUpXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RW5lbXlTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoXCJyZWRcIilcbiAgZWxsaXBzZSguLi5wb3NpdGlvbiwgLi4uc3BhY2UuZGl2KHNwYWNlLmJveFNpemUsIFsyLCAyXSkpXG59XG5cbmV4cG9ydCB0eXBlIFNwcml0ZSA9IChcbiAgYW5nbGU6IG51bWJlcixcbiAgcG9zaXRpb246IHNwYWNlLlZlY3RvcixcbiAgZm9jdXM/OiBib29sZWFuXG4pID0+IHVua25vd25cbiIsICJpbXBvcnQgKiBhcyBlbmVteSBmcm9tIFwiLi9lbmVteVwiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5pbXBvcnQgKiBhcyBzcHJpdGUgZnJvbSBcIi4vc3ByaXRlXCJcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIlxuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVmZmVjdDogVG93ZXJFZmZlY3QgPSAoZ2FtZSwgd2VhcG9uLCBlbmVteSkgPT4ge1xuICBlbmVteS5saWZlIC09IHdlYXBvbi5kYW1hZ2UgKiBnYW1lLmRhbWFnZU11bHRpcGxpZXJcbn1cblxuZXhwb3J0IGNvbnN0IHRvd2VyczogQmFzZVRvd2VyW10gPSBbXG4gIFtcbiAgICB7XG4gICAgICBuYW1lOiBcIlBlbGxldFwiLFxuICAgICAgY29zdDogNSxcbiAgICAgIHJhdGU6IDAuNSAvIDYwLCAvLyB1biB0aXIgdG91dGVzIGxlcyBkZXV4IHNlY29uZGVzXG4gICAgICBkYW1hZ2U6IDEwLFxuICAgICAgcmFuZ2U6IHNwYWNlLmJveFNpemVbMF0gKiAzLFxuICAgICAgc2VsbENvc3Q6IDEwLFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgXSxcbl1cblxuZXhwb3J0IHR5cGUgQmFzZVRvd2VyID0gVG93ZXJMZXZlbFtdXG5cbmV4cG9ydCBpbnRlcmZhY2UgVG93ZXJMZXZlbCB7XG4gIG5hbWU6IHN0cmluZ1xuICByYXRlOiBudW1iZXJcbiAgZGFtYWdlOiBudW1iZXJcbiAgY29zdDogbnVtYmVyXG4gIHNlbGxDb3N0OiBudW1iZXJcbiAgc3ByaXRlOiBzcHJpdGUuU3ByaXRlXG4gIHJhbmdlOiBudW1iZXJcbiAgY3JpdGljYWw6IG51bWJlclxuICBlZmZlY3Q6IFRvd2VyRWZmZWN0XG59XG5cbmV4cG9ydCBjbGFzcyBUb3dlciBpbXBsZW1lbnRzIHNwYWNlLlBvc2l0aW9uYWJsZSwgc3BhY2UuRGlzcGxheWFibGUge1xuICBwcml2YXRlIF9sZXZlbCA9IDBcblxuICB6SW5kZXggPSAxXG4gIGFuZ2xlID0gMFxuICBncmlkU2xhdmUgPSB0cnVlXG5cbiAgZ2V0IGxldmVsKCk6IFRvd2VyTGV2ZWwge1xuICAgIHJldHVybiB0aGlzLmJhc2VbdGhpcy5fbGV2ZWxdXG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZ2FtZTogR2FtZSxcbiAgICBwdWJsaWMgcG9zaXRpb246IHNwYWNlLlZlY3RvcixcbiAgICBwdWJsaWMgcmVhZG9ubHkgYmFzZTogQmFzZVRvd2VyXG4gICkge31cblxuICB1cGdyYWRlKCkge1xuICAgIGNvbnN0IG5leHRMZXZlbCA9IHRoaXMuYmFzZVt0aGlzLl9sZXZlbCArIDFdXG4gICAgaWYgKCFuZXh0TGV2ZWwpIHJldHVybiBmYWxzZVxuICAgIHRoaXMuZ2FtZS5tb25leSAtPSBuZXh0TGV2ZWwuY29zdFxuICAgIHRoaXMuX2xldmVsKytcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIC8vIHNob3QgZW5lbWllc1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICBpZiAodGhpcy5wb3NpdGlvbi50b1N0cmluZygpID09PSBzcGFjZS5zdGlja3lNb3VzZSgpLnRvU3RyaW5nKCkpXG4gICAgICB0aGlzLmRyYXdSYW5nZSgpXG4gICAgdGhpcy5sZXZlbC5zcHJpdGUodGhpcy5hbmdsZSwgdGhpcy5wb3NpdGlvbilcbiAgfVxuXG4gIGRyYXdSYW5nZSgpIHtcbiAgICBzdHJva2VXZWlnaHQoMilcbiAgICBzdHJva2UoMjU1LCAyMTUsIDAsIDUwKVxuICAgIGZpbGwoMjU1LCAyMTUsIDAsIDMwKVxuICAgIGNpcmNsZSguLi5zcGFjZS5jZW50ZXIodGhpcy5wb3NpdGlvbiksIHRoaXMubGV2ZWwucmFuZ2UgKiAyKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rvd2VyKGl0ZW06IHNwYWNlLlBvc2l0aW9uYWJsZSk6IGl0ZW0gaXMgVG93ZXIge1xuICByZXR1cm4gXCJiYXNlXCIgaW4gaXRlbSAmJiBcImxldmVsXCIgaW4gaXRlbVxufVxuXG5leHBvcnQgdHlwZSBUb3dlckVmZmVjdCA9IChcbiAgZ2FtZTogR2FtZSxcbiAgdG93ZXI6IFRvd2VyTGV2ZWwsXG4gIGVuZW15OiBlbmVteS5FbmVteVxuKSA9PiB1bmtub3duXG4iLCAiaW1wb3J0ICogYXMgdG93ZXIgZnJvbSBcIi4vdG93ZXJcIlxuaW1wb3J0ICogYXMgc3BhY2UgZnJvbSBcIi4vc3BhY2VcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYm9udXNcIlxuaW1wb3J0ICogYXMgcG93ZXIgZnJvbSBcIi4vcG93ZXJcIlxuXG5leHBvcnQgY29uc3Qgc2hvcFdpZHRoID0gMTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3Rpb24oKTogdG93ZXIuQmFzZVRvd2VyIHwgdW5kZWZpbmVkIHtcbiAgLy8gfCBib251cy5Cb251cyB8IHBvd2VyLlBvd2VyXG4gIGlmIChtb3VzZVggPCB3aWR0aCAtIHNob3BXaWR0aCkgcmV0dXJuIHVuZGVmaW5lZFxuICByZXR1cm4gdG93ZXIudG93ZXJzW01hdGguZmxvb3IobW91c2VZIC8gc2hvcFdpZHRoKV0gPz8gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KHNlbGVjdGVkPzogdG93ZXIuQmFzZVRvd2VyKSB7XG4gIGRyYXdUb3dlcnMoc2VsZWN0ZWQpXG4gIGRyYXdQb3dlcnMoKVxuICBkcmF3Qm9udXNlcygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3VG93ZXJzKHNlbGVjdGVkPzogdG93ZXIuQmFzZVRvd2VyKSB7XG4gIG5vU3Ryb2tlKClcbiAgZmlsbCgyMClcbiAgcmVjdChcbiAgICB3aWR0aCAtIHNob3BXaWR0aCxcbiAgICAwLFxuICAgIHNob3BXaWR0aCxcbiAgICBzaG9wV2lkdGggKiB0b3dlci50b3dlcnMubGVuZ3RoLFxuICAgIHNob3BXaWR0aCAvIDRcbiAgKVxuXG4gIHRvd2VyLnRvd2Vycy5mb3JFYWNoKChiYXNlLCBpKSA9PiB7XG4gICAgYmFzZVswXS5zcHJpdGUoXG4gICAgICAwLFxuICAgICAgW1xuICAgICAgICB3aWR0aCAtIHNob3BXaWR0aCAvIDIgLSBzcGFjZS5ib3hTaXplWzBdIC8gMixcbiAgICAgICAgc2hvcFdpZHRoIC8gMiAtIHNwYWNlLmJveFNpemVbMV0gLyAyICsgaSAqIHNob3BXaWR0aCxcbiAgICAgIF0sXG4gICAgICBzZWxlY3RlZCA9PT0gYmFzZVxuICAgIClcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdCb251c2VzKCkge31cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdQb3dlcnMoKSB7fVxuIiwgImltcG9ydCAqIGFzIHRvd2VyIGZyb20gXCIuL2FwcC90b3dlclwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuaW1wb3J0ICogYXMgc2hvcCBmcm9tIFwiLi9hcHAvc2hvcFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuICBsaWZlID0gMjBcbiAgbW9uZXkgPSAxMDBcbiAgc2NvcmUgPSAwXG4gIHRpbWUgPSAwXG4gIGJvbnVzZXMgPSBbXVxuXG4gIHNlbGVjdGVkVG93ZXI/OiB0b3dlci5CYXNlVG93ZXJcbiAgcHJlc3NlZEF0Pzogc3BhY2UuVmVjdG9yXG5cbiAgcHJpdmF0ZSBsYXN0VGltZUdpdmVuID0gRGF0ZS5ub3coKVxuXG4gIGdldCBkYW1hZ2VNdWx0aXBsaWVyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHNwYWNlLmJvYXJkLmNsZWFyKClcbiAgfVxuXG4gIHVwZGF0ZShpbmZvOiBjbG9jay5UaW1lSW5mbykge31cblxuICBkcmF3KCkge1xuICAgIGJhY2tncm91bmQoMClcblxuICAgIGRyYXdCb2FyZCgpXG4gICAgZHJhd1NlbGVjdGlvblJlY3QoKVxuICAgIGRyYXdQb3NpdGlvbmFibGVJdGVtcygpXG5cbiAgICBzaG9wLmRyYXcodGhpcy5zZWxlY3RlZFRvd2VyKVxuICB9XG5cbiAga2V5UHJlc3NlZCgpIHt9XG5cbiAga2V5UmVsZWFzZWQoKSB7fVxuXG4gIG1vdXNlUHJlc3NlZCgpIHtcbiAgICB0aGlzLnByZXNzZWRBdCA9IHNwYWNlLnN0aWNreU1vdXNlKClcbiAgfVxuXG4gIG1vdXNlUmVsZWFzZWQoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gc2hvcC5nZXRTZWxlY3Rpb24oKVxuXG4gICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3RlZFRvd2VyID0gc2VsZWN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGVhc2VkQXQgPSBzcGFjZS5zdGlja3lNb3VzZSgpXG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5wcmVzc2VkQXQ/LnRvU3RyaW5nKCkgPT09IHJlbGVhc2VkQXQudG9TdHJpbmcoKSAmJlxuICAgICAgICB0aGlzLnNlbGVjdGVkVG93ZXJcbiAgICAgICkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIXNwYWNlXG4gICAgICAgICAgICAuYXJyYXlCb2FyZCgpXG4gICAgICAgICAgICAuc29tZSgoaXRlbSkgPT5cbiAgICAgICAgICAgICAgc3BhY2UuaXNTdXBlcmltcG9zZWQoXG4gICAgICAgICAgICAgICAgc3BhY2Uuc3VyZmFjZShyZWxlYXNlZEF0KSxcbiAgICAgICAgICAgICAgICBzcGFjZS5zdXJmYWNlKGl0ZW0ucG9zaXRpb24pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgc3BhY2UuYm9hcmQuYWRkKFxuICAgICAgICAgICAgbmV3IHRvd2VyLlRvd2VyKHRoaXMsIHNwYWNlLnN0aWNreU1vdXNlKCksIHRoaXMuc2VsZWN0ZWRUb3dlcilcbiAgICAgICAgICApXG4gICAgICAgICAgLy9kZWxldGUgdGhpcy5zZWxlY3RlZFRvd2VyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICBzdHJva2UoNTApXG4gIHN0cm9rZVdlaWdodCgyKVxuICBmaWxsKDIwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkUG9zaXRpb24oKSwgLi4uc3BhY2UuYm9hcmRTaXplKVxufVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDQwKVxuICByZWN0KC4uLnNwYWNlLnN0aWNreU1vdXNlKCksIC4uLnNwYWNlLmJveFNpemUpXG59XG5cbmZ1bmN0aW9uIGRyYXdQb3NpdGlvbmFibGVJdGVtcygpIHtcbiAgc3BhY2VcbiAgICAuYXJyYXlCb2FyZCgpXG4gICAgLmZpbHRlcigoaXRlbSk6IGl0ZW0gaXMgc3BhY2UuUG9zaXRpb25hYmxlICYgc3BhY2UuRGlzcGxheWFibGUgPT5cbiAgICAgIHNwYWNlLmlzRGlzcGxheWFibGUoaXRlbSlcbiAgICApXG4gICAgLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpXG4gICAgLmZvckVhY2goKGl0ZW0pID0+IGl0ZW0uZHJhdygpKVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDQU8sTUFBTSxlQUFlO0FBRXJCLE1BQU0sT0FBaUI7QUFBQSxJQUM1QixVQUFVLEtBQUssUUFBUTtBQUFBLElBQ3ZCLGNBQWM7QUFBQTtBQVFULGtCQUE4QztBQUNuRCxRQUFJLEtBQUssV0FBVyxL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QUFDQTtBQUNBO0FBRUEsTUFBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLElBR2pCLGFBQWE7QUFBQTtBQUFBLElBRWIsY0FBYztBQUFBO0FBQUEsSUFFZCxlQUFlO0FBQ2IsV0FBSyxZQUFZLEFBQU07QUFBQTtBQUFBLElBR3pCLGdCQUFnQjtBQS9DbEI7QUFnREksWUFBTSxZQUFZLEFBQUs7QUFFdkIsVUFBSSxXQUFXO0FBQ2IsYUFBSyxnQkFBZ0I7QUFBQSxhQUNoQjtBQUNMLGNBQU0sYUFBYSxBQUFNO0FBRXpCLFlBQ0UsWUFBSyxjQUFMLG1CQUFnQixnQkFBZSxXQUFXLGNBQzFDLEtBQUssZUFDTDtBQUNBLGNBQ0UsQ0FBQyxBQUNFLGFBQ0EsS0FBSyxDQUFDLFNBQ0wsQUFBTSxlQUNKLEFBQU0sUUFBUSxhQUNkLEFBQU0sUUFBUSxLQUFLLGFBR3pCO0FBQ0EsWUFBTSxNQUFNLElBQ1YsSUFBVSxNQUFNLE1BQU0sQUFBTSxlQUFlLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBL0Q1RCxNQUFPLGVBQVA7QUF3RUEsdUJBQXFCO0FBQ25CLFdBQU87QUFDUCxpQkFBYTtBQUNiLFNBQUs7QUFDTCxTQUFLLEdBQUcsQUFBTSxpQkFBaUIsR0FBUztBQUFBO0FBRzFDLCtCQUE2QjtBQUMzQjtBQUNBLFNBQUs7QUFDTCxTQUFLLEdBQUcsQUFBTSxlQUFlLEdBQVM7QUFBQTtBQUd4QyxtQ0FBaUM7QUFDL0IsSUFDRyxhQUNBLE9BQU8sQ0FBQyxTQUNQLEFBQU0sY0FBYyxPQUVyQixLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQzVCLFFBQVEsQ0FBQyxTQUFTLEtBQUs7QUFBQTs7O0FONUY1QixXQUFTLGlCQUFpQixlQUFlLENBQUMsVUFBVSxNQUFNO0FBRTFELE1BQUk7QUFFRyxtQkFBaUI7QUFDdEIsaUJBQ0UsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGFBQWEsT0FBTyxjQUFjLElBQ3BFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixjQUFjLE9BQU8sZUFBZTtBQUd4RSxXQUFPLElBQUk7QUFFWCxJQUFNLEtBQUssS0FBSyxLQUFLLE9BQU8sS0FBSztBQUFBO0FBRzVCLG1CQUFnQjtBQUNyQixTQUFLO0FBQUE7QUFHQSx3QkFBc0I7QUFDM0IsU0FBSztBQUFBO0FBRUEseUJBQXVCO0FBQzVCLFNBQUs7QUFBQTtBQUdBLDBCQUF3QjtBQUM3QixTQUFLO0FBQUE7QUFFQSwyQkFBeUI7QUFDOUIsU0FBSztBQUFBO0FBR0EsMkJBQXlCO0FBQzlCLGlCQUFhLGFBQWE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
