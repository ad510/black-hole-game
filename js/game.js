"use strict"

var UpdateRate = 33
var PlayerAcc = 0.2
var PlayerRotSpd = Math.PI / 1000 * UpdateRate
var ShotSpd = 0.2 * UpdateRate

var keys = [].fill.call({length: 255}, 0)
var viewX = 0, viewY = 0
var time = 0

var player
var shots = []

function load() {
  player = objNew("img/obj0.png", 0, 200, 0, 0, Math.PI / 2)
  update()
  setInterval(update, UpdateRate)
}

function update() {
  time += UpdateRate
  viewX = -getWindowWidth() / 2
  viewY = -getWindowHeight() / 2
  updatePos(player, (keys[38] - keys[40]) * PlayerAcc, (keys[37] - keys[39]) * PlayerRotSpd)
  objDraw(player)
  for (var i = 0; i < shots.length; i++) {
    updatePos(shots[i], 0, 0)
    objDraw(shots[i])
  }
}

function keyDown(event) {
  var key = findKey(event)
  //document.title = key
  keys[key] = 1
}

function keyUp(event) {
  var key = findKey(event)
  keys[key] = 0
  if (key == 32) // space
    shots[shots.length] = objNew("img/obj5.png", player.x, player.y,
                                 player.velX + ShotSpd * Math.cos(player.rot), player.velY - ShotSpd * Math.sin(player.rot), player.rot)
}

function updatePos(obj, fwd, rot) {
  var mul = Math.min(objDist(obj, {x: 0, y: 0}) / 200 - 0.1, 1) / Math.min(objDist(player, {x: 0, y: 0}) / 200 - 0.1, 1)
  obj.rot += rot * mul
  obj.velX += fwd * Math.cos(obj.rot)
  obj.velY += -fwd * Math.sin(obj.rot)
  obj.x += obj.velX * mul
  obj.y += obj.velY * mul
}
