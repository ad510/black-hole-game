Death by Time Manipulation
==========================

A game inspired by black holes and [World 6](https://youtu.be/chd4ijoaxVk?t=18s) of [Braid](http://braid-game.com). It simulates "black hole"-like objects using time dilation, so time slows down if you get close to them (though they behave very differently from real black holes). Made at [CodeDay LA](https://codeday.org/la).

Open index.htm or [go here](https://ad510.github.io/time-dilation-game) to play.

How do you die by time manipulation?
------------------------------------
I made this game because I liked the idea behind [Braid World 6](https://youtu.be/chd4ijoaxVk?t=18s), but it bugged me that Braid didn't take the concept further.

First, when you go near the ring, the internal clock in the player's brain should slow down too. This means that while in Braid you see the player move slowly when he's near the ring, it would be more accurate if you instead see the player move at normal speed when he's near the ring, but see everything else around him move faster.

Second, it is possible to make a "super-ring" that warps time so much that if you watched someone try to walk over to the ring and leave on the other side, you would never see them reach the ring, let alone the other side. This can be done, for example, by setting the ratio of the time interval perceived by someone close to the ring divided by the time interval perceived by someone far away from the ring proportionally to the distance between the ring and the person close to the ring.

But now consider what someone walking across a super-ring would see if their brain clock also slows down as they approach. They would see everything outside move faster and faster, until they see the entire lifetime of the universe pass by the time they reach the ring! And what they see after that would essentially be undefined. In other words, in a game world with a super-ring, it is possible to "die" *solely* by the clever use of time manipulation! I thought this was something really cool that could've been in Braid and I was curious what this "death by time manipulation" would look like, so I made this game.

In case you're wondering, the game over screen pauses the game at about the last possible moment before you would "die" of time manipulation. If I let it run just a single frame longer, the game goes haywire trying to literally simulate an infinite time interval in a single frame, setting every object's position to NaN and making them disappear from the screen.

About black holes
-----------------
While [real black holes](http://spiro.fisica.unipd.it/~antonell/schwarzschild/live) follow very different equations from the black hole-inspired objects in this game, black holes do in fact [slow down your perception of time](http://www.feynmanlectures.caltech.edu/II_42.html#Ch42-S6) when you get close to them. This has been proposed as a way to quickly time travel to the future, like in the movie [Interstellar](https://en.wikipedia.org/wiki/Interstellar_%28film%29). General relativity even [predicts](http://math.ucr.edu/home/baez/physics/Relativity/BlackHoles/fall_in.html) (under "Will you see the universe end?") that if you fall into a special kind of black hole called a wormhole, you would see the entire lifetime of the universe play out in the short amount of time it takes to reach the wormhole entrance, like when you "die" in this game. That said, we don't know whether wormholes actually exist.

Copying
-------
Written in 2016 by Andrew Downing

To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.

You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

Sound credits
-------------
Rocket sounds are taken from the [Falcon 9 flight 1 highlights](https://youtu.be/H6hYEqrP56I?t=2m) video. I hope SpaceX doesn't mind.
