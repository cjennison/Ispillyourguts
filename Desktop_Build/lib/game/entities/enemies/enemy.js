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
	
	name:"enemy",
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 10,
	
	awareness: 20,
	alerted:false,
	foundAlarm:false,
	randomMovementTimer: null,
	targetPosition: null,
	
	speed: 14,
	flip: false,
	alarm: null,
	
	animSheet: new ig.AnimationSheet( 'media/enemyNurse_one.png', 32, 48  ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'walk', 0.5, [0,1,2,3] );
		this.addAnim( 'run', 0.2, [0,1,2,3] );
	},
	
	setTargetAlarm:function(alarm){
		this.alarm = alarm;
				
	},
	
	
	update: function() {
		// near an edge? return!
		if( !ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y+1
			)
		) {
			this.flip = !this.flip;
					this.currentAnim.flip.x = this.flip;

		}
		if(!this.alerted){
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
        	this.checkSight();
        }
        if(this.alerted){
        	//Get Alarm Position, Go to it.
        	//Proceed to Freak Out    
        	//console.log("AHHH");
        	if(this.foundAlarm == false){
            	this.movetoAlarm();
            } else {
				this.moveToPosition();            	
            }
        	
        }
		
		this.currentAnim.flip.x = this.flip;
		this.parent();
	},
	
	moveToPosition:function(){
		var newpos = this.targetPosition;
		if(newpos == null){
			return;
		}
		
		if(this.pos.x < newpos){
        	this.pos.x++;
        	this.flip = false;
        }                       
        else{
        	this.pos.x--;
        	this.flip = true;
        }  
        
        if(this.randomMovementTimer.delta() > 1){
        	this.randomMovementTimer.reset();
        	this.targetPosition = this.pos.x + ((Math.random() * 200) - 100);

        }
		
	},
	
	
	movetoAlarm:function(){
		if(this.alarm == null){
			return;
		}
        var alarm = this.alarm;
        
        if(this.pos.x < alarm.pos.x){
        	this.pos.x++;
        	this.flip = false;
        }                       
        else{
        	this.pos.x--;
        	this.flip = true;
        }                       
                               
	},
	
	
	checkSight: function(){
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		//console.log(this.flip);
		var sightType = "none";
		
		
		if(this.flip){
// 			this.awareness = -20;
			
		} else {
			this.awareness = 20;
		}
		
		if(!player) return;
		
		
		if(player.pos.y > this.pos.y + 20 || player.pos.y < this.pos.y - 20){ return; };
		
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
				this.alerted = true;
			} else if ((player.pos.x < (this.pos.x + (this.awareness*2) + this.size.x)) && player.pos.x > (this.pos.x)){
				//HALF
				sightType = "half";
			} else {
				//NONE
				sightType = "none";
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
		if(other.isAlarm && this.alerted){
			other.setAlarm();
			this.foundAlarm = true;
			this.randomMovementTimer = new ig.Timer();
			this.targetPosition = (Math.random() * 100) - 50;
		}
	},
	
	kill:function(){
		
		
		ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y);

		
		this.parent();
	}
});

EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    
                    return;
                }
            }
    });
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

});