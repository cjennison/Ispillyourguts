ig.module(
	'game.entities.enemies.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityEnemy = ig.Entity.extend({
	size: {x: 60, y: 47},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	name:"enemy",
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 10,
	
	dead:false,
	deadTimer:null,
	beingExecuted:false, //Am I being killed?
	awareness: 20,
	alerted:false,
	foundAlarm:false,
	randomMovementTimer: null,
	targetPosition: null,
	
	speed: 14,
	panicDirection: 1,
	panicSpeed: 50,
	flip: false,
	alarm: null,
	
	positionChecker:0, //check if you haven't moved.
	lastX: null,
	
	animSheet: new ig.AnimationSheet( 'media/enemyNurse_one.png', 60, 60  ),
	
	hitSound: new ig.Sound("media/effects/Enemy Hit Gore.*"),

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'walk', 0.3, [0,1,2,3] );
		this.addAnim( 'run', 0.2, [11,12,13,14] );
		this.addAnim( 'fear', 1, [10] );
		this.addAnim( 'dying', 1, [20,21,22,23,24], false);
		this.addAnim( 'dead', .5, [20,21,22,23,24], true);
		this.positionChecker = new ig.Timer();
	},
	
	setTargetAlarm:function(alarm){
		this.alarm = alarm;
				
	},
	
	execute: function(){
		this.currentAnim = this.anims.fear;
	},
	
	update: function() {
		
		if(this.dead){
			if(this.deadTimer){
				if(this.deadTimer.delta() > 3){
					this.currentAnim = this.anims.dead;
				}
			}
			this.currentAnim.flip.x = this.flip;
			this.parent();
			return;
		}
		if(this.beingExecuted){
			this.execute();
			this.currentAnim.flip.x = this.flip;
			this.parent();
			return;
		}
		
		
		if(this.lastX != 0){
			if(this.pos.x == this.lastX){
				if(this.positionChecker.delta() > 1){
					this.flip = !this.flip;
					console.log("WOOPS")
				}
			} else {
				this.positionChecker.reset();
			}
		}
		
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
        	this.currentAnim = this.anims.run;
        	if(this.foundAlarm == false){
            	this.movetoAlarm();
            } else {
				this.moveToPosition();            	
            }
        	
        }
				this.lastX = this.pos.x;

		this.currentAnim.flip.x = this.flip;
		
		
		
		this.parent();
	},
	
	moveToPosition:function(){
		
		
		
		
		this.vel.x = this.panicSpeed * this.panicDirection;
		if(this.randomMovementTimer.delta() > Math.random()*10){
			if(this.panicDirection == 1){
				this.panicDirection = -1;
			} else {
				this.panicDirection = 1;
			}
						this.flip = !this.flip;

			this.randomMovementTimer.reset();
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
		if(player.hiding == true){ return }
		if(this.flip){
		// <-
						
			if(this.distanceTo(player) < 100 && player.pos.x < this.pos.x){
				this.alerted = true;
			}
			
		} else {
		// ->
			if(this.distanceTo(player) < 100 && player.pos.x > this.pos.x){
				this.alerted = true;
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
		}
	},
	
	kill:function(){
		if(this.dead){return;}
		this.hitSound.play();
		this.deadTimer = new ig.Timer();
		//ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y);
		this.dead = true;
		this.currentAnim = this.anims.dying;
		this.currentAnim.rewind();

		

		
		//this.parent();
	},
	
	setExecution:function(){
		this.beingExecuted = true;
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