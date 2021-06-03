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
    setup: () => setup
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
  var boardBoxes = [20, 20];
  var boardSize = [
    boxSize[0] * boardBoxes[0],
    boxSize[1] * boardBoxes[1]
  ];
  function arrayBoard() {
    return [...board];
  }
  function sticky(v) {
    return sub(floor(div(v, boxSize)), boxSize);
  }
  function mouse() {
    return [mouseX, mouseY];
  }
  function sub(v1, v2) {
    return [v1[0] * v2[0], v1[1] * v2[1]];
  }
  function div(v1, v2) {
    return [v1[0] / v2[0], v1[1] / v2[1]];
  }
  function floor(v) {
    return [Math.floor(v[0]), Math.floor(v[1])];
  }
  function isDisplayable(item) {
    return "zIndex" in item && "draw" in item;
  }

  // src/game.ts
  var Game = class {
    constructor() {
      this.life = 20;
      this.money = 100;
      this.time = 0;
      this.bonuses = [];
      this.lastTimeGiven = Date.now();
      board.clear();
    }
    get damageMultiplier() {
      return 1;
    }
    buyWeapon() {
    }
    upgradeWeapon(item) {
      const nextLevel = item.base[item.level + 1];
      if (!nextLevel)
        return false;
      this.money -= nextLevel.cost;
      item.level++;
      return true;
    }
    update(info2) {
    }
    draw() {
      drawSelectionRect();
      arrayBoard().filter((item) => isDisplayable(item)).sort((a, b) => a.zIndex - b.zIndex).forEach((item) => item.draw());
    }
  };
  var game_default = Game;
  function drawSelectionRect() {
    background(0);
    fill(20);
    rect(...sticky(mouse()), ...boxSize);
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
  }
  function keyReleased() {
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG4iLCAiZXhwb3J0IGNvbnN0IHRpY2tJbnRlcnZhbCA9IDEwMFxuXG5leHBvcnQgY29uc3QgaW5mbzogVGltZUluZm8gPSB7XG4gIGxhc3RUaWNrOiBEYXRlLm5vdygpIC0gdGlja0ludGVydmFsLFxuICBnYW1lRHVyYXRpb246IDAsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUluZm8ge1xuICBsYXN0VGljazogbnVtYmVyXG4gIGdhbWVEdXJhdGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWNrKHRoaXM6IChpbmZvOiBUaW1lSW5mbykgPT4gdm9pZCkge1xuICBpZiAoaW5mby5sYXN0VGljayA+IERhdGUubm93KCkgKyB0aWNrSW50ZXJ2YWwpIHtcbiAgICBpbmZvLmdhbWVEdXJhdGlvbiArPSB0aWNrSW50ZXJ2YWxcbiAgICBpbmZvLmxhc3RUaWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMoaW5mbylcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljay5iaW5kKHRoaXMpKVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGJvYXJkID0gbmV3IFNldDxQb3NpdGlvbmFibGU+KClcbmV4cG9ydCBjb25zdCBib3hTaXplOiBWZWN0b3IgPSBbNDgsIDQ4XVxuZXhwb3J0IGNvbnN0IGJvYXJkUG9zaXRpb246IFZlY3RvciA9IFswLCAwXVxuZXhwb3J0IGNvbnN0IGJvYXJkQm94ZXM6IFZlY3RvciA9IFsyMCwgMjBdXG5leHBvcnQgY29uc3QgYm9hcmRTaXplOiBWZWN0b3IgPSBbXG4gIGJveFNpemVbMF0gKiBib2FyZEJveGVzWzBdLFxuICBib3hTaXplWzFdICogYm9hcmRCb3hlc1sxXSxcbl1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Qm9hcmQoKSB7XG4gIHJldHVybiBbLi4uYm9hcmRdXG59XG5cbmV4cG9ydCB0eXBlIFZlY3RvciA9IFt4OiBudW1iZXIsIHk6IG51bWJlcl1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gc3ViKGZsb29yKGRpdih2LCBib3hTaXplKSksIGJveFNpemUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gW21vdXNlWCwgbW91c2VZXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRNb3VzZSgpOiBWZWN0b3Ige1xuICByZXR1cm4gYWRkKG1vdXNlKCksIGJvYXJkUG9zaXRpb24pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKyB2MlswXSwgdjFbMV0gKyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Yih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAqIHYyWzBdLCB2MVsxXSAqIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGl2KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC8gdjJbMF0sIHYxWzFdIC8gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGguZmxvb3IodlswXSksIE1hdGguZmxvb3IodlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZChwb3NpdGlvbiwgWzAsIDBdKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdChcbiAgYXQ6IFZlY3RvcixcbiAgZ3JpZFNsYXZlPzogYm9vbGVhblxuKTogUG9zaXRpb25hYmxlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maW5kKFxuICAgIChpdGVtKSA9PlxuICAgICAgKGdyaWRTbGF2ZSA9PT0gdW5kZWZpbmVkIHx8IGl0ZW0uZ3JpZFNsYXZlID09PSBncmlkU2xhdmUpICYmXG4gICAgICBpdGVtLnBvc2l0aW9uLnRvU3RyaW5nKCkgPT09IGF0LnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QXQoaXRlbTogUG9zaXRpb25hYmxlKSB7XG4gIGlmIChpdGVtLmdyaWRTbGF2ZSlcbiAgICBhcnJheUJvYXJkKCkuZm9yRWFjaCgoYm9hcmRJdGVtKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGJvYXJkSXRlbS5ncmlkU2xhdmUgJiZcbiAgICAgICAgYm9hcmRJdGVtLnBvc2l0aW9uLnRvU3RyaW5nKCkgPT09IGl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKVxuICAgICAgKSB7XG4gICAgICAgIGJvYXJkLmRlbGV0ZShib2FyZEl0ZW0pXG4gICAgICB9XG4gICAgfSlcblxuICBib2FyZC5hZGQoaXRlbSlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEaXNwbGF5YWJsZSB7XG4gIHpJbmRleDogbnVtYmVyXG4gIGRyYXcoKTogdW5rbm93blxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXNwbGF5YWJsZShpdGVtOiBvYmplY3QpOiBpdGVtIGlzIERpc3BsYXlhYmxlIHtcbiAgcmV0dXJuIFwiekluZGV4XCIgaW4gaXRlbSAmJiBcImRyYXdcIiBpbiBpdGVtXG59XG4iLCAiaW1wb3J0ICogYXMgd2VhcG9uIGZyb20gXCIuL2FwcC93ZWFwb25cIlxuaW1wb3J0ICogYXMgcG93ZXIgZnJvbSBcIi4vYXBwL3Bvd2VyXCJcbmltcG9ydCAqIGFzIGJvbnVzIGZyb20gXCIuL2FwcC9ib251c1wiXG5pbXBvcnQgKiBhcyBzcGFjZSBmcm9tIFwiLi9hcHAvc3BhY2VcIlxuaW1wb3J0ICogYXMgY2xvY2sgZnJvbSBcIi4vYXBwL2Nsb2NrXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG4gIGxpZmUgPSAyMFxuICBtb25leSA9IDEwMFxuICB0aW1lID0gMFxuICBib251c2VzID0gW11cblxuICBwcml2YXRlIGxhc3RUaW1lR2l2ZW4gPSBEYXRlLm5vdygpXG5cbiAgZ2V0IGRhbWFnZU11bHRpcGxpZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3BhY2UuYm9hcmQuY2xlYXIoKVxuICB9XG5cbiAgYnV5V2VhcG9uKCkge31cblxuICB1cGdyYWRlV2VhcG9uKGl0ZW06IHdlYXBvbi5XZWFwb24pOiBib29sZWFuIHtcbiAgICBjb25zdCBuZXh0TGV2ZWwgPSBpdGVtLmJhc2VbaXRlbS5sZXZlbCArIDFdXG4gICAgaWYgKCFuZXh0TGV2ZWwpIHJldHVybiBmYWxzZVxuICAgIHRoaXMubW9uZXkgLT0gbmV4dExldmVsLmNvc3RcbiAgICBpdGVtLmxldmVsKytcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdXBkYXRlKGluZm86IGNsb2NrLlRpbWVJbmZvKSB7fVxuXG4gIGRyYXcoKSB7XG4gICAgZHJhd1NlbGVjdGlvblJlY3QoKVxuICAgIFxuICAgIHNwYWNlXG4gICAgICAuYXJyYXlCb2FyZCgpXG4gICAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxuICAgICAgICBzcGFjZS5pc0Rpc3BsYXlhYmxlKGl0ZW0pXG4gICAgICApXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAgIC5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmRyYXcoKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgYmFja2dyb3VuZCgwKVxuICBmaWxsKDIwKVxuICByZWN0KC4uLnNwYWNlLnN0aWNreShzcGFjZS5tb3VzZSgpKSwgLi4uc3BhY2UuYm94U2l6ZSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FPLE1BQU0sZUFBZTtBQUVyQixNQUFNLE9BQWlCO0FBQUEsSUFDNUIsVUFBVSxLQUFLLFFBQVE7QUFBQSxJQUN2QixjQUFjO0FBQUE7QUFRVCxrQkFBOEM7QUFDbkQsUUFBSSxLQUFLLFdBQVcsS0FB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
