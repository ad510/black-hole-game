"use strict"

var UpdateRate = 33
var PlayerSpd = 0.1 * UpdateRate
var PlayerRotSpd = Math.PI / 1000 * UpdateRate
var ShotSpd = 0.2 * UpdateRate

var keys = [].fill.call({length: 255}, 0)
var viewX = 0, viewY = 0
var time = 0

var player
var shots = []

function load() {
  player = objNew("img/obj0.png", 0, 200, Math.PI / 2)
  update()
  setInterval(update, UpdateRate)
}

function update() {
  time += UpdateRate
  getDrawDiv().style.width = getWindowWidth() + "px"
  getDrawDiv().style.height = getWindowHeight() + "px"
  viewX = -getWindowWidth() / 2
  viewY = -getWindowHeight() / 2
  updatePos(player, (keys[38] - keys[40]) * PlayerSpd, (keys[37] - keys[39]) * PlayerRotSpd)
  objDraw(player)
  for (var i = 0; i < shots.length; i++) {
    updatePos(shots[i], ShotSpd, 0)
    objDraw(shots[i])
  }
}

function keyDown(event) {
  var key = findKey(event)
  document.title = key
  keys[key] = 1
}

function keyUp(event) {
  var key = findKey(event)
  keys[key] = 0
  if (key == 32) shots[shots.length] = objNew("img/obj5.png", player.x, player.y, player.rot) // space
}

function updatePos(obj, velFwd, velRot) {
  var mul = Math.min(objDist(obj, {x: 0, y: 0}) / 200 - 0.1, 1) / Math.min(objDist(player, {x: 0, y: 0}) / 200 - 0.1, 1)
  obj.rot += velRot * mul
  obj.x += velFwd * Math.cos(obj.rot) * mul
  obj.y += -velFwd * Math.sin(obj.rot) * mul
}
