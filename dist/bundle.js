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
  function boardStickyMouse() {
    return sticky(innerBoard(mouse()));
  }
  function innerBoard(v) {
    return max(min(v, sub(add(boardPosition(), boardSize), div(boxSize, [3, 3]))), add(boardPosition(), div(boxSize, [3, 3])));
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
  var towerRates = {
    slow: 0.5 / 60
  };
  var towerRanges = {
    60: boxSize[0] * 3,
    180: boxSize[0] * 7
  };
  var towers = [
    [
      {
        name: "Pellet",
        cost: 5,
        rate: towerRates.slow,
        damage: 10,
        range: towerRanges["60"],
        sellCost: 3,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      },
      {
        name: "Pellet",
        cost: 10,
        rate: towerRates.slow,
        damage: 20,
        range: towerRanges["60"],
        sellCost: 7,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      },
      {
        name: "Pellet",
        cost: 20,
        rate: towerRates.slow,
        damage: 40,
        range: towerRanges["60"],
        sellCost: 15,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      },
      {
        name: "Pellet",
        cost: 40,
        rate: towerRates.slow,
        damage: 80,
        range: towerRanges["60"],
        sellCost: 30,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      },
      {
        name: "Pellet",
        cost: 80,
        rate: towerRates.slow,
        damage: 160,
        range: towerRanges["60"],
        sellCost: 60,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      },
      {
        name: "Sniper",
        cost: 120,
        rate: towerRates.slow,
        damage: 400,
        range: towerRanges["180"],
        sellCost: 30,
        sprite: defaultTowerSprite,
        critical: 0.1,
        effect: defaultEffect
      }
    ],
    [
      {
        name: "Squirt",
        cost: 15,
        rate: 2 / 60,
        damage: 5,
        range: boxSize[0] * 3,
        sellCost: 10,
        sprite: defaultTowerSprite,
        critical: 0.05,
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
      if (this.position.toString() === boardStickyMouse().toString())
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

  // src/Game.ts
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
      this.pressedAt = boardStickyMouse();
    }
    mouseReleased() {
      var _a;
      const selection = getSelection();
      if (selection) {
        this.selectedTower = selection;
      } else {
        const releasedAt = boardStickyMouse();
        if (((_a = this.pressedAt) == null ? void 0 : _a.toString()) === releasedAt.toString() && this.selectedTower) {
          if (!arrayBoard().some((item) => isSuperimposed(surface(releasedAt), surface(item.position)))) {
            board.add(new Tower(this, boardStickyMouse(), this.selectedTower));
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
    rect(...boardStickyMouse(), ...boxSize);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvYXBwL3Nwcml0ZS50cyIsICJzcmMvYXBwL3Rvd2VyLnRzIiwgInNyYy9hcHAvc2hvcC50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge1xuICBnYW1lLmtleVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge1xuICBnYW1lLmtleVJlbGVhc2VkKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZ2FtZS5tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGdhbWUubW91c2VSZWxlYXNlZCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICByZXNpemVDYW52YXMod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodClcbn1cbiIsICJleHBvcnQgY29uc3QgdGlja0ludGVydmFsID0gMTAwXG5cbmV4cG9ydCBjb25zdCBpbmZvOiBUaW1lSW5mbyA9IHtcbiAgbGFzdFRpY2s6IERhdGUubm93KCkgLSB0aWNrSW50ZXJ2YWwsXG4gIGdhbWVEdXJhdGlvbjogMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lSW5mbyB7XG4gIGxhc3RUaWNrOiBudW1iZXJcbiAgZ2FtZUR1cmF0aW9uOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2sodGhpczogKGluZm86IFRpbWVJbmZvKSA9PiB2b2lkKSB7XG4gIGlmIChpbmZvLmxhc3RUaWNrID4gRGF0ZS5ub3coKSArIHRpY2tJbnRlcnZhbCkge1xuICAgIGluZm8uZ2FtZUR1cmF0aW9uICs9IHRpY2tJbnRlcnZhbFxuICAgIGluZm8ubGFzdFRpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcyhpbmZvKVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgYm9hcmQgPSBuZXcgU2V0PFBvc2l0aW9uYWJsZT4oKVxyXG5leHBvcnQgY29uc3QgYm94U2l6ZTogVmVjdG9yID0gWzQ4LCA0OF1cclxuZXhwb3J0IGNvbnN0IGJvYXJkQm94ZXM6IFZlY3RvciA9IFsxNSwgMTBdXHJcbmV4cG9ydCBjb25zdCBib2FyZFNpemU6IFZlY3RvciA9IFtcclxuICBib3hTaXplWzBdICogYm9hcmRCb3hlc1swXSxcclxuICBib3hTaXplWzFdICogYm9hcmRCb3hlc1sxXSxcclxuXVxyXG5cclxuZXhwb3J0IHR5cGUgWm9uZSA9IFtcclxuICAuLi5zdGFydDogVmVjdG9yLFxyXG4gIC4uLmVuZDogVmVjdG9yXHJcbl1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVab25lKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IsIHYyQXNTaXplID0gZmFsc2UpOiBab25lIHtcclxuICByZXR1cm4gWy4uLnYxLCAuLi4odjJBc1NpemUgPyBhZGQodjEsIHYyKSA6IHYyKSBdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzcGF3blpvbmUoKTogWm9uZSB7XHJcbiAgcmV0dXJuIHpvbmVUb1NjcmVlbihjcmVhdGVab25lKFswLCAwXSwgWzEsIDldKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJveFRvU2NyZWVuKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgcmV0dXJuIGFkZChtdWx0KHYsIGJveFNpemUpLCBib2FyZFBvc2l0aW9uKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB6b25lVG9TY3JlZW4oejogWm9uZSk6IFpvbmUge1xyXG4gIHJldHVybiBjcmVhdGVab25lKFxyXG4gICAgYm94VG9TY3JlZW4oei5zbGljZSgwLCAyKSBhcyBWZWN0b3IpLFxyXG4gICAgYm94VG9TY3JlZW4oei5zbGljZSgyKSBhcyBWZWN0b3IpXHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRQb3NpdGlvbigpOiBWZWN0b3Ige1xyXG4gIHJldHVybiBzdGlja3koW3dpZHRoIC8gMiAtIGJvYXJkU2l6ZVswXSAvIDIsIGhlaWdodCAvIDIgLSBib2FyZFNpemVbMV0gLyAyXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Qm9hcmQoKSB7XHJcbiAgcmV0dXJuIFsuLi5ib2FyZF1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgVmVjdG9yID0gW3g6IG51bWJlciwgeTogbnVtYmVyXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gIHJldHVybiBtdWx0KFxyXG4gICAgZmxvb3IoZGl2KHN1Yih2LCBkaXYoYm94U2l6ZSwgWzMsIDNdKSksIGRpdihib3hTaXplLCBbMiwgMl0pKSksXHJcbiAgICBkaXYoYm94U2l6ZSwgWzIsIDJdKVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlKCk6IFZlY3RvciB7XHJcbiAgcmV0dXJuIFttb3VzZVgsIG1vdXNlWV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJvYXJkU3RpY2t5TW91c2UoKTogVmVjdG9yIHtcclxuICByZXR1cm4gc3RpY2t5KGlubmVyQm9hcmQobW91c2UoKSkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbm5lckJvYXJkKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgcmV0dXJuIG1heChcclxuICAgIG1pbih2LCBzdWIoYWRkKGJvYXJkUG9zaXRpb24oKSwgYm9hcmRTaXplKSwgZGl2KGJveFNpemUsIFszLCAzXSkpKSxcclxuICAgIGFkZChib2FyZFBvc2l0aW9uKCksIGRpdihib3hTaXplLCBbMywgM10pKVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1pbih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcclxuICByZXR1cm4gW01hdGgubWluKHYxWzBdLCB2MlswXSksIE1hdGgubWluKHYxWzFdLCB2MlsxXSldXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXgodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgcmV0dXJuIFtNYXRoLm1heCh2MVswXSwgdjJbMF0pLCBNYXRoLm1heCh2MVsxXSwgdjJbMV0pXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gIHJldHVybiBbdjFbMF0gKyB2MlswXSwgdjFbMV0gKyB2MlsxXV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1Yih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcclxuICByZXR1cm4gW3YxWzBdIC0gdjJbMF0sIHYxWzFdIC0gdjJbMV1dXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXYodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgcmV0dXJuIFt2MVswXSAvIHYyWzBdLCB2MVsxXSAvIHYyWzFdXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbXVsdCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcclxuICByZXR1cm4gW3YxWzBdICogdjJbMF0sIHYxWzFdICogdjJbMV1dXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2OiBWZWN0b3IpOiBWZWN0b3Ige1xyXG4gIHJldHVybiBbTWF0aC5mbG9vcih2WzBdKSwgTWF0aC5mbG9vcih2WzFdKV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKHY6IFZlY3Rvcik6IFZlY3RvciB7XHJcbiAgcmV0dXJuIGFkZCh2LCBbMCwgMF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXIodjogVmVjdG9yKTogVmVjdG9yIHtcclxuICByZXR1cm4gYWRkKHYsIGRpdihib3hTaXplLCBbMiwgMl0pKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3VyZmFjZSh2OiBWZWN0b3IpOiBTdXJmYWNlIHtcclxuICBjb25zdCBzaGlmdCA9IGRpdihib3hTaXplLCBbMywgM10pXHJcbiAgcmV0dXJuIFtcclxuICAgIHN0aWNreShjbG9uZSh2KSksIC8vIG1pZGRsZVxyXG4gICAgc3RpY2t5KGFkZCh2LCBzaGlmdCkpLCAvLyBib3R0b20gcmlnaHRcclxuICAgIHN0aWNreShzdWIodiwgc2hpZnQpKSwgLy8gdG9wIGxlZnRcclxuICAgIHN0aWNreShbdlswXSwgdlsxXSAtIHNoaWZ0WzFdXSksIC8vIHRvcFxyXG4gICAgc3RpY2t5KFt2WzBdLCB2WzFdICsgc2hpZnRbMV1dKSwgLy8gYm90dG9tXHJcbiAgICBzdGlja3koW3ZbMF0gLSBzaGlmdFswXSwgdlsxXV0pLCAvLyBsZWZ0XHJcbiAgICBzdGlja3koW3ZbMF0gKyBzaGlmdFswXSwgdlsxXV0pLCAvLyByaWdodFxyXG4gICAgc3RpY2t5KFt2WzBdIC0gc2hpZnRbMF0sIHZbMV0gKyBzaGlmdFswXV0pLCAvLyBib3R0b20gbGVmdFxyXG4gICAgc3RpY2t5KFt2WzBdICsgc2hpZnRbMF0sIHZbMV0gLSBzaGlmdFswXV0pLCAvLyB0b3AgcmlnaHRcclxuICBdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N1cGVyaW1wb3NlZChzMTogU3VyZmFjZSwgczI6IFN1cmZhY2UpOiBib29sZWFuIHtcclxuICByZXR1cm4gczEuc29tZSgodjEpID0+IHMyLnNvbWUoKHYyKSA9PiB2MS50b1N0cmluZygpID09PSB2Mi50b1N0cmluZygpKSlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmFibGUge1xyXG4gIGdyaWRTbGF2ZTogYm9vbGVhblxyXG4gIHBvc2l0aW9uOiBWZWN0b3JcclxufVxyXG5cclxuLy8gcHJldHRpZXItaWdub3JlXHJcbmV4cG9ydCB0eXBlIFN1cmZhY2UgPSBbXHJcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvcixcclxuICBWZWN0b3IsIFZlY3RvciwgVmVjdG9yLFxyXG4gIFZlY3RvciwgVmVjdG9yLCBWZWN0b3JcclxuXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEdyaWRTbGF2ZUF0KGF0OiBWZWN0b3IpOiBQb3NpdGlvbmFibGUgfCB1bmRlZmluZWQge1xyXG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmluZChcclxuICAgIChpdGVtKSA9PlxyXG4gICAgICBpdGVtLmdyaWRTbGF2ZSAmJlxyXG4gICAgICBzdGlja3koaXRlbS5wb3NpdGlvbikudG9TdHJpbmcoKSA9PT0gc3RpY2t5KGF0KS50b1N0cmluZygpXHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbXNBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlW10ge1xyXG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmlsdGVyKFxyXG4gICAgKGl0ZW0pID0+IHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGxheWFibGUge1xyXG4gIHpJbmRleDogbnVtYmVyXHJcbiAgZHJhdygpOiB1bmtub3duXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xyXG4gIHJldHVybiBcInpJbmRleFwiIGluIGl0ZW0gJiYgXCJkcmF3XCIgaW4gaXRlbVxyXG59XHJcbiIsICJpbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VG93ZXJTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoNTApXG4gIHJlY3QoLi4ucG9zaXRpb24sIC4uLnNwYWNlLmJveFNpemUsIDUpXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RW5lbXlTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoXCJyZWRcIilcbiAgZWxsaXBzZSguLi5wb3NpdGlvbiwgLi4uc3BhY2UuZGl2KHNwYWNlLmJveFNpemUsIFsyLCAyXSkpXG59XG5cbmV4cG9ydCB0eXBlIFNwcml0ZSA9IChcbiAgYW5nbGU6IG51bWJlcixcbiAgcG9zaXRpb246IHNwYWNlLlZlY3RvcixcbiAgZm9jdXM/OiBib29sZWFuXG4pID0+IHVua25vd25cbiIsICJpbXBvcnQgKiBhcyBlbmVteSBmcm9tIFwiLi9lbmVteVwiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5pbXBvcnQgKiBhcyBzcHJpdGUgZnJvbSBcIi4vc3ByaXRlXCJcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIlxuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVmZmVjdDogVG93ZXJFZmZlY3QgPSAoZ2FtZSwgd2VhcG9uLCBlbmVteSkgPT4ge1xuICBlbmVteS5saWZlIC09IHdlYXBvbi5kYW1hZ2UgKiBnYW1lLmRhbWFnZU11bHRpcGxpZXJcbn1cblxuZXhwb3J0IGNvbnN0IHRvd2VyUmF0ZXMgPSB7XG4gIHNsb3c6IDAuNSAvIDYwLCAvLyB1biB0aXIgdG91dGVzIGxlcyBkZXV4IHNlY29uZGVzXG59XG5cbmV4cG9ydCBjb25zdCB0b3dlclJhbmdlcyA9IHtcbiAgNjA6IHNwYWNlLmJveFNpemVbMF0gKiAzLFxuICAxODA6IHNwYWNlLmJveFNpemVbMF0gKiA3LFxufVxuXG5leHBvcnQgY29uc3QgdG93ZXJzOiBCYXNlVG93ZXJbXSA9IFtcbiAgW1xuICAgIHtcbiAgICAgIC8vIDBcbiAgICAgIG5hbWU6IFwiUGVsbGV0XCIsXG4gICAgICBjb3N0OiA1LFxuICAgICAgcmF0ZTogdG93ZXJSYXRlcy5zbG93LFxuICAgICAgZGFtYWdlOiAxMCxcbiAgICAgIHJhbmdlOiB0b3dlclJhbmdlc1tcIjYwXCJdLFxuICAgICAgc2VsbENvc3Q6IDMsXG4gICAgICBzcHJpdGU6IHNwcml0ZS5kZWZhdWx0VG93ZXJTcHJpdGUsXG4gICAgICBjcml0aWNhbDogMC4xLCAvLyB1bmUgY2hhbmNlIHN1ciBkaXggZGUgZmFpcmUgdW4gY3JpdGlxdWVcbiAgICAgIGVmZmVjdDogZGVmYXVsdEVmZmVjdCxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIDFcbiAgICAgIG5hbWU6IFwiUGVsbGV0XCIsXG4gICAgICBjb3N0OiAxMCxcbiAgICAgIHJhdGU6IHRvd2VyUmF0ZXMuc2xvdyxcbiAgICAgIGRhbWFnZTogMjAsXG4gICAgICByYW5nZTogdG93ZXJSYW5nZXNbXCI2MFwiXSxcbiAgICAgIHNlbGxDb3N0OiA3LFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyAyXG4gICAgICBuYW1lOiBcIlBlbGxldFwiLFxuICAgICAgY29zdDogMjAsXG4gICAgICByYXRlOiB0b3dlclJhdGVzLnNsb3csXG4gICAgICBkYW1hZ2U6IDQwLFxuICAgICAgcmFuZ2U6IHRvd2VyUmFuZ2VzW1wiNjBcIl0sXG4gICAgICBzZWxsQ29zdDogMTUsXG4gICAgICBzcHJpdGU6IHNwcml0ZS5kZWZhdWx0VG93ZXJTcHJpdGUsXG4gICAgICBjcml0aWNhbDogMC4xLCAvLyB1bmUgY2hhbmNlIHN1ciBkaXggZGUgZmFpcmUgdW4gY3JpdGlxdWVcbiAgICAgIGVmZmVjdDogZGVmYXVsdEVmZmVjdCxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIDNcbiAgICAgIG5hbWU6IFwiUGVsbGV0XCIsXG4gICAgICBjb3N0OiA0MCxcbiAgICAgIHJhdGU6IHRvd2VyUmF0ZXMuc2xvdyxcbiAgICAgIGRhbWFnZTogODAsXG4gICAgICByYW5nZTogdG93ZXJSYW5nZXNbXCI2MFwiXSxcbiAgICAgIHNlbGxDb3N0OiAzMCxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjEsIC8vIHVuZSBjaGFuY2Ugc3VyIGRpeCBkZSBmYWlyZSB1biBjcml0aXF1ZVxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gNFxuICAgICAgbmFtZTogXCJQZWxsZXRcIixcbiAgICAgIGNvc3Q6IDgwLFxuICAgICAgcmF0ZTogdG93ZXJSYXRlcy5zbG93LFxuICAgICAgZGFtYWdlOiAxNjAsXG4gICAgICByYW5nZTogdG93ZXJSYW5nZXNbXCI2MFwiXSxcbiAgICAgIHNlbGxDb3N0OiA2MCxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjEsIC8vIHVuZSBjaGFuY2Ugc3VyIGRpeCBkZSBmYWlyZSB1biBjcml0aXF1ZVxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gNVxuICAgICAgbmFtZTogXCJTbmlwZXJcIixcbiAgICAgIGNvc3Q6IDEyMCxcbiAgICAgIHJhdGU6IHRvd2VyUmF0ZXMuc2xvdyxcbiAgICAgIGRhbWFnZTogNDAwLFxuICAgICAgcmFuZ2U6IHRvd2VyUmFuZ2VzW1wiMTgwXCJdLFxuICAgICAgc2VsbENvc3Q6IDMwLFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiU3F1aXJ0XCIsXG4gICAgICBjb3N0OiAxNSxcbiAgICAgIHJhdGU6IDIgLyA2MCwgLy8gZGV1eCB0aXJzIHBhciBzZWNvbmRlXG4gICAgICBkYW1hZ2U6IDUsXG4gICAgICByYW5nZTogc3BhY2UuYm94U2l6ZVswXSAqIDMsXG4gICAgICBzZWxsQ29zdDogMTAsXG4gICAgICBzcHJpdGU6IHNwcml0ZS5kZWZhdWx0VG93ZXJTcHJpdGUsXG4gICAgICBjcml0aWNhbDogMC4wNSxcbiAgICAgIGVmZmVjdDogZGVmYXVsdEVmZmVjdCxcbiAgICB9LFxuICBdLFxuXVxuXG5leHBvcnQgdHlwZSBCYXNlVG93ZXIgPSBUb3dlckxldmVsW11cblxuZXhwb3J0IGludGVyZmFjZSBUb3dlckxldmVsIHtcbiAgbmFtZTogc3RyaW5nXG4gIHJhdGU6IG51bWJlclxuICBkYW1hZ2U6IG51bWJlclxuICBjb3N0OiBudW1iZXJcbiAgc2VsbENvc3Q6IG51bWJlclxuICBzcHJpdGU6IHNwcml0ZS5TcHJpdGVcbiAgcmFuZ2U6IG51bWJlclxuICBjcml0aWNhbDogbnVtYmVyXG4gIGVmZmVjdDogVG93ZXJFZmZlY3Rcbn1cblxuZXhwb3J0IGNsYXNzIFRvd2VyIGltcGxlbWVudHMgc3BhY2UuUG9zaXRpb25hYmxlLCBzcGFjZS5EaXNwbGF5YWJsZSB7XG4gIHByaXZhdGUgX2xldmVsID0gMFxuXG4gIHpJbmRleCA9IDFcbiAgYW5nbGUgPSAwXG4gIGdyaWRTbGF2ZSA9IHRydWVcblxuICBnZXQgbGV2ZWwoKTogVG93ZXJMZXZlbCB7XG4gICAgcmV0dXJuIHRoaXMuYmFzZVt0aGlzLl9sZXZlbF1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBnYW1lOiBHYW1lLFxuICAgIHB1YmxpYyBwb3NpdGlvbjogc3BhY2UuVmVjdG9yLFxuICAgIHB1YmxpYyByZWFkb25seSBiYXNlOiBCYXNlVG93ZXJcbiAgKSB7fVxuXG4gIHVwZ3JhZGUoKSB7XG4gICAgY29uc3QgbmV4dExldmVsID0gdGhpcy5iYXNlW3RoaXMuX2xldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5nYW1lLm1vbmV5IC09IG5leHRMZXZlbC5jb3N0XG4gICAgdGhpcy5fbGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgLy8gc2hvdCBlbmVtaWVzXG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLnBvc2l0aW9uLnRvU3RyaW5nKCkgPT09IHNwYWNlLmJvYXJkU3RpY2t5TW91c2UoKS50b1N0cmluZygpKVxuICAgICAgdGhpcy5kcmF3UmFuZ2UoKVxuICAgIHRoaXMubGV2ZWwuc3ByaXRlKHRoaXMuYW5nbGUsIHRoaXMucG9zaXRpb24pXG4gIH1cblxuICBkcmF3UmFuZ2UoKSB7XG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gICAgc3Ryb2tlKDI1NSwgMjE1LCAwLCA1MClcbiAgICBmaWxsKDI1NSwgMjE1LCAwLCAzMClcbiAgICBjaXJjbGUoLi4uc3BhY2UuY2VudGVyKHRoaXMucG9zaXRpb24pLCB0aGlzLmxldmVsLnJhbmdlICogMilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUb3dlcihpdGVtOiBzcGFjZS5Qb3NpdGlvbmFibGUpOiBpdGVtIGlzIFRvd2VyIHtcbiAgcmV0dXJuIFwiYmFzZVwiIGluIGl0ZW0gJiYgXCJsZXZlbFwiIGluIGl0ZW1cbn1cblxuZXhwb3J0IHR5cGUgVG93ZXJFZmZlY3QgPSAoXG4gIGdhbWU6IEdhbWUsXG4gIHRvd2VyOiBUb3dlckxldmVsLFxuICBlbmVteTogZW5lbXkuRW5lbXlcbikgPT4gdW5rbm93blxuIiwgImltcG9ydCAqIGFzIHRvd2VyIGZyb20gXCIuL3Rvd2VyXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL3NwYWNlXCJcbmltcG9ydCAqIGFzIGJvbnVzIGZyb20gXCIuL2JvbnVzXCJcbmltcG9ydCAqIGFzIHBvd2VyIGZyb20gXCIuL3Bvd2VyXCJcblxuZXhwb3J0IGNvbnN0IHNob3BXaWR0aCA9IDEwMFxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uKCk6IHRvd2VyLkJhc2VUb3dlciB8IHVuZGVmaW5lZCB7XG4gIC8vIHwgYm9udXMuQm9udXMgfCBwb3dlci5Qb3dlclxuICBpZiAobW91c2VYIDwgd2lkdGggLSBzaG9wV2lkdGgpIHJldHVybiB1bmRlZmluZWRcbiAgcmV0dXJuIHRvd2VyLnRvd2Vyc1tNYXRoLmZsb29yKG1vdXNlWSAvIHNob3BXaWR0aCldID8/IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdyhzZWxlY3RlZD86IHRvd2VyLkJhc2VUb3dlcikge1xuICBkcmF3VG93ZXJzKHNlbGVjdGVkKVxuICBkcmF3UG93ZXJzKClcbiAgZHJhd0JvbnVzZXMoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd1Rvd2VycyhzZWxlY3RlZD86IHRvd2VyLkJhc2VUb3dlcikge1xuICBub1N0cm9rZSgpXG4gIGZpbGwoMjApXG4gIHJlY3QoXG4gICAgd2lkdGggLSBzaG9wV2lkdGgsXG4gICAgMCxcbiAgICBzaG9wV2lkdGgsXG4gICAgc2hvcFdpZHRoICogdG93ZXIudG93ZXJzLmxlbmd0aCxcbiAgICBzaG9wV2lkdGggLyA0XG4gIClcblxuICB0b3dlci50b3dlcnMuZm9yRWFjaCgoYmFzZSwgaSkgPT4ge1xuICAgIGJhc2VbMF0uc3ByaXRlKFxuICAgICAgMCxcbiAgICAgIFtcbiAgICAgICAgd2lkdGggLSBzaG9wV2lkdGggLyAyIC0gc3BhY2UuYm94U2l6ZVswXSAvIDIsXG4gICAgICAgIHNob3BXaWR0aCAvIDIgLSBzcGFjZS5ib3hTaXplWzFdIC8gMiArIGkgKiBzaG9wV2lkdGgsXG4gICAgICBdLFxuICAgICAgc2VsZWN0ZWQgPT09IGJhc2VcbiAgICApXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3Qm9udXNlcygpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3UG93ZXJzKCkge31cbiIsICJpbXBvcnQgKiBhcyB0b3dlciBmcm9tIFwiLi9hcHAvdG93ZXJcIlxyXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxyXG5pbXBvcnQgKiBhcyBib251cyBmcm9tIFwiLi9hcHAvYm9udXNcIlxyXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9hcHAvc3BhY2VcIlxyXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxyXG5pbXBvcnQgKiBhcyBzaG9wIGZyb20gXCIuL2FwcC9zaG9wXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG4gIGxpZmUgPSAyMFxyXG4gIG1vbmV5ID0gMTAwXHJcbiAgc2NvcmUgPSAwXHJcbiAgdGltZSA9IDBcclxuICBib251c2VzID0gW11cclxuXHJcbiAgc2VsZWN0ZWRUb3dlcj86IHRvd2VyLkJhc2VUb3dlclxyXG4gIHByZXNzZWRBdD86IHNwYWNlLlZlY3RvclxyXG5cclxuICBwcml2YXRlIGxhc3RUaW1lR2l2ZW4gPSBEYXRlLm5vdygpXHJcblxyXG4gIGdldCBkYW1hZ2VNdWx0aXBsaWVyKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzcGFjZS5ib2FyZC5jbGVhcigpXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoaW5mbzogY2xvY2suVGltZUluZm8pIHt9XHJcblxyXG4gIGRyYXcoKSB7XHJcbiAgICBiYWNrZ3JvdW5kKDApXHJcblxyXG4gICAgZHJhd0JvYXJkKClcclxuICAgIC8vZHJhd1NwYXduKClcclxuICAgIGRyYXdTZWxlY3Rpb25SZWN0KClcclxuICAgIGRyYXdQb3NpdGlvbmFibGVJdGVtcygpXHJcblxyXG4gICAgc2hvcC5kcmF3KHRoaXMuc2VsZWN0ZWRUb3dlcilcclxuICB9XHJcblxyXG4gIGtleVByZXNzZWQoKSB7fVxyXG5cclxuICBrZXlSZWxlYXNlZCgpIHt9XHJcblxyXG4gIG1vdXNlUHJlc3NlZCgpIHtcclxuICAgIHRoaXMucHJlc3NlZEF0ID0gc3BhY2UuYm9hcmRTdGlja3lNb3VzZSgpXHJcbiAgfVxyXG5cclxuICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gc2hvcC5nZXRTZWxlY3Rpb24oKVxyXG5cclxuICAgIGlmIChzZWxlY3Rpb24pIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZFRvd2VyID0gc2VsZWN0aW9uXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCByZWxlYXNlZEF0ID0gc3BhY2UuYm9hcmRTdGlja3lNb3VzZSgpXHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdGhpcy5wcmVzc2VkQXQ/LnRvU3RyaW5nKCkgPT09IHJlbGVhc2VkQXQudG9TdHJpbmcoKSAmJlxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUb3dlclxyXG4gICAgICApIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAhc3BhY2VcclxuICAgICAgICAgICAgLmFycmF5Qm9hcmQoKVxyXG4gICAgICAgICAgICAuc29tZSgoaXRlbSkgPT5cclxuICAgICAgICAgICAgICBzcGFjZS5pc1N1cGVyaW1wb3NlZChcclxuICAgICAgICAgICAgICAgIHNwYWNlLnN1cmZhY2UocmVsZWFzZWRBdCksXHJcbiAgICAgICAgICAgICAgICBzcGFjZS5zdXJmYWNlKGl0ZW0ucG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBzcGFjZS5ib2FyZC5hZGQoXHJcbiAgICAgICAgICAgIG5ldyB0b3dlci5Ub3dlcih0aGlzLCBzcGFjZS5ib2FyZFN0aWNreU1vdXNlKCksIHRoaXMuc2VsZWN0ZWRUb3dlcilcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC8vZGVsZXRlIHRoaXMuc2VsZWN0ZWRUb3dlclxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xyXG4gIHN0cm9rZSg1MClcclxuICBzdHJva2VXZWlnaHQoMilcclxuICBmaWxsKDIwKVxyXG4gIHJlY3QoLi4uc3BhY2UuYm9hcmRQb3NpdGlvbigpLCAuLi5zcGFjZS5ib2FyZFNpemUpXHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIGRyYXdTcGF3bigpIHtcclxuLy8gICBub1N0cm9rZSgpXHJcbi8vICAgZmlsbCg1MClcclxuLy8gICByZWN0KC4uLnNwYWNlLnNwYXduWm9uZSgpKVxyXG4vLyB9XHJcblxyXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcclxuICBub1N0cm9rZSgpXHJcbiAgZmlsbCg0MClcclxuICByZWN0KC4uLnNwYWNlLmJvYXJkU3RpY2t5TW91c2UoKSwgLi4uc3BhY2UuYm94U2l6ZSlcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKCkge1xyXG4gIHNwYWNlXHJcbiAgICAuYXJyYXlCb2FyZCgpXHJcbiAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxyXG4gICAgICBzcGFjZS5pc0Rpc3BsYXlhYmxlKGl0ZW0pXHJcbiAgICApXHJcbiAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcclxuICAgIC5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmRyYXcoKSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNBTyxNQUFNLGVBQWU7QUFFckIsTUFBTSxPQUFpQjtBQUFBLElBQzVCLFVBQVUsS0FBSyxRQUFRO0FBQUEsSUFDdkIsY0FBYztBQUFBO0FBUVQsa0JBQThDO0FBQ25ELFFBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQzdDLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssV0FBVyxLQUFLO0FBQ3JCLFdBQUs7QUFDTCw0QkFBc0IsS0FBSyxLQUFLO0FBQUE7QUFBQTs7O0FDakI3QixNQUFNLFFBQVEsSUFBSTtBQUNsQixNQUFNLFVBQWtCLENBQUMsSUFBSTtBQUM3QixNQUFNLGFBQXFCLENBQUMsSUFBSTtBQUNoQyxNQUFNLFlBQW9CO0FBQUEsSUFDL0IsUUFBUSxLQUFLLFdBQVc7QUFBQSxJQUN4QixRQUFRLEtBQUssV0FBVztBQUFBO0FBMkJuQiwyQkFBaUM7QUFDdEMsV0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLFVBQVUsS0FB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QUFhO0FBQUE7QUFBQSxJQUViLGNBQWM7QUFBQTtBQUFBLElBRWQsZUFBZTtBQUNiLFdBQUssWUFBWSxBQUFNO0FBQUE7QUFBQSxJQUd6QixnQkFBZ0I7QUFoRGxCO0FBaURJLFlBQU0sWUFBWSxBQUFLO0FBRXZCLFVBQUksV0FBVztBQUNiLGFBQUssZ0JBQWdCO0FBQUEsYUFDaEI7QUFDTCxjQUFNLGFBQWEsQUFBTTtBQUV6QixZQUNFLFlBQUssY0FBTCxtQkFBZ0IsZ0JBQWUsV0FBVyxjQUMxQyxLQUFLLGVBQ0w7QUFDQSxjQUNFLENBQUMsQUFDRSxhQUNBLEtBQUssQ0FBQyxTQUNMLEFBQU0sZUFDSixBQUFNLFFBQVEsYUFDZCxBQUFNLFFBQVEsS0FBSyxhQUd6QjtBQUNBLFlBQU0sTUFBTSxJQUNWLElBQVUsTUFBTSxNQUFNLEFBQU0sb0JBQW9CLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaEVqRSxNQUFPLGVBQVA7QUF5RUEsdUJBQXFCO0FBQ25CLFdBQU87QUFDUCxpQkFBYTtBQUNiLFNBQUs7QUFDTCxTQUFLLEdBQUcsQUFBTSxpQkFBaUIsR0FBUztBQUFBO0FBUzFDLCtCQUE2QjtBQUMzQjtBQUNBLFNBQUs7QUFDTCxTQUFLLEdBQUcsQUFBTSxvQkFBb0IsR0FBUztBQUFBO0FBRzdDLG1DQUFpQztBQUMvQixJQUNHLGFBQ0EsT0FBTyxDQUFDLFNBQ1AsQUFBTSxjQUFjLE9BRXJCLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFDNUIsUUFBUSxDQUFDLFNBQVMsS0FBSztBQUFBOzs7QU5uRzVCLFdBQVMsaUJBQWlCLGVBQWUsQ0FBQyxVQUFVLE1BQU07QUFFMUQsTUFBSTtBQUVHLG1CQUFpQjtBQUN0QixpQkFDRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsYUFBYSxPQUFPLGNBQWMsSUFDcEUsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGNBQWMsT0FBTyxlQUFlO0FBR3hFLFdBQU8sSUFBSTtBQUVYLElBQU0sS0FBSyxLQUFLLEtBQUssT0FBTyxLQUFLO0FBQUE7QUFHNUIsbUJBQWdCO0FBQ3JCLFNBQUs7QUFBQTtBQUdBLHdCQUFzQjtBQUMzQixTQUFLO0FBQUE7QUFFQSx5QkFBdUI7QUFDNUIsU0FBSztBQUFBO0FBR0EsMEJBQXdCO0FBQzdCLFNBQUs7QUFBQTtBQUVBLDJCQUF5QjtBQUM5QixTQUFLO0FBQUE7QUFHQSwyQkFBeUI7QUFDOUIsaUJBQWEsYUFBYTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
