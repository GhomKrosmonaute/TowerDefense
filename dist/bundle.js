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
  function boardMouse() {
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
      background(0);
      drawBoard();
      drawSelectionRect();
      drawPositionableItems();
    }
  };
  var game_default = Game;
  function drawSelectionRect() {
    noStroke();
    fill(40);
    rect(...boardMouse(), ...boxSize);
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
  }
  function keyReleased() {
  }
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICByZXNpemVDYW52YXMod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodClcbn1cbiIsICJleHBvcnQgY29uc3QgdGlja0ludGVydmFsID0gMTAwXG5cbmV4cG9ydCBjb25zdCBpbmZvOiBUaW1lSW5mbyA9IHtcbiAgbGFzdFRpY2s6IERhdGUubm93KCkgLSB0aWNrSW50ZXJ2YWwsXG4gIGdhbWVEdXJhdGlvbjogMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lSW5mbyB7XG4gIGxhc3RUaWNrOiBudW1iZXJcbiAgZ2FtZUR1cmF0aW9uOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2sodGhpczogKGluZm86IFRpbWVJbmZvKSA9PiB2b2lkKSB7XG4gIGlmIChpbmZvLmxhc3RUaWNrID4gRGF0ZS5ub3coKSArIHRpY2tJbnRlcnZhbCkge1xuICAgIGluZm8uZ2FtZUR1cmF0aW9uICs9IHRpY2tJbnRlcnZhbFxuICAgIGluZm8ubGFzdFRpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcyhpbmZvKVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgYm9hcmQgPSBuZXcgU2V0PFBvc2l0aW9uYWJsZT4oKVxuZXhwb3J0IGNvbnN0IGJveFNpemU6IFZlY3RvciA9IFs0OCwgNDhdXG5leHBvcnQgY29uc3QgYm9hcmRCb3hlczogVmVjdG9yID0gWzE1LCAxMF1cbmV4cG9ydCBjb25zdCBib2FyZFNpemU6IFZlY3RvciA9IFtcbiAgYm94U2l6ZVswXSAqIGJvYXJkQm94ZXNbMF0sXG4gIGJveFNpemVbMV0gKiBib2FyZEJveGVzWzFdLFxuXVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRQb3NpdGlvbigpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KFt3aWR0aCAvIDIgLSBib2FyZFNpemVbMF0gLyAyLCBoZWlnaHQgLyAyIC0gYm9hcmRTaXplWzFdIC8gMl0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJvYXJkKCkge1xuICByZXR1cm4gWy4uLmJvYXJkXVxufVxuXG5leHBvcnQgdHlwZSBWZWN0b3IgPSBbeDogbnVtYmVyLCB5OiBudW1iZXJdXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGlja3kodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIG11bHQoXG4gICAgZmxvb3IoZGl2KHN1Yih2LCBkaXYoYm94U2l6ZSwgWzMsIDNdKSksIGRpdihib3hTaXplLCBbMiwgMl0pKSksXG4gICAgZGl2KGJveFNpemUsIFsyLCAyXSlcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIFttb3VzZVgsIG1vdXNlWV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvYXJkTW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIHN0aWNreShcbiAgICBtYXgoXG4gICAgICBtaW4obW91c2UoKSwgc3ViKGFkZChib2FyZFBvc2l0aW9uKCksIGJvYXJkU2l6ZSksIGRpdihib3hTaXplLCBbMywgM10pKSksXG4gICAgICBhZGQoYm9hcmRQb3NpdGlvbigpLCBkaXYoYm94U2l6ZSwgWzMsIDNdKSlcbiAgICApXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLm1pbih2MVswXSwgdjJbMF0pLCBNYXRoLm1pbih2MVsxXSwgdjJbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGgubWF4KHYxWzBdLCB2MlswXSksIE1hdGgubWF4KHYxWzFdLCB2MlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKyB2MlswXSwgdjFbMV0gKyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Yih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAtIHYyWzBdLCB2MVsxXSAtIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGl2KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC8gdjJbMF0sIHYxWzFdIC8gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdWx0KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdICogdjJbMF0sIHYxWzFdICogdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGguZmxvb3IodlswXSksIE1hdGguZmxvb3IodlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZChwb3NpdGlvbiwgWzAsIDBdKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHcmlkU2xhdmVBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maW5kKFxuICAgIChpdGVtKSA9PlxuICAgICAgaXRlbS5ncmlkU2xhdmUgJiZcbiAgICAgIHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbXNBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlW10ge1xuICByZXR1cm4gYXJyYXlCb2FyZCgpLmZpbHRlcihcbiAgICAoaXRlbSkgPT4gc3RpY2t5KGl0ZW0ucG9zaXRpb24pLnRvU3RyaW5nKCkgPT09IHN0aWNreShhdCkudG9TdHJpbmcoKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZShpdGVtOiBQb3NpdGlvbmFibGUpIHtcbiAgaWYgKGl0ZW0uZ3JpZFNsYXZlKVxuICAgIGFycmF5Qm9hcmQoKS5mb3JFYWNoKChib2FyZEl0ZW0pID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgYm9hcmRJdGVtLmdyaWRTbGF2ZSAmJlxuICAgICAgICBib2FyZEl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gaXRlbS5wb3NpdGlvbi50b1N0cmluZygpXG4gICAgICApIHtcbiAgICAgICAgYm9hcmQuZGVsZXRlKGJvYXJkSXRlbSlcbiAgICAgIH1cbiAgICB9KVxuXG4gIGJvYXJkLmFkZChpdGVtKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyB3ZWFwb24gZnJvbSBcIi4vYXBwL3dlYXBvblwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgbGlmZSA9IDIwXG4gIG1vbmV5ID0gMTAwXG4gIHRpbWUgPSAwXG4gIGJvbnVzZXMgPSBbXVxuXG4gIHByaXZhdGUgbGFzdFRpbWVHaXZlbiA9IERhdGUubm93KClcblxuICBnZXQgZGFtYWdlTXVsdGlwbGllcigpOiBudW1iZXIge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzcGFjZS5ib2FyZC5jbGVhcigpXG4gIH1cblxuICBidXlXZWFwb24oKSB7fVxuXG4gIHVwZ3JhZGVXZWFwb24oaXRlbTogd2VhcG9uLldlYXBvbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5leHRMZXZlbCA9IGl0ZW0uYmFzZVtpdGVtLmxldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5tb25leSAtPSBuZXh0TGV2ZWwuY29zdFxuICAgIGl0ZW0ubGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoaW5mbzogY2xvY2suVGltZUluZm8pIHt9XG5cbiAgZHJhdygpIHtcbiAgICBiYWNrZ3JvdW5kKDApXG5cbiAgICBkcmF3Qm9hcmQoKVxuICAgIGRyYXdTZWxlY3Rpb25SZWN0KClcbiAgICBkcmF3UG9zaXRpb25hYmxlSXRlbXMoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdTZWxlY3Rpb25SZWN0KCkge1xuICBub1N0cm9rZSgpXG4gIGZpbGwoNDApXG4gIHJlY3QoLi4uc3BhY2UuYm9hcmRNb3VzZSgpLCAuLi5zcGFjZS5ib3hTaXplKVxufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoKSB7XG4gIHN0cm9rZSg1MClcbiAgc3Ryb2tlV2VpZ2h0KDIpXG4gIGZpbGwoMjApXG4gIHJlY3QoLi4uc3BhY2UuYm9hcmRQb3NpdGlvbigpLCAuLi5zcGFjZS5ib2FyZFNpemUpXG59XG5cbmZ1bmN0aW9uIGRyYXdQb3NpdGlvbmFibGVJdGVtcygpe1xuICBzcGFjZVxuICAgIC5hcnJheUJvYXJkKClcbiAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxuICAgICAgc3BhY2UuaXNEaXNwbGF5YWJsZShpdGVtKVxuICAgIClcbiAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAuZm9yRWFjaCgoaXRlbSkgPT4gaXRlbS5kcmF3KCkpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtB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
