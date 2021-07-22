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
    enemy.life -= weapon.damage * game2.damage.value;
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

  // src/app/buff.ts
  var BuffAble = class {
    constructor(initialValue) {
      this.initialValue = initialValue;
      this.value = initialValue;
    }
    reset() {
      this.value = this.initialValue;
    }
  };
  var BuffAbleNumber = class extends BuffAble {
    get ratio() {
      return this.value / this.initialValue;
    }
  };

  // src/game.ts
  var Game = class {
    constructor() {
      this.score = 0;
      this.money = 100;
      this.time = 0;
      this.life = new BuffAbleNumber(20);
      this.damage = new BuffAbleNumber(1);
      this.bonuses = [];
      this.powers = [];
      this.lastTimeGiven = Date.now();
      board.clear();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvYXBwL3Nwcml0ZS50cyIsICJzcmMvYXBwL3Rvd2VyLnRzIiwgInNyYy9hcHAvc2hvcC50cyIsICJzcmMvYXBwL2J1ZmYudHMiLCAic3JjL2dhbWUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgY2xvY2sgZnJvbSBcIi4vYXBwL2Nsb2NrXCJcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXG5cbmxldCBnYW1lOiBHYW1lXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgY3JlYXRlQ2FudmFzKFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCksXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gIClcblxuICBnYW1lID0gbmV3IEdhbWUoKVxuXG4gIGNsb2NrLnRpY2suYmluZChnYW1lLnVwZGF0ZS5iaW5kKGdhbWUpKSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHtcbiAgZ2FtZS5rZXlQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHtcbiAgZ2FtZS5rZXlSZWxlYXNlZCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2luZG93UmVzaXplZCgpIHtcbiAgcmVzaXplQ2FudmFzKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpXG59XG4iLCAiZXhwb3J0IGNvbnN0IHRpY2tJbnRlcnZhbCA9IDEwMFxuXG5leHBvcnQgY29uc3QgaW5mbzogVGltZUluZm8gPSB7XG4gIGxhc3RUaWNrOiBEYXRlLm5vdygpIC0gdGlja0ludGVydmFsLFxuICBnYW1lRHVyYXRpb246IDAsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUluZm8ge1xuICBsYXN0VGljazogbnVtYmVyXG4gIGdhbWVEdXJhdGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWNrKHRoaXM6IChpbmZvOiBUaW1lSW5mbykgPT4gdm9pZCkge1xuICBpZiAoaW5mby5sYXN0VGljayA+IERhdGUubm93KCkgKyB0aWNrSW50ZXJ2YWwpIHtcbiAgICBpbmZvLmdhbWVEdXJhdGlvbiArPSB0aWNrSW50ZXJ2YWxcbiAgICBpbmZvLmxhc3RUaWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMoaW5mbylcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljay5iaW5kKHRoaXMpKVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGJvYXJkID0gbmV3IFNldDxQb3NpdGlvbmFibGU+KClcbmV4cG9ydCBjb25zdCBib3hTaXplOiBWZWN0b3IgPSBbNDgsIDQ4XVxuZXhwb3J0IGNvbnN0IGJvYXJkQm94ZXM6IFZlY3RvciA9IFsxNSwgMTBdXG5leHBvcnQgY29uc3QgYm9hcmRTaXplOiBWZWN0b3IgPSBbXG4gIGJveFNpemVbMF0gKiBib2FyZEJveGVzWzBdLFxuICBib3hTaXplWzFdICogYm9hcmRCb3hlc1sxXSxcbl1cblxuZXhwb3J0IHR5cGUgWm9uZSA9IFsuLi5zdGFydDogVmVjdG9yLCAuLi5lbmQ6IFZlY3Rvcl1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVpvbmUodjE6IFZlY3RvciwgdjI6IFZlY3RvciwgdjJBc1NpemUgPSBmYWxzZSk6IFpvbmUge1xuICByZXR1cm4gWy4uLnYxLCAuLi4odjJBc1NpemUgPyBhZGQodjEsIHYyKSA6IHYyKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduWm9uZSgpOiBab25lIHtcbiAgcmV0dXJuIHpvbmVUb1NjcmVlbihjcmVhdGVab25lKFswLCAwXSwgWzEsIDldKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJveFRvU2NyZWVuKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBhZGQobXVsdCh2LCBib3hTaXplKSwgYm9hcmRQb3NpdGlvbigpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gem9uZVRvU2NyZWVuKHo6IFpvbmUpOiBab25lIHtcbiAgcmV0dXJuIGNyZWF0ZVpvbmUoXG4gICAgYm94VG9TY3JlZW4oei5zbGljZSgwLCAyKSBhcyBWZWN0b3IpLFxuICAgIGJveFRvU2NyZWVuKHouc2xpY2UoMikgYXMgVmVjdG9yKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBib2FyZFBvc2l0aW9uKCk6IFZlY3RvciB7XG4gIHJldHVybiBzdGlja3koW3dpZHRoIC8gMiAtIGJvYXJkU2l6ZVswXSAvIDIsIGhlaWdodCAvIDIgLSBib2FyZFNpemVbMV0gLyAyXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Qm9hcmQoKSB7XG4gIHJldHVybiBbLi4uYm9hcmRdXG59XG5cbmV4cG9ydCB0eXBlIFZlY3RvciA9IFt4OiBudW1iZXIsIHk6IG51bWJlcl1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gbXVsdChcbiAgICBmbG9vcihkaXYoc3ViKHYsIGRpdihib3hTaXplLCBbMywgM10pKSwgZGl2KGJveFNpemUsIFsyLCAyXSkpKSxcbiAgICBkaXYoYm94U2l6ZSwgWzIsIDJdKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gW21vdXNlWCwgbW91c2VZXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRTdGlja3lNb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KGlubmVyQm9hcmQobW91c2UoKSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbm5lckJvYXJkKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBtYXgoXG4gICAgbWluKHYsIHN1YihhZGQoYm9hcmRQb3NpdGlvbigpLCBib2FyZFNpemUpLCBkaXYoYm94U2l6ZSwgWzMsIDNdKSkpLFxuICAgIGFkZChib2FyZFBvc2l0aW9uKCksIGRpdihib3hTaXplLCBbMywgM10pKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW4odjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5taW4odjFbMF0sIHYyWzBdKSwgTWF0aC5taW4odjFbMV0sIHYyWzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1heCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLm1heCh2MVswXSwgdjJbMF0pLCBNYXRoLm1heCh2MVsxXSwgdjJbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdICsgdjJbMF0sIHYxWzFdICsgdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWIodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gLSB2MlswXSwgdjFbMV0gLSB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpdih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAvIHYyWzBdLCB2MVsxXSAvIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbXVsdCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAqIHYyWzBdLCB2MVsxXSAqIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxvb3IodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLmZsb29yKHZbMF0pLCBNYXRoLmZsb29yKHZbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZCh2LCBbMCwgMF0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXIodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZCh2LCBkaXYoYm94U2l6ZSwgWzIsIDJdKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1cmZhY2UodjogVmVjdG9yKTogU3VyZmFjZSB7XG4gIGNvbnN0IHNoaWZ0ID0gZGl2KGJveFNpemUsIFszLCAzXSlcbiAgcmV0dXJuIFtcbiAgICBzdGlja3koY2xvbmUodikpLCAvLyBtaWRkbGVcbiAgICBzdGlja3koYWRkKHYsIHNoaWZ0KSksIC8vIGJvdHRvbSByaWdodFxuICAgIHN0aWNreShzdWIodiwgc2hpZnQpKSwgLy8gdG9wIGxlZnRcbiAgICBzdGlja3koW3ZbMF0sIHZbMV0gLSBzaGlmdFsxXV0pLCAvLyB0b3BcbiAgICBzdGlja3koW3ZbMF0sIHZbMV0gKyBzaGlmdFsxXV0pLCAvLyBib3R0b21cbiAgICBzdGlja3koW3ZbMF0gLSBzaGlmdFswXSwgdlsxXV0pLCAvLyBsZWZ0XG4gICAgc3RpY2t5KFt2WzBdICsgc2hpZnRbMF0sIHZbMV1dKSwgLy8gcmlnaHRcbiAgICBzdGlja3koW3ZbMF0gLSBzaGlmdFswXSwgdlsxXSArIHNoaWZ0WzBdXSksIC8vIGJvdHRvbSBsZWZ0XG4gICAgc3RpY2t5KFt2WzBdICsgc2hpZnRbMF0sIHZbMV0gLSBzaGlmdFswXV0pLCAvLyB0b3AgcmlnaHRcbiAgXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdXBlcmltcG9zZWQoczE6IFN1cmZhY2UsIHMyOiBTdXJmYWNlKTogYm9vbGVhbiB7XG4gIHJldHVybiBzMS5zb21lKCh2MSkgPT4gczIuc29tZSgodjIpID0+IHYxLnRvU3RyaW5nKCkgPT09IHYyLnRvU3RyaW5nKCkpKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbi8vIHByZXR0aWVyLWlnbm9yZVxuZXhwb3J0IHR5cGUgU3VyZmFjZSA9IFtcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvcixcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvcixcbiAgVmVjdG9yLCBWZWN0b3IsIFZlY3RvclxuXVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JpZFNsYXZlQXQoYXQ6IFZlY3Rvcik6IFBvc2l0aW9uYWJsZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmluZChcbiAgICAoaXRlbSkgPT5cbiAgICAgIGl0ZW0uZ3JpZFNsYXZlICYmXG4gICAgICBzdGlja3koaXRlbS5wb3NpdGlvbikudG9TdHJpbmcoKSA9PT0gc3RpY2t5KGF0KS50b1N0cmluZygpXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEl0ZW1zQXQoYXQ6IFZlY3Rvcik6IFBvc2l0aW9uYWJsZVtdIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maWx0ZXIoXG4gICAgKGl0ZW0pID0+IHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VG93ZXJTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoNTApXG4gIHJlY3QoLi4ucG9zaXRpb24sIC4uLnNwYWNlLmJveFNpemUsIDUpXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RW5lbXlTcHJpdGU6IFNwcml0ZSA9IChhbmdsZSwgcG9zaXRpb24sIGZvY3VzKSA9PiB7XG4gIGlmIChmb2N1cykge1xuICAgIHN0cm9rZSgyMDApXG4gICAgc3Ryb2tlV2VpZ2h0KDIpXG4gIH0gZWxzZSBub1N0cm9rZSgpXG4gIGZpbGwoXCJyZWRcIilcbiAgZWxsaXBzZSguLi5wb3NpdGlvbiwgLi4uc3BhY2UuZGl2KHNwYWNlLmJveFNpemUsIFsyLCAyXSkpXG59XG5cbmV4cG9ydCB0eXBlIFNwcml0ZSA9IChcbiAgYW5nbGU6IG51bWJlcixcbiAgcG9zaXRpb246IHNwYWNlLlZlY3RvcixcbiAgZm9jdXM/OiBib29sZWFuXG4pID0+IHVua25vd25cbiIsICJpbXBvcnQgKiBhcyBlbmVteSBmcm9tIFwiLi9lbmVteVwiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9zcGFjZVwiXG5pbXBvcnQgKiBhcyBzcHJpdGUgZnJvbSBcIi4vc3ByaXRlXCJcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2dhbWVcIlxuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVmZmVjdDogVG93ZXJFZmZlY3QgPSAoZ2FtZSwgd2VhcG9uLCBlbmVteSkgPT4ge1xuICBlbmVteS5saWZlIC09IHdlYXBvbi5kYW1hZ2UgKiBnYW1lLmRhbWFnZS52YWx1ZVxufVxuXG5leHBvcnQgY29uc3QgdG93ZXJSYXRlcyA9IHtcbiAgc2xvdzogMC41IC8gNjAsIC8vIHVuIHRpciB0b3V0ZXMgbGVzIGRldXggc2Vjb25kZXNcbn1cblxuZXhwb3J0IGNvbnN0IHRvd2VyUmFuZ2VzID0ge1xuICA2MDogc3BhY2UuYm94U2l6ZVswXSAqIDMsXG4gIDE4MDogc3BhY2UuYm94U2l6ZVswXSAqIDcsXG59XG5cbmV4cG9ydCBjb25zdCB0b3dlcnM6IEJhc2VUb3dlcltdID0gW1xuICBbXG4gICAge1xuICAgICAgLy8gMFxuICAgICAgbmFtZTogXCJQZWxsZXRcIixcbiAgICAgIGNvc3Q6IDUsXG4gICAgICByYXRlOiB0b3dlclJhdGVzLnNsb3csXG4gICAgICBkYW1hZ2U6IDEwLFxuICAgICAgcmFuZ2U6IHRvd2VyUmFuZ2VzW1wiNjBcIl0sXG4gICAgICBzZWxsQ29zdDogMyxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjEsIC8vIHVuZSBjaGFuY2Ugc3VyIGRpeCBkZSBmYWlyZSB1biBjcml0aXF1ZVxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gMVxuICAgICAgbmFtZTogXCJQZWxsZXRcIixcbiAgICAgIGNvc3Q6IDEwLFxuICAgICAgcmF0ZTogdG93ZXJSYXRlcy5zbG93LFxuICAgICAgZGFtYWdlOiAyMCxcbiAgICAgIHJhbmdlOiB0b3dlclJhbmdlc1tcIjYwXCJdLFxuICAgICAgc2VsbENvc3Q6IDcsXG4gICAgICBzcHJpdGU6IHNwcml0ZS5kZWZhdWx0VG93ZXJTcHJpdGUsXG4gICAgICBjcml0aWNhbDogMC4xLCAvLyB1bmUgY2hhbmNlIHN1ciBkaXggZGUgZmFpcmUgdW4gY3JpdGlxdWVcbiAgICAgIGVmZmVjdDogZGVmYXVsdEVmZmVjdCxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIDJcbiAgICAgIG5hbWU6IFwiUGVsbGV0XCIsXG4gICAgICBjb3N0OiAyMCxcbiAgICAgIHJhdGU6IHRvd2VyUmF0ZXMuc2xvdyxcbiAgICAgIGRhbWFnZTogNDAsXG4gICAgICByYW5nZTogdG93ZXJSYW5nZXNbXCI2MFwiXSxcbiAgICAgIHNlbGxDb3N0OiAxNSxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjEsIC8vIHVuZSBjaGFuY2Ugc3VyIGRpeCBkZSBmYWlyZSB1biBjcml0aXF1ZVxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gM1xuICAgICAgbmFtZTogXCJQZWxsZXRcIixcbiAgICAgIGNvc3Q6IDQwLFxuICAgICAgcmF0ZTogdG93ZXJSYXRlcy5zbG93LFxuICAgICAgZGFtYWdlOiA4MCxcbiAgICAgIHJhbmdlOiB0b3dlclJhbmdlc1tcIjYwXCJdLFxuICAgICAgc2VsbENvc3Q6IDMwLFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyA0XG4gICAgICBuYW1lOiBcIlBlbGxldFwiLFxuICAgICAgY29zdDogODAsXG4gICAgICByYXRlOiB0b3dlclJhdGVzLnNsb3csXG4gICAgICBkYW1hZ2U6IDE2MCxcbiAgICAgIHJhbmdlOiB0b3dlclJhbmdlc1tcIjYwXCJdLFxuICAgICAgc2VsbENvc3Q6IDYwLFxuICAgICAgc3ByaXRlOiBzcHJpdGUuZGVmYXVsdFRvd2VyU3ByaXRlLFxuICAgICAgY3JpdGljYWw6IDAuMSwgLy8gdW5lIGNoYW5jZSBzdXIgZGl4IGRlIGZhaXJlIHVuIGNyaXRpcXVlXG4gICAgICBlZmZlY3Q6IGRlZmF1bHRFZmZlY3QsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyA1XG4gICAgICBuYW1lOiBcIlNuaXBlclwiLFxuICAgICAgY29zdDogMTIwLFxuICAgICAgcmF0ZTogdG93ZXJSYXRlcy5zbG93LFxuICAgICAgZGFtYWdlOiA0MDAsXG4gICAgICByYW5nZTogdG93ZXJSYW5nZXNbXCIxODBcIl0sXG4gICAgICBzZWxsQ29zdDogMzAsXG4gICAgICBzcHJpdGU6IHNwcml0ZS5kZWZhdWx0VG93ZXJTcHJpdGUsXG4gICAgICBjcml0aWNhbDogMC4xLCAvLyB1bmUgY2hhbmNlIHN1ciBkaXggZGUgZmFpcmUgdW4gY3JpdGlxdWVcbiAgICAgIGVmZmVjdDogZGVmYXVsdEVmZmVjdCxcbiAgICB9LFxuICBdLFxuICBbXG4gICAge1xuICAgICAgbmFtZTogXCJTcXVpcnRcIixcbiAgICAgIGNvc3Q6IDE1LFxuICAgICAgcmF0ZTogMiAvIDYwLCAvLyBkZXV4IHRpcnMgcGFyIHNlY29uZGVcbiAgICAgIGRhbWFnZTogNSxcbiAgICAgIHJhbmdlOiBzcGFjZS5ib3hTaXplWzBdICogMyxcbiAgICAgIHNlbGxDb3N0OiAxMCxcbiAgICAgIHNwcml0ZTogc3ByaXRlLmRlZmF1bHRUb3dlclNwcml0ZSxcbiAgICAgIGNyaXRpY2FsOiAwLjA1LFxuICAgICAgZWZmZWN0OiBkZWZhdWx0RWZmZWN0LFxuICAgIH0sXG4gIF0sXG5dXG5cbmV4cG9ydCB0eXBlIEJhc2VUb3dlciA9IFRvd2VyTGV2ZWxbXVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvd2VyTGV2ZWwge1xuICBuYW1lOiBzdHJpbmdcbiAgcmF0ZTogbnVtYmVyXG4gIGRhbWFnZTogbnVtYmVyXG4gIGNvc3Q6IG51bWJlclxuICBzZWxsQ29zdDogbnVtYmVyXG4gIHNwcml0ZTogc3ByaXRlLlNwcml0ZVxuICByYW5nZTogbnVtYmVyXG4gIGNyaXRpY2FsOiBudW1iZXJcbiAgZWZmZWN0OiBUb3dlckVmZmVjdFxufVxuXG5leHBvcnQgY2xhc3MgVG93ZXIgaW1wbGVtZW50cyBzcGFjZS5Qb3NpdGlvbmFibGUsIHNwYWNlLkRpc3BsYXlhYmxlIHtcbiAgcHJpdmF0ZSBfbGV2ZWwgPSAwXG5cbiAgekluZGV4ID0gMVxuICBhbmdsZSA9IDBcbiAgZ3JpZFNsYXZlID0gdHJ1ZVxuXG4gIGdldCBsZXZlbCgpOiBUb3dlckxldmVsIHtcbiAgICByZXR1cm4gdGhpcy5iYXNlW3RoaXMuX2xldmVsXVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGdhbWU6IEdhbWUsXG4gICAgcHVibGljIHBvc2l0aW9uOiBzcGFjZS5WZWN0b3IsXG4gICAgcHVibGljIHJlYWRvbmx5IGJhc2U6IEJhc2VUb3dlclxuICApIHt9XG5cbiAgdXBncmFkZSgpIHtcbiAgICBjb25zdCBuZXh0TGV2ZWwgPSB0aGlzLmJhc2VbdGhpcy5fbGV2ZWwgKyAxXVxuICAgIGlmICghbmV4dExldmVsKSByZXR1cm4gZmFsc2VcbiAgICB0aGlzLmdhbWUubW9uZXkgLT0gbmV4dExldmVsLmNvc3RcbiAgICB0aGlzLl9sZXZlbCsrXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICAvLyBzaG90IGVuZW1pZXNcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gc3BhY2UuYm9hcmRTdGlja3lNb3VzZSgpLnRvU3RyaW5nKCkpXG4gICAgICB0aGlzLmRyYXdSYW5nZSgpXG4gICAgdGhpcy5sZXZlbC5zcHJpdGUodGhpcy5hbmdsZSwgdGhpcy5wb3NpdGlvbilcbiAgfVxuXG4gIGRyYXdSYW5nZSgpIHtcbiAgICBzdHJva2VXZWlnaHQoMilcbiAgICBzdHJva2UoMjU1LCAyMTUsIDAsIDUwKVxuICAgIGZpbGwoMjU1LCAyMTUsIDAsIDMwKVxuICAgIGNpcmNsZSguLi5zcGFjZS5jZW50ZXIodGhpcy5wb3NpdGlvbiksIHRoaXMubGV2ZWwucmFuZ2UgKiAyKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rvd2VyKGl0ZW06IHNwYWNlLlBvc2l0aW9uYWJsZSk6IGl0ZW0gaXMgVG93ZXIge1xuICByZXR1cm4gXCJiYXNlXCIgaW4gaXRlbSAmJiBcImxldmVsXCIgaW4gaXRlbVxufVxuXG5leHBvcnQgdHlwZSBUb3dlckVmZmVjdCA9IChcbiAgZ2FtZTogR2FtZSxcbiAgdG93ZXI6IFRvd2VyTGV2ZWwsXG4gIGVuZW15OiBlbmVteS5FbmVteVxuKSA9PiB1bmtub3duXG4iLCAiaW1wb3J0ICogYXMgdG93ZXIgZnJvbSBcIi4vdG93ZXJcIlxuaW1wb3J0ICogYXMgc3BhY2UgZnJvbSBcIi4vc3BhY2VcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYm9udXNcIlxuaW1wb3J0ICogYXMgcG93ZXIgZnJvbSBcIi4vcG93ZXJcIlxuXG5leHBvcnQgY29uc3Qgc2hvcFdpZHRoID0gMTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3Rpb24oKTogdG93ZXIuQmFzZVRvd2VyIHwgdW5kZWZpbmVkIHtcbiAgLy8gfCBib251cy5Cb251cyB8IHBvd2VyLlBvd2VyXG4gIGlmIChtb3VzZVggPCB3aWR0aCAtIHNob3BXaWR0aCkgcmV0dXJuIHVuZGVmaW5lZFxuICByZXR1cm4gdG93ZXIudG93ZXJzW01hdGguZmxvb3IobW91c2VZIC8gc2hvcFdpZHRoKV0gPz8gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KHNlbGVjdGVkPzogdG93ZXIuQmFzZVRvd2VyKSB7XG4gIGRyYXdUb3dlcnMoc2VsZWN0ZWQpXG4gIGRyYXdQb3dlcnMoKVxuICBkcmF3Qm9udXNlcygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3VG93ZXJzKHNlbGVjdGVkPzogdG93ZXIuQmFzZVRvd2VyKSB7XG4gIG5vU3Ryb2tlKClcbiAgZmlsbCgyMClcbiAgcmVjdChcbiAgICB3aWR0aCAtIHNob3BXaWR0aCxcbiAgICAwLFxuICAgIHNob3BXaWR0aCxcbiAgICBzaG9wV2lkdGggKiB0b3dlci50b3dlcnMubGVuZ3RoLFxuICAgIHNob3BXaWR0aCAvIDRcbiAgKVxuXG4gIHRvd2VyLnRvd2Vycy5mb3JFYWNoKChiYXNlLCBpKSA9PiB7XG4gICAgYmFzZVswXS5zcHJpdGUoXG4gICAgICAwLFxuICAgICAgW1xuICAgICAgICB3aWR0aCAtIHNob3BXaWR0aCAvIDIgLSBzcGFjZS5ib3hTaXplWzBdIC8gMixcbiAgICAgICAgc2hvcFdpZHRoIC8gMiAtIHNwYWNlLmJveFNpemVbMV0gLyAyICsgaSAqIHNob3BXaWR0aCxcbiAgICAgIF0sXG4gICAgICBzZWxlY3RlZCA9PT0gYmFzZVxuICAgIClcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdCb251c2VzKCkge31cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdQb3dlcnMoKSB7fVxuIiwgImV4cG9ydCBjbGFzcyBCdWZmQWJsZTxWYWx1ZT4ge1xuICBwdWJsaWMgdmFsdWU6IFZhbHVlXG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluaXRpYWxWYWx1ZTogVmFsdWUpIHtcbiAgICB0aGlzLnZhbHVlID0gaW5pdGlhbFZhbHVlXG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5pbml0aWFsVmFsdWVcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnVmZkFibGVOdW1iZXIgZXh0ZW5kcyBCdWZmQWJsZTxudW1iZXI+IHtcbiAgZ2V0IHJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlIC8gdGhpcy5pbml0aWFsVmFsdWVcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIHRvd2VyIGZyb20gXCIuL2FwcC90b3dlclwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuaW1wb3J0ICogYXMgc2hvcCBmcm9tIFwiLi9hcHAvc2hvcFwiXG5pbXBvcnQgKiBhcyBidWZmIGZyb20gXCIuL2FwcC9idWZmXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIHNjb3JlID0gMFxuICBtb25leSA9IDEwMFxuICB0aW1lID0gMFxuXG4gIGxpZmUgPSBuZXcgYnVmZi5CdWZmQWJsZU51bWJlcigyMClcbiAgZGFtYWdlID0gbmV3IGJ1ZmYuQnVmZkFibGVOdW1iZXIoMSlcblxuICBib251c2VzOiBib251cy5Cb251c1tdID0gW11cbiAgcG93ZXJzOiBwb3dlci5Qb3dlcltdID0gW11cblxuICBzZWxlY3RlZFRvd2VyPzogdG93ZXIuQmFzZVRvd2VyXG4gIHByZXNzZWRBdD86IHNwYWNlLlZlY3RvclxuXG4gIHByaXZhdGUgbGFzdFRpbWVHaXZlbiA9IERhdGUubm93KClcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzcGFjZS5ib2FyZC5jbGVhcigpXG4gIH1cblxuICB1cGRhdGUoaW5mbzogY2xvY2suVGltZUluZm8pIHt9XG5cbiAgZHJhdygpIHtcbiAgICBiYWNrZ3JvdW5kKDApXG5cbiAgICBkcmF3Qm9hcmQoKVxuICAgIC8vZHJhd1NwYXduKClcbiAgICBkcmF3U2VsZWN0aW9uUmVjdCgpXG4gICAgZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKClcblxuICAgIHNob3AuZHJhdyh0aGlzLnNlbGVjdGVkVG93ZXIpXG4gIH1cblxuICBrZXlQcmVzc2VkKCkge31cblxuICBrZXlSZWxlYXNlZCgpIHt9XG5cbiAgbW91c2VQcmVzc2VkKCkge1xuICAgIHRoaXMucHJlc3NlZEF0ID0gc3BhY2UuYm9hcmRTdGlja3lNb3VzZSgpXG4gIH1cblxuICBtb3VzZVJlbGVhc2VkKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHNob3AuZ2V0U2VsZWN0aW9uKClcblxuICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUb3dlciA9IHNlbGVjdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxlYXNlZEF0ID0gc3BhY2UuYm9hcmRTdGlja3lNb3VzZSgpXG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5wcmVzc2VkQXQ/LnRvU3RyaW5nKCkgPT09IHJlbGVhc2VkQXQudG9TdHJpbmcoKSAmJlxuICAgICAgICB0aGlzLnNlbGVjdGVkVG93ZXJcbiAgICAgICkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIXNwYWNlXG4gICAgICAgICAgICAuYXJyYXlCb2FyZCgpXG4gICAgICAgICAgICAuc29tZSgoaXRlbSkgPT5cbiAgICAgICAgICAgICAgc3BhY2UuaXNTdXBlcmltcG9zZWQoXG4gICAgICAgICAgICAgICAgc3BhY2Uuc3VyZmFjZShyZWxlYXNlZEF0KSxcbiAgICAgICAgICAgICAgICBzcGFjZS5zdXJmYWNlKGl0ZW0ucG9zaXRpb24pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgc3BhY2UuYm9hcmQuYWRkKFxuICAgICAgICAgICAgbmV3IHRvd2VyLlRvd2VyKHRoaXMsIHNwYWNlLmJvYXJkU3RpY2t5TW91c2UoKSwgdGhpcy5zZWxlY3RlZFRvd2VyKVxuICAgICAgICAgIClcbiAgICAgICAgICAvL2RlbGV0ZSB0aGlzLnNlbGVjdGVkVG93ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoKSB7XG4gIHN0cm9rZSg1MClcbiAgc3Ryb2tlV2VpZ2h0KDIpXG4gIGZpbGwoMjApXG4gIHJlY3QoLi4uc3BhY2UuYm9hcmRQb3NpdGlvbigpLCAuLi5zcGFjZS5ib2FyZFNpemUpXG59XG5cbi8vIGZ1bmN0aW9uIGRyYXdTcGF3bigpIHtcbi8vICAgbm9TdHJva2UoKVxuLy8gICBmaWxsKDUwKVxuLy8gICByZWN0KC4uLnNwYWNlLnNwYXduWm9uZSgpKVxuLy8gfVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDQwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkU3RpY2t5TW91c2UoKSwgLi4uc3BhY2UuYm94U2l6ZSlcbn1cblxuZnVuY3Rpb24gZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKCkge1xuICBzcGFjZVxuICAgIC5hcnJheUJvYXJkKClcbiAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxuICAgICAgc3BhY2UuaXNEaXNwbGF5YWJsZShpdGVtKVxuICAgIClcbiAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5kcmF3KCkpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNBTyxNQUFNLGVBQWU7QUFFckIsTUFBTSxPQUFpQjtBQUFBLElBQzVCLFVBQVUsS0FBSyxRQUFRO0FBQUEsSUFDdkIsY0FBYztBQUFBO0FBUVQsa0JBQThDO0FBQ25ELFFBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQzdDLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssV0FBVyxLQUFLO0FBQ3JCLFdBQUs7QUFDTCw0QkFBc0IsS0FBSyxLQUFLO0FBQUE7QUFBQTs7O0FDakI3QixNQUFNLFFBQVEsSUFBSTtBQUNsQixNQUFNLFVBQWtCLENBQUMsSUFBSTtBQUM3QixNQUFNLGFBQXFCLENBQUMsSUFBSTtBQUNoQyxNQUFNLFlBQW9CO0FBQUEsSUFDL0IsUUFBUSxLQUFLLFdBQVc7QUFBQSxJQUN4QixRQUFRLEtBQUssV0FBVztBQUFBO0FBd0JuQiwyQkFBaUM7QUFDdEMsV0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLFVBQVUsS0FBSyxHQUFHLFNBQVMsSUFBSSxVQUFVLEtBQUs7QUFBQTtBQUdwRSx3QkFBc0I7QUFDM0IsV0FBTyxDQUFDLEdBQUc7QUFBQTtBQUtOLGtCQUFnQixHQUFt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
