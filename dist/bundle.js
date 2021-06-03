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
  function sticky(position) {
    return [
      Math.floor(position[0] / boxSize[0]) * boxSize[0],
      Math.floor(position[1] / boxSize[1]) * boxSize[1]
    ];
  }
  function mouse() {
    return [mouseX, mouseY];
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
      fill(255);
      ellipse(...sticky(mouse()), ...boxSize);
      arrayBoard().filter((item) => isDisplayable(item)).sort((a, b) => a.zIndex - b.zIndex).forEach((item) => item.draw());
    }
  };
  var game_default = Game;

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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvY2xvY2sudHMiLCAic3JjL2FwcC9zcGFjZS50cyIsICJzcmMvZ2FtZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxubGV0IGdhbWU6IEdhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUgPSBuZXcgR2FtZSgpXG5cbiAgY2xvY2sudGljay5iaW5kKGdhbWUudXBkYXRlLmJpbmQoZ2FtZSkpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG4iLCAiZXhwb3J0IGNvbnN0IHRpY2tJbnRlcnZhbCA9IDEwMFxuXG5leHBvcnQgY29uc3QgaW5mbzogVGltZUluZm8gPSB7XG4gIGxhc3RUaWNrOiBEYXRlLm5vdygpIC0gdGlja0ludGVydmFsLFxuICBnYW1lRHVyYXRpb246IDAsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUluZm8ge1xuICBsYXN0VGljazogbnVtYmVyXG4gIGdhbWVEdXJhdGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWNrKHRoaXM6IChpbmZvOiBUaW1lSW5mbykgPT4gdm9pZCkge1xuICBpZiAoaW5mby5sYXN0VGljayA+IERhdGUubm93KCkgKyB0aWNrSW50ZXJ2YWwpIHtcbiAgICBpbmZvLmdhbWVEdXJhdGlvbiArPSB0aWNrSW50ZXJ2YWxcbiAgICBpbmZvLmxhc3RUaWNrID0gRGF0ZS5ub3coKVxuICAgIHRoaXMoaW5mbylcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljay5iaW5kKHRoaXMpKVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGJvYXJkID0gbmV3IFNldDxQb3NpdGlvbmFibGU+KClcbmV4cG9ydCBjb25zdCBib3hTaXplOiBWZWN0b3IgPSBbNDgsIDQ4XVxuZXhwb3J0IGNvbnN0IGJvYXJkQm94ZXM6IFZlY3RvciA9IFsyMCwgMjBdXG5leHBvcnQgY29uc3QgYm9hcmRTaXplOiBWZWN0b3IgPSBbXG4gIGJveFNpemVbMF0gKiBib2FyZEJveGVzWzBdLFxuICBib3hTaXplWzFdICogYm9hcmRCb3hlc1sxXSxcbl1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Qm9hcmQoKSB7XG4gIHJldHVybiBbLi4uYm9hcmRdXG59XG5cbmV4cG9ydCB0eXBlIFZlY3RvciA9IFt4OiBudW1iZXIsIHk6IG51bWJlcl1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0aWNreShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtcbiAgICBNYXRoLmZsb29yKHBvc2l0aW9uWzBdIC8gYm94U2l6ZVswXSkgKiBib3hTaXplWzBdLFxuICAgIE1hdGguZmxvb3IocG9zaXRpb25bMV0gLyBib3hTaXplWzFdKSAqIGJveFNpemVbMV0sXG4gIF1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlKCk6IFZlY3RvciB7XG4gIHJldHVybiBbbW91c2VYLCBtb3VzZVldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShwb3NpdGlvbjogVmVjdG9yKTogVmVjdG9yIHtcbiAgcmV0dXJuIFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV1dXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25hYmxlIHtcbiAgcG9zaXRpb246IFZlY3RvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXQoYXQ6IFZlY3Rvcik6IFBvc2l0aW9uYWJsZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBhcnJheUJvYXJkKCkuZmluZCgoaXRlbSkgPT4gaXRlbS5wb3NpdGlvbi50b1N0cmluZygpID09PSBhdC50b1N0cmluZygpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QXQoaXRlbTogUG9zaXRpb25hYmxlKSB7XG4gIGFycmF5Qm9hcmQoKS5mb3JFYWNoKChib2FyZEl0ZW0pID0+IHtcbiAgICBpZiAoYm9hcmRJdGVtLnBvc2l0aW9uLnRvU3RyaW5nKCkgPT09IGl0ZW0ucG9zaXRpb24udG9TdHJpbmcoKSkge1xuICAgICAgYm9hcmQuZGVsZXRlKGJvYXJkSXRlbSlcbiAgICB9XG4gIH0pXG4gIGJvYXJkLmFkZChpdGVtKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlhYmxlIHtcbiAgekluZGV4OiBudW1iZXJcbiAgZHJhdygpOiB1bmtub3duXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc3BsYXlhYmxlKGl0ZW06IG9iamVjdCk6IGl0ZW0gaXMgRGlzcGxheWFibGUge1xuICByZXR1cm4gXCJ6SW5kZXhcIiBpbiBpdGVtICYmIFwiZHJhd1wiIGluIGl0ZW1cbn1cbiIsICJpbXBvcnQgKiBhcyB3ZWFwb24gZnJvbSBcIi4vYXBwL3dlYXBvblwiXG5pbXBvcnQgKiBhcyBwb3dlciBmcm9tIFwiLi9hcHAvcG93ZXJcIlxuaW1wb3J0ICogYXMgYm9udXMgZnJvbSBcIi4vYXBwL2JvbnVzXCJcbmltcG9ydCAqIGFzIHNwYWNlIGZyb20gXCIuL2FwcC9zcGFjZVwiXG5pbXBvcnQgKiBhcyBjbG9jayBmcm9tIFwiLi9hcHAvY2xvY2tcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcbiAgbGlmZSA9IDIwXG4gIG1vbmV5ID0gMTAwXG4gIHRpbWUgPSAwXG4gIGJvbnVzZXMgPSBbXVxuXG4gIHByaXZhdGUgbGFzdFRpbWVHaXZlbiA9IERhdGUubm93KClcblxuICBnZXQgZGFtYWdlTXVsdGlwbGllcigpOiBudW1iZXIge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzcGFjZS5ib2FyZC5jbGVhcigpXG4gIH1cblxuICBidXlXZWFwb24oKSB7fVxuXG4gIHVwZ3JhZGVXZWFwb24oaXRlbTogd2VhcG9uLldlYXBvbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5leHRMZXZlbCA9IGl0ZW0uYmFzZVtpdGVtLmxldmVsICsgMV1cbiAgICBpZiAoIW5leHRMZXZlbCkgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5tb25leSAtPSBuZXh0TGV2ZWwuY29zdFxuICAgIGl0ZW0ubGV2ZWwrK1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB1cGRhdGUoaW5mbzogY2xvY2suVGltZUluZm8pIHt9XG5cbiAgZHJhdygpIHtcbiAgICBiYWNrZ3JvdW5kKDApXG4gICAgZmlsbCgyNTUpXG4gICAgZWxsaXBzZSguLi5zcGFjZS5zdGlja3koc3BhY2UubW91c2UoKSksIC4uLnNwYWNlLmJveFNpemUpXG4gICAgc3BhY2VcbiAgICAgIC5hcnJheUJvYXJkKClcbiAgICAgIC5maWx0ZXIoKGl0ZW0pOiBpdGVtIGlzIHNwYWNlLlBvc2l0aW9uYWJsZSAmIHNwYWNlLkRpc3BsYXlhYmxlID0+XG4gICAgICAgIHNwYWNlLmlzRGlzcGxheWFibGUoaXRlbSlcbiAgICAgIClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgICAgLmZvckVhY2goKGl0ZW0pID0+IGl0ZW0uZHJhdygpKVxu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
