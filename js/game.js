"use strict"

var Radius = 2000
var UpdateRate = 33
var PlayerAcc = 0.2
var PlayerRotSpd = Math.PI / 1000 * UpdateRate
var PropelSpd = 1 * UpdateRate
var FieldSpd = 0.15 * UpdateRate
var NFields = 20
var FieldRatio = 0.1

var keys = [].fill.call({length: 255}, 0)
var viewX = 0, viewY = 0
var time = 0
var timer

var player, timeScale = 1
var shots = []
var fields = []
var gameOver = false

var rocketSnd, stopSnd

function load() {
  rocketSnd = sndNew("snd/rocket", 1)
  stopSnd = sndNew("snd/stop", 1)
  player = objNew("img/obj0.png", 0, 0, 0, 0, Math.PI / 2)
  for (var i = 0; i < (NFields / FieldRatio - NFields) / 4; i++) {
    var p = randInCircle(0, 1000)
    var v = randInCircle(0, FieldSpd)
    shots[i] = objNew("img/asteroid.png", p.x, p.y, v.x, v.y, Math.random() * Math.PI * 2)
    shots[i].velRot = Math.sign(Math.random() - 0.5) * PlayerRotSpd
  }
  for (var i = 0; i < NFields / 4; i++) {
    var p = randInCircle(500, 1000)
    var v = randInCircle(0, FieldSpd)
    fields[i] = objNew("img/hole.png", p.x, p.y, v.x, v.y, 0)
    fields[i].div.style.zIndex = -1
  }
  update()
  timer = setInterval(update, UpdateRate)
  setTimeout(function() {
    document.getElementById("instruct").style.display = "none"
  }, 10000)
}

function update() {
  while (fields.length < NFields + NFields * time / 120000) {
    var p = randInCircle(1000, 2000)
    var v = randInCircle(0, FieldSpd + FieldSpd * time / 120000)
    if (Math.random() < FieldRatio) {
      var field = objNew("img/hole.png", player.x + p.x, player.y + p.y, player.dilatedVelX + v.x, player.dilatedVelY + v.y, 0)
      field.div.style.zIndex = -1
      fields[fields.length] = field
    }
    else {
      var shot = objNew("img/asteroid.png", player.x + p.x, player.y + p.y, player.dilatedVelX + v.x, player.dilatedVelY + v.y, Math.random() * Math.PI * 2)
      shot.velRot = Math.sign(Math.random() - 0.5) * PlayerRotSpd
      shots[shots.length] = shot
    }
  }
  if (keys[38] && Math.random() < 0.02 * UpdateRate) propel(-1)
  if (keys[40] && Math.random() < 0.02 * UpdateRate) propel(1)
  for (var i = 0; i < fields.length; i++) {
    fields[i].prevX = fields[i].x
    fields[i].prevY = fields[i].y
  }
  updatePos(player, (keys[38] - keys[40]) * PlayerAcc, (keys[37] - keys[39]) * PlayerRotSpd)
  viewX = player.x - getWindowWidth() / 2
  viewY = player.y - getWindowHeight() / 2
  objDraw(player)
  for (var i = 0; i < shots.length; i++) {
    updatePos(shots[i], 0, shots[i].velRot)
    objDraw(shots[i])
    if (objDistSq(shots[i], player) > Radius * Radius) {
      objRemove(shots[i])
      arrayRemove(shots, i)
      i--
    }
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
  time += UpdateRate
}

function keyDown(event) {
  var key = findKey(event)
  //document.title = key
  keys[key] = 1
  if (!gameOver && (keys[38] || keys[40])) sndPlay(rocketSnd)
  if (key == 190) document.body.style.backgroundColor = document.body.style.backgroundColor == "gray" ? "black" : "gray"
}

function keyUp(event) {
  var key = findKey(event)
  keys[key] = 0
  if (!gameOver && (key == 38 || key == 40) && !(keys[38] || keys[40])) {
    sndPlay(stopSnd)
    rocketSnd.snds[0].pause()
    rocketSnd.snds[0].currentTime = 0
  }
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
    if (mul >= UpdateRate / 1500) timeScale = mul
    else {
      gameOver = true
      document.body.style.backgroundColor = "gray"
      document.getElementById("instruct").style.display = "none"
      document.getElementById("gameover").style.display = ""
      document.getElementById("score").firstChild.nodeValue = Math.floor(time / 1000)
      clearInterval(timer)
      rocketSnd.snds[0].pause()
    }
  }
  if (field) {
    obj.dilatedVelX = field.dilatedVelX + (obj.velX - field.dilatedVelX) * mul
    obj.dilatedVelY = field.dilatedVelY + (obj.velY - field.dilatedVelY) * mul
  } else {
    obj.dilatedVelX = obj.velX
    obj.dilatedVelY = obj.velY
  }
  obj.x += obj.dilatedVelX / timeScale
  obj.y += obj.dilatedVelY / timeScale
  obj.rot += rot * mul / timeScale
}

function propel(dir) {
  var shot = objNew("img/propel.png", player.x, player.y,
                    player.velX + PropelSpd * Math.cos(player.rot) * dir + (Math.random() - 0.5) * PropelSpd / 3,
                    player.velY - PropelSpd * Math.sin(player.rot) * dir + (Math.random() - 0.5) * PropelSpd / 3, 0)
  shot.velRot = 0
  shots[shots.length] = shot
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
