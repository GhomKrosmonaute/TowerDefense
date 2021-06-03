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
    return mult(floor(div(v, boxSize)), boxSize);
  }
  function mouse() {
    return [mouseX, mouseY];
  }
  function boardMouse() {
    return sticky(max(min(mouse(), sub(add(boardPosition(), boardSize), [1, 1])), boardPosition()));
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
      arrayBoard().filter((item) => isDisplayable(item)).sort((a, b) => a.zIndex - b.zIndex).forEach((item) => item.draw());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICByZXNpemVDYW52YXMod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodClcbn1cbiIsICJleHBvcnQgY29uc3QgdGlja0ludGVydmFsID0gMTAwXG5cbmV4cG9ydCBjb25zdCBpbmZvOiBUaW1lSW5mbyA9IHtcbiAgbGFzdFRpY2s6IERhdGUubm93KCkgLSB0aWNrSW50ZXJ2YWwsXG4gIGdhbWVEdXJhdGlvbjogMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lSW5mbyB7XG4gIGxhc3RUaWNrOiBudW1iZXJcbiAgZ2FtZUR1cmF0aW9uOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2sodGhpczogKGluZm86IFRpbWVJbmZvKSA9PiB2b2lkKSB7XG4gIGlmIChpbmZvLmxhc3RUaWNrID4gRGF0ZS5ub3coKSArIHRpY2tJbnRlcnZhbCkge1xuICAgIGluZm8uZ2FtZUR1cmF0aW9uICs9IHRpY2tJbnRlcnZhbFxuICAgIGluZm8ubGFzdFRpY2sgPSBEYXRlLm5vdygpXG4gICAgdGhpcyhpbmZvKVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpXG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgYm9hcmQgPSBuZXcgU2V0PFBvc2l0aW9uYWJsZT4oKVxuZXhwb3J0IGNvbnN0IGJveFNpemU6IFZlY3RvciA9IFs0OCwgNDhdXG5leHBvcnQgY29uc3QgYm9hcmRCb3hlczogVmVjdG9yID0gWzE1LCAxMF1cbmV4cG9ydCBjb25zdCBib2FyZFNpemU6IFZlY3RvciA9IFtcbiAgYm94U2l6ZVswXSAqIGJvYXJkQm94ZXNbMF0sXG4gIGJveFNpemVbMV0gKiBib2FyZEJveGVzWzFdLFxuXVxuXG5leHBvcnQgZnVuY3Rpb24gYm9hcmRQb3NpdGlvbigpOiBWZWN0b3Ige1xuICByZXR1cm4gc3RpY2t5KFt3aWR0aCAvIDIgLSBib2FyZFNpemVbMF0gLyAyLCBoZWlnaHQgLyAyIC0gYm9hcmRTaXplWzFdIC8gMl0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJvYXJkKCkge1xuICByZXR1cm4gWy4uLmJvYXJkXVxufVxuXG5leHBvcnQgdHlwZSBWZWN0b3IgPSBbeDogbnVtYmVyLCB5OiBudW1iZXJdXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGlja3kodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIG11bHQoZmxvb3IoZGl2KHYsIGJveFNpemUpKSwgYm94U2l6ZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlKCk6IFZlY3RvciB7XG4gIHJldHVybiBbbW91c2VYLCBtb3VzZVldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBib2FyZE1vdXNlKCk6IFZlY3RvciB7XG4gIHJldHVybiBzdGlja3koXG4gICAgbWF4KFxuICAgICAgbWluKG1vdXNlKCksIHN1YihhZGQoYm9hcmRQb3NpdGlvbigpLCBib2FyZFNpemUpLCBbMSwgMV0pKSxcbiAgICAgIGJvYXJkUG9zaXRpb24oKVxuICAgIClcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWluKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW01hdGgubWluKHYxWzBdLCB2MlswXSksIE1hdGgubWluKHYxWzFdLCB2MlsxXSldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXgodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5tYXgodjFbMF0sIHYyWzBdKSwgTWF0aC5tYXgodjFbMV0sIHYyWzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZCh2MTogVmVjdG9yLCB2MjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFt2MVswXSArIHYyWzBdLCB2MVsxXSArIHYyWzFdXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gW3YxWzBdIC0gdjJbMF0sIHYxWzFdIC0gdjJbMV1dXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXYodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gLyB2MlswXSwgdjFbMV0gLyB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG11bHQodjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbdjFbMF0gKiB2MlswXSwgdjFbMV0gKiB2MlsxXV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsb29yKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gIHJldHVybiBbTWF0aC5mbG9vcih2WzBdKSwgTWF0aC5mbG9vcih2WzFdKV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKHBvc2l0aW9uOiBWZWN0b3IpOiBWZWN0b3Ige1xuICByZXR1cm4gYWRkKHBvc2l0aW9uLCBbMCwgMF0pXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25hYmxlIHtcbiAgZ3JpZFNsYXZlOiBib29sZWFuXG4gIHBvc2l0aW9uOiBWZWN0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0KFxuICBhdDogVmVjdG9yLFxuICBncmlkU2xhdmU/OiBib29sZWFuXG4pOiBQb3NpdGlvbmFibGUgfCB1bmRlZmluZWQge1xuICByZXR1cm4gYXJyYXlCb2FyZCgpLmZpbmQoXG4gICAgKGl0ZW0pID0+XG4gICAgICAoZ3JpZFNsYXZlID09PSB1bmRlZmluZWQgfHwgaXRlbS5ncmlkU2xhdmUgPT09IGdyaWRTbGF2ZSkgJiZcbiAgICAgIGl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gYXQudG9TdHJpbmcoKVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdChpdGVtOiBQb3NpdGlvbmFibGUpIHtcbiAgaWYgKGl0ZW0uZ3JpZFNsYXZlKVxuICAgIGFycmF5Qm9hcmQoKS5mb3JFYWNoKChib2FyZEl0ZW0pID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgYm9hcmRJdGVtLmdyaWRTbGF2ZSAmJlxuICAgICAgICBib2FyZEl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSA9PT0gaXRlbS5wb3NpdGlvbi50b1N0cmluZygpXG4gICAgICApIHtcbiAgICAgICAgYm9hcmQuZGVsZXRlKGJvYXJkSXRlbSlcbiAgICAgIH1cbiAgICB9KVxuXG4gIGJvYXJkLmFkZChpdGVtKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyB3ZWFwb24gZnJvbSBcIi4vYXBwL3dlYXBvblwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgbGlmZSA9IDIwXG4gIG1vbmV5ID0gMTAwXG4gIHRpbWUgPSAwXG4gIGJvbnVzZXMgPSBbXVxuXG4gIHByaXZhdGUgbGFzdFRpbWVHaXZlbiA9IERhdGUubm93KClcblxuICBnZXQgZGFtYWdlTXVsdGlwbGllcigpOiBudW1iZXIge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzcGFjZS5ib2FyZC5jbGVhcigpXG4gIH1cblxuICBidXlXZWFwb24oKSB7fVxuXG4gIHVwZ3JhZGVXZWFwb24oaXRlbTogd2VhcG9uLldlYXBvbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5leHRMZXZlbCA9IGl0ZW0uYmFzZVtpdGVtLmxldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5tb25leSAtPSBuZXh0TGV2ZWwuY29zdFxuICAgIGl0ZW0ubGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoaW5mbzogY2xvY2suVGltZUluZm8pIHt9XG5cbiAgZHJhdygpIHtcbiAgICBiYWNrZ3JvdW5kKDApXG5cbiAgICBkcmF3Qm9hcmQoKVxuICAgIGRyYXdTZWxlY3Rpb25SZWN0KClcblxuICAgIHNwYWNlXG4gICAgICAuYXJyYXlCb2FyZCgpXG4gICAgICAuZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzcGFjZS5Qb3NpdGlvbmFibGUgJiBzcGFjZS5EaXNwbGF5YWJsZSA9PlxuICAgICAgICBzcGFjZS5pc0Rpc3BsYXlhYmxlKGl0ZW0pXG4gICAgICApXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAgIC5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLmRyYXcoKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U2VsZWN0aW9uUmVjdCgpIHtcbiAgbm9TdHJva2UoKVxuICBmaWxsKDQwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkTW91c2UoKSwgLi4uc3BhY2UuYm94U2l6ZSlcbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICBzdHJva2UoNTApXG4gIHN0cm9rZVdlaWdodCgyKVxuICBmaWxsKDIwKVxuICByZWN0KC4uLnNwYWNlLmJvYXJkUG9zaXRpb24oKSwgLi4uc3BhY2UuYm9hcmRTaXplKVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNBTyxNQUFNLGVBQWU7QUFFckIsTUFBTSxPQUFpQjtBQUFBLElBQzVCLFVBQVUsS0FBSyxRQUFRO0FBQUEsSUFDdkIsY0FBYztBQUFBO0FBUVQsa0JBQThDO0FBQ25ELFFBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxjQUFjO0FBQzdDLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssV0FBVyxLQUFLO0FBQ3JCLFdBQUs7QUFDTCw0QkFBc0IsS0FBSyxLQUFLO0FBQUE7QUFBQTs7O0FDakI3QixNQUFNLFFBQVEsSUFBSTtBQUNsQixNQUFNLFVBQWtCLENBQUMsSUFBSTtBQUM3QixNQUFNLGFBQXFCLENBQUMsSUFBSTtBQUNoQyxNQUFNLFlBQW9CO0FBQUEsSUFDL0IsUUFBUSxLQUFLLFdBQVc7QUFBQSxJQUN4QixRQUFRLEtBQUssV0FBVztBQUFBO0FBR25CLDJCQUFpQztBQUN0QyxXQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksVUFBVSxLQUFLLEdBQUcsU0FBUyxJQUFJLFVBQVUsS0FBSztBQUFBO0FBR3BFLHdCQUFzQjtBQUMzQixXQUFPLENBQUMsR0FBRztBQUFBO0FBS04sa0JBQWdCLEdBQW1CO0FBQ3hDLFdBQU8sS0FBSyxNQUFNLElBQUksR0FBRyxXQUFXO0FBQUE7QUFHL0IsbUJBQXlCO0FBQzlCLFdBQU8sQ0FBQyxRQUFRO0FBQUE7QUFHWCx3QkFBOEI7QUFDbkMsV0FBTyxPQUNMLElBQ0UsSUFBSSxTQUFTLElBQUksSUFBSSxpQkFBaUIsWUFBWSxDQUFDLEdBQUcsTUFDdEQ7QUFBQTtBQUtDLGVBQWEsSUFBWSxJQUFvQjtBQUNsRCxXQUFPLENBQUMsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHO0FBQUE7QUFHOUMsZUFBYSxJQUFZLElBQW9CO0FBQ2xELFdBQU8sQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUc7QUFBQTtBQUc5QyxlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixlQUFhLElBQVksSUFBb0I7QUFDbEQsV0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUc7QUFBQTtBQUc3QixnQkFBYyxJQUFZLElBQW9CO0FBQ25ELFdBQU8sQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHO0FBQUE7QUFHN0IsaUJBQWUsR0FBbUI7QUFDdkMsV0FBTyxDQUFDLEtBQUssTUFBTSxFQUFFLEtBQUssS0FBSyxNQUFNLEVBQUU7QUFBQTtBQTBDbEMseUJBQXVCLE1BQW1DO0FBQy9ELFdBQU8sWUFBWSxRQUFRLFVBQVU7QUFBQTs7O0FDakd2QyxtQkFBMEI7QUFBQSxJQVl4QixjQUFjO0FBWGQsa0JBQU87QUFDUCxtQkFBUTtBQUNSLGtCQUFPO0FBQ1AscUJBQVU7QUFFRiwyQkFBZ0IsS0FBSztBQU8zQixNQUFNLE1BQU07QUFBQTtBQUFBLFFBTFYsbUJBQTJCO0FBQzdCLGFBQU87QUFBQTtBQUFBLElBT1QsWUFBWTtBQUFBO0FBQUEsSUFFWixjQUFjLE1BQThCO0FBQzFDLFlBQU0sWUFBWSxLQUFLLEtBQUssS0FBSyxRQUFRO0FBQ3pDLFVBQUksQ0FBQztBQUFXLGVBQU87QUFDdkIsV0FBSyxTQUFTLFVBQVU7QUFDeEIsV0FBSztBQUNMLGFBQU87QUFBQTtBQUFBLElBR1QsT0FBTyxPQUFzQjtBQUFBO0FBQUEsSUFFN0IsT0FBTztBQUNMLGlCQUFXO0FBRVg7QUFDQTtBQUVBLE1BQ0csYUFDQSxPQUFPLENBQUMsU0FDUCxBQUFNLGNBQWMsT0FFckIsS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUM1QixRQUFRLENBQUMsU0FBUyxLQUFLO0FBQUE7QUFBQTtBQXhDOUIsTUFBTyxlQUFQO0FBNENBLCtCQUE2QjtBQUMzQjtBQUNBLFNBQUs7QUFDTCxTQUFLLEdBQUcsQUFBTSxjQUFjLEdBQVM7QUFBQTtBQUd2Qyx1QkFBcUI7QUFDbkIsV0FBTztBQUNQLGlCQUFhO0FBQ2IsU0FBSztBQUNMLFNBQUssR0FBRyxBQUFNLGlCQUFpQixHQUFTO0FBQUE7OztBSHJEMUMsV0FBUyxpQkFBaUIsZUFBZSxDQUFDLFVBQVUsTUFBTTtBQUUxRCxNQUFJO0FBRUcsbUJBQWlCO0FBQ3RCLGlCQUNFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixhQUFhLE9BQU8sY0FBYyxJQUNwRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsY0FBYyxPQUFPLGVBQWU7QUFHeEUsV0FBTyxJQUFJO0FBRVgsSUFBTSxLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUs7QUFBQTtBQUc1QixrQkFBZ0I7QUFDckIsU0FBSztBQUFBO0FBR0Esd0JBQXNCO0FBQUE7QUFDdEIseUJBQXVCO0FBQUE7QUFFdkIsMkJBQXlCO0FBQzlCLGlCQUFhLGFBQWE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
