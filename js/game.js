"use strict"

var Radius = 1000
var UpdateRate = 50
var PlayerAcc = 0.2
var PlayerRotSpd = Math.PI / 1000 * UpdateRate
var ShotSpd = 0.2 * UpdateRate

var keys = [].fill.call({length: 255}, 0)
var viewX = 0, viewY = 0
var time = 0

var player
var shots = []
var fields = []

function load() {
  player = objNew("img/obj0.png", 0, 0, 0, 0, Math.PI / 2)
  update()
  setTimeout(update, UpdateRate)
  setInterval(function() {
    var fwd = (keys[38] - keys[40]) * PlayerAcc
    player.velX += fwd * Math.cos(player.rot)
    player.velY += -fwd * Math.sin(player.rot)
  }, 33)
}

function update() {
  while (Math.random() < 0.001 * UpdateRate) {
    var p = randInCircle(500, 1000)
    var v = randInCircle(0, 0.1 * UpdateRate)
    fields[fields.length] = objNew("img/obj2.png", player.x + p.x, player.y + p.y, player.velX + v.x, player.velY + v.y, 0)
  }
  for (var i = 0; i < fields.length; i++) {
    fields[i].prevX = fields[i].x
    fields[i].prevY = fields[i].y
  }
  var timeScale = updatePos(player, (keys[37] - keys[39]) * PlayerRotSpd)
  viewX = player.x - getWindowWidth() / 2
  viewY = player.y - getWindowHeight() / 2
  objDraw(player)
  for (var i = 0; i < shots.length; i++) {
    updatePos(shots[i], 0, 0)
    objDraw(shots[i])
  }
  for (var i = 0; i < fields.length; i++) {
    updatePos(fields[i], 0)
    objDraw(fields[i])
    if (objDistSq(fields[i], player) > Radius * Radius) {
      objRemove(fields[i])
      arrayRemove(fields, i)
      i--
    }
  }
  setTimeout(update, UpdateRate * timeScale)
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

function updatePos(obj, rot) {
  var field, dist, mul = 1
  for (var i = 0; i < fields.length; i++) {
    if (fields[i] != obj) {
      var d = objDist(obj, {x: fields[i].prevX, y: fields[i].prevY})
      var m = Math.max(0, Math.min(1, d / 200 - 0.1))
      if (m < 1 && (!field || d < dist)) {
        field = fields[i]
        dist = d
        mul = m
      }
    }
  }
  if (obj == player) {
    if (mul == 0) document.title = "GAME OVER"
  }
  if (field) {
    obj.x += field.velX + (obj.velX - field.velX) * mul
    obj.y += field.velY + (obj.velY - field.velY) * mul
    obj.rot += rot * mul
  } else {
    obj.x += obj.velX
    obj.y += obj.velY
    obj.rot += rot
  }
  return mul
}

function randInCircle(min, max) {
  var x, y, d
  do {
    x = (Math.random() - 0.5) * max * 2
    y = (Math.random() - 0.5) * max * 2
    d = x*x + y*y
  } while (d < min * min || d > max * max)
  return {x: x, y: y}
}
