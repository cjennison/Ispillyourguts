/*

//************ An entity that can use a ladder must declare these variables: ***********

    canClimb: false,
    isClimbing: false,
    momentumDirection: {'x':0,'y':0},
    ladderReleaseTimer: new ig.Timer(0.0),
    ladderSpeed: 75 // optional

    */


ig.module(
	'game.entities.ladder'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLadder = ig.Entity.extend({
	size: { x: 8, y: 64 },
	name: "ladder",
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(150, 150, 255, 0.7)',
	ladderSpeed: 65, // default. Override in weltmeister to affect an individual ladder (maybe vines are slower), or set in entity to determine its own climb speed
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.LITE,
	init: function (x, y, settings) {
		this.parent(x, y, settings);
	},
	update: function () {
		//player must have lower zIndex and sortEntitiesDeferred must be called in order for this to work
	
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		if (player){
			//player.canClimb = false; // reset every frame in case you leave ladder. Allows to walk across/atop ladder
		}
	
	},
	check: function (other) {
	/*
		if (other.ladderReleaseTimer) { // if entity has this timer, then it has the ability to climb
			console.log("I TOUCH");
			other.canClimb = true;  // entity is touching ladder, so climbing is an option if up or down movement
		}
		else{
			
		}
		*/
	}
});
});

