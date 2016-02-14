"use strict"

var Radius = 1000
var UpdateRate = 10
var PlayerAcc = 0.01
var PlayerRotSpd = Math.PI / 1000 * UpdateRate
var ShotSpd = 0.1 * UpdateRate

var keys = [].fill.call({length: 255}, 0)
var viewX = 0, viewY = 0
var time = 0

var player, timeScale = 1
var shots = []
var fields = []

function load() {
  player = objNew("img/obj0.png", 0, 0, 0, 0, Math.PI / 2)
  update()
  setInterval(update, UpdateRate)
}

function update() {
  while (Math.random() < 0.01 * UpdateRate) {
    var p = randInCircle(500, 1000)
    var v = randInCircle(0, 0.1 * UpdateRate)
    if (Math.random() < 0.1) fields[fields.length] = objNew("img/obj2.png", player.x + p.x, player.y + p.y, player.velX + v.x, player.velY + v.y, 0)
    else shots[shots.length] = objNew("img/obj5.png", player.x + p.x, player.y + p.y, player.velX + v.x, player.velY + v.y, 0)
  }
  for (var i = 0; i < fields.length; i++) {
    fields[i].prevX = fields[i].x
    fields[i].prevY = fields[i].y
  }
  updatePos(player, (keys[38] - keys[40]) * PlayerAcc, (keys[37] - keys[39]) * PlayerRotSpd)
  viewX = player.x - getWindowWidth() / 2
  viewY = player.y - getWindowHeight() / 2
  objDraw(player)
  for (var i = 0; i < shots.length; i++) {
    updatePos(shots[i], 0, PlayerRotSpd)
    objDraw(shots[i])
  }
  for (var i = 0; i < fields.length; i++) {
    updatePos(fields[i], 0, 0)
    objDraw(fields[i])
    if (objDistSq(fields[i], player) > Radius * Radius) {
      objRemove(fields[i])
      arrayRemove(fields, i)
      i--
    }
  }
  for (var i = 0; i < shots.length; i++) {
    shots[i].velX -= player.velX
    shots[i].velY -= player.velY
  }
  for (var i = 0; i < fields.length; i++) {
    fields[i].velX -= player.velX
    fields[i].velY -= player.velY
  }
  player.velX = 0
  player.velY = 0
  time += UpdateRate / timeScale
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
  var field, dist, mul = 1
  obj.velX += fwd * Math.cos(obj.rot)
  obj.velY += -fwd * Math.sin(obj.rot)
  for (var i = 0; i < fields.length; i++) {
    if (fields[i] != obj) {
      var d = objDist(obj, {x: fields[i].prevX, y: fields[i].prevY})
      var m = Math.max(0, Math.min(1, d / 500 - 0.2))
      if (m < 1 && (!field || d < dist)) {
        field = fields[i]
        dist = d
        mul = m
      }
    }
  }
  if (obj == player) {
    if (mul == 0) document.title = "GAME OVER"
    timeScale = mul
  }
  if (field) {
    obj.x += field.velX + (obj.velX - field.velX) * mul / timeScale
    obj.y += field.velY + (obj.velY - field.velY) * mul / timeScale
    obj.rot += rot * mul / timeScale
  } else {
    obj.x += obj.velX / timeScale
    obj.y += obj.velY / timeScale
    obj.rot += rot / timeScale
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
