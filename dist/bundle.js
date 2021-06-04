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
      this.score = 0;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICByZXNpemVDYW52YXMod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodClcbn1cbiIsICJleHBvcnQgY29uc3QgdGlja0ludGVydmFsID0gMTAwXG5cbmV4cG9ydCBjb25zdCBpbmZvOiBUaW1lSW5mbyA9IHtcbiAgbGFzdFRpY2s6IERhdGUubm93KCkgLSB0aWNrSW50ZXJ2YWwsXG4gIGdhbWVEdXJhdGlvbjogMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lSW5mbyB7XG4gIGxhc3RUaWNrOiBudW1iZXJcbiAgZ2FtZUR1cmF0aW9uOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2sodGhpczogKGluZm86IFRpbWVJbmZvKSA9PiB2b2lkKSB7XG4gIGlmIChpbmZvLmxhc3RUaWNrID4gRGF0ZS5ub3coKSArIHRpY2tJbnRlcnZhbCkge1xuICAgIGluZm8uZ2FtZUR1cmF0aW9uICs9IHRpY2tJbnRlcnZhbFxuICAgIGluZm8ubGFzdFRpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcyhpbmZvKVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgYm9hcmQgPSBuZXcgU2V0PFBvc2l0aW9uYWJsZT4oKVxuZXhwb3J0IGNvbnN0IGJveFNpemU6IFZlY3RvciA9IFs0OCwgNDhdXG5leHBvcnQgY29uc3QgYm9hcmRCb3hlczogVmVjdG9yID0gWzE1LCAxMF1cbmV4cG9ydCBjb25zdCBib2FyZFNpemU6IFZlY3RvciA9IFtcbiAgYm94U2l6ZVswXSAqIGJvYXJkQm94ZXNbMF0sXG4gIGJveFNpemVbMV0gKiBib2FyZEJveGVzWzFdLFxuXVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRQb3NpdGlvbigpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KFt3aWR0aCAvIDIgLSBib2FyZFNpemVbMF0gLyAyLCBoZWlnaHQgLyAyIC0gYm9hcmRTaXplWzFdIC8gMl0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJvYXJkKCkge1xuICByZXR1cm4gWy4uLmJvYXJkXVxufVxuXG5leHBvcnQgdHlwZSBWZWN0b3IgPSBbeDogbnVtYmVyLCB5OiBudW1iZXJdXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGlja3kodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIG11bHQoXG4gICAgZmxvb3IoZGl2KHN1Yih2LCBkaXYoYm94U2l6ZSwgWzMsIDNdKSksIGRpdihib3hTaXplLCBbMiwgMl0pKSksXG4gICAgZGl2KGJveFNpemUsIFsyLCAyXSlcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIFttb3VzZVgsIG1vdXNlWV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvYXJkTW91c2UoKTogVmVjdG9yIHtcbiAgcmV0dXJuIHN0aWNreShcbiAgICBtYXgoXG4gICAgICBtaW4obW91c2UoKSwgc3ViKGFkZChib2FyZFBvc2l0aW9uKCksIGJvYXJkU2l6ZSksIGRpdihib3hTaXplLCBbMywgM10pKSksXG4gICAgICBhZGQoYm9hcmRQb3NpdGlvbigpLCBkaXYoYm94U2l6ZSwgWzMsIDNdKSlcbiAgICApXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtNYXRoLm1pbih2MVswXSwgdjJbMF0pLCBNYXRoLm1pbih2MVsxXSwgdjJbMV0pXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGgubWF4KHYxWzBdLCB2MlswXSksIE1hdGgubWF4KHYxWzFdLCB2MlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKyB2MlswXSwgdjFbMV0gKyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Yih2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSAtIHYyWzBdLCB2MVsxXSAtIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGl2KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC8gdjJbMF0sIHYxWzFdIC8gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtdWx0KHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdICogdjJbMF0sIHYxWzFdICogdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbG9vcih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGguZmxvb3IodlswXSksIE1hdGguZmxvb3IodlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIGFkZChwb3NpdGlvbiwgWzAsIDBdKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uYWJsZSB7XG4gIGdyaWRTbGF2ZTogYm9vbGVhblxuICBwb3NpdGlvbjogVmVjdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHcmlkU2xhdmVBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGFycmF5Qm9hcmQoKS5maW5kKFxuICAgIChpdGVtKSA9PlxuICAgICAgaXRlbS5ncmlkU2xhdmUgJiZcbiAgICAgIHN0aWNreShpdGVtLnBvc2l0aW9uKS50b1N0cmluZygpID09PSBzdGlja3koYXQpLnRvU3RyaW5nKClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbXNBdChhdDogVmVjdG9yKTogUG9zaXRpb25hYmxlW10ge1xuICByZXR1cm4gYXJyYXlCb2FyZCgpLmZpbHRlcihcbiAgICAoaXRlbSkgPT4gc3RpY2t5KGl0ZW0ucG9zaXRpb24pLnRvU3RyaW5nKCkgPT09IHN0aWNreShhdCkudG9TdHJpbmcoKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZShpdGVtOiBQb3NpdGlvbmFibGUpIHtcbiAgaWYgKGl0ZW0uZ3JpZFNsYXZlKVxuICAgIGFycmF5Qm9hcmQoKS5mb3JFYWNoKChib2FyZEl0ZW0pID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgYm9hcmRJdGVtLmdyaWRTbGF2ZSAmJlxuICAgICAgICBib2FyZEl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gaXRlbS5wb3NpdGlvbi50b1N0cmluZygpXG4gICAgICApIHtcbiAgICAgICAgYm9hcmQuZGVsZXRlKGJvYXJkSXRlbSlcbiAgICAgIH1cbiAgICB9KVxuXG4gIGJvYXJkLmFkZChpdGVtKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyB3ZWFwb24gZnJvbSBcIi4vYXBwL3dlYXBvblwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgbGlmZSA9IDIwXG4gIG1vbmV5ID0gMTAwXG4gIHNjb3JlID0gMFxuICB0aW1lID0gMFxuICBib251c2VzID0gW11cblxuICBwcml2YXRlIGxhc3RUaW1lR2l2ZW4gPSBEYXRlLm5vdygpXG5cbiAgZ2V0IGRhbWFnZU11bHRpcGxpZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3BhY2UuYm9hcmQuY2xlYXIoKVxuICB9XG5cbiAgYnV5V2VhcG9uKCkge31cblxuICB1cGdyYWRlV2VhcG9uKGl0ZW06IHdlYXBvbi5XZWFwb24pOiBib29sZWFuIHtcbiAgICBjb25zdCBuZXh0TGV2ZWwgPSBpdGVtLmJhc2VbaXRlbS5sZXZlbCArIDFdXG4gICAgaWYgKCFuZXh0TGV2ZWwpIHJldHVybiBmYWxzZVxuICAgIHRoaXMubW9uZXkgLT0gbmV4dExldmVsLmNvc3RcbiAgICBpdGVtLmxldmVsKytcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdXBkYXRlKGluZm86IGNsb2NrLlRpbWVJbmZvKSB7fVxuXG4gIGRyYXcoKSB7XG4gICAgYmFja2dyb3VuZCgwKVxuXG4gICAgZHJhd0JvYXJkKClcbiAgICBkcmF3U2VsZWN0aW9uUmVjdCgpXG4gICAgZHJhd1Bvc2l0aW9uYWJsZUl0ZW1zKClcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDQwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkTW91c2UoKSwgLi4uc3BhY2UuYm94U2l6ZSlcbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICBzdHJva2UoNTApXG4gIHN0cm9rZVdlaWdodCgyKVxuICBmaWxsKDIwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkUG9zaXRpb24oKSwgLi4uc3BhY2UuYm9hcmRTaXplKVxufVxuXG5mdW5jdGlvbiBkcmF3UG9zaXRpb25hYmxlSXRlbXMoKSB7XG4gIHNwYWNlXG4gICAgLmFycmF5Qm9hcmQoKVxuICAgIC5maWx0ZXIoKGl0ZW0pOiBpdGVtIGlzIHNwYWNlLlBvc2l0aW9uYWJsZSAmIHNwYWNlLkRpc3BsYXlhYmxlID0+XG4gICAgICBzcGFjZS5pc0Rpc3BsYXlhYmxlKGl0ZW0pXG4gICAgKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgIC5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmRyYXcoKSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7O0FB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
