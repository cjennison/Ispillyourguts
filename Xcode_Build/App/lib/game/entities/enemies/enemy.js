ig.module(
	'game.entities.enemies.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityEnemy = ig.Entity.extend({
	size: {x: 30, y: 47},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 10,
	
	awareness: 20,
	alerted:false,
	
	speed: 14,
	flip: false,
	
	animSheet: new ig.AnimationSheet( 'media/nurseone.png', 32, 48  ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'crawl', 0.08, [0] );
	},
	
	setTargetAlarm:function(alarm){
	
	},
	
	
	update: function() {
		// near an edge? return!
		if( !ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y+1
			)
		) {
			this.flip = !this.flip;
		}
		if(!this.alerted){
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
        	this.checkSight();
        }
        if(this.alerted){
        	//Get Alarm Position, Go to it.
        	//Proceed to Freak Out                                                                                                                                                                                      LILDAWG
        	
        }
		
		this.parent();
	},
	
	checkSight: function(){
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		//console.log(this.flip);
		var sightType = "none";
		
		if(!player) return;
		
		if(this.flip){
		// <-
			
			if((player.pos.x > (this.pos.x - this.awareness)) && player.pos.x < this.pos.x){
				//FULL
				sightType = "full";
				this.alerted = true;
			} else if ((player.pos.x > (this.pos.x - (this.awareness*2))) && player.pos.x < this.pos.x){
				//HALF
				sightType = "half";
			} else {
				//NONE
				sightType = "none";
			}
		} else {
		// ->
			if((player.pos.x < (this.pos.x + this.awareness + this.size.x)) && player.pos.x > (this.pos.x)){
				sightType = "full";
			} else if ((player.pos.x < (this.pos.x + (this.awareness*2) + this.size.x)) && player.pos.x > (this.pos.x)){
				//HALF
				sightType = "half";
			} else {
				//NONE
				sightType = "none";
			}
		}
		
		
		var detectionEye = ig.game.getEntitiesByType(EntityDetectionEye)[0];
		if(detectionEye){
			if (sightType == "none"){
				detectionEye.changeDetection(1);
			}
			else if (sightType == "half"){
				detectionEye.changeDetection(2);
			}
			else {
				detectionEye.changeDetection(3);
			}
		}
	},
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
		}
	},	
	
	check: function( other ) {
		//other.receiveDamage( 10, this );
	}
});

});