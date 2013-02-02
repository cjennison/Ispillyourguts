ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 20, y:45},
	offset: {x: 0, y: 2},
	
	maxVel: {x: 100, y: 200},
	friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/characters/characterDennis.png', 60, 47 ),
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: true,
	accelGround: 400,
	accelAir: 200,
	jump: 70,
	health: 10,
	canClimb: false,
    isClimbing: false,
    attacking: false,
    crouching: false,
    momentumDirection: {'x':0,'y':0},
    ladderReleaseTimer: new ig.Timer(0.0),
    ladderSpeed: 75,
    
    attackTimer:null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0,1,2,1] );
		this.addAnim( 'run', 0.1, [3,4,5,6,7,8] );
		this.addAnim( 'jump', 1, [8] );
		this.addAnim( 'fall', 0.4, [6,7] );
		this.addAnim('crouch', 0.1, [11,12,13]);
		this.addAnim('crouchidle', 1, [13]);
		this.addAnim('crouchwalk', 0.1, [13,14,15]);
		this.addAnim('quickAttack', 0.1, [20,21,22,23,24], false);
		
		//if (!ig.global.wm)ig.game.sortEntitiesDeferred();
		
	},
	
	
	update: function() {
		
		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if(this.crouching){
			this.maxVel.x = 50;
			accel = accel/4;
		} else {
			this.maxVel.x = 100;

		}
		if( ig.input.state('left') ) {
			this.accel.x = -accel;
			this.flip = true;
            if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		else if( ig.input.state('right') ) {
			this.accel.x = accel;
			this.flip = false;
            if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		else {
			this.accel.x = 0;
		}         
        
                
           
        
        if( this.canClimb && (ig.input.state('up') /*||  ig.input.pressed('down')*/) ) {           
            
            this.isClimbing=true;
            this.ladderReleaseTimer.set(0.0); // allow to cling to ladder instead of jumping past, if up or down pressed
            
            this.vel.x = 0; // don't fall off sides of ladder unintentionally
            
            //momentumDirection allows for up, down and idle movement (-1, 0 & 1) so you can stop on ladders
            if (ig.input.state('up')) {
                this.momentumDirection.y >-1 ? this.momentumDirection.y -- : this.momentumDirection.y = -1;
                
            }else if( ig.input.state('down' )){
                this.momentumDirection.y <1 ? this.momentumDirection.y ++ : this.momentumDirection.y = 1;
            } else {
            	this.momentumDirection.y = 0;
            }
        } else {
        	this.momentumDirection.y = 0;
        }                
                                
		// jump
		if( (this.standing || this.isClimbing || this.canClimb) && (ig.input.pressed('jump') ) ) {
			this.vel.y = -this.jump;
            
            //allow to jump off ladders
            this.ladderReleaseTimer.set(0.5); // approximate seconds your player takes to jump and fall back down
            this.isClimbing=false;
        }
        
        //when climbing past top of ladder, the entity falls back softly and can walk left or right
        if (!this.standing && !this.canClimb && this.vel.y < 0)this.isClimbing=false;
        
        
        // prevent fall down ladder if ground touched but ladderReleaseTimer still running from recent jump
        if (this.standing)this.ladderReleaseTimer.set(0.0);
        
		
		// attack
		if( ig.input.pressed('quickAttack') ) {
			this.attacking = true;
			this.vel.x = 0;
			this.currentAnim = this.anims.quickAttack;
			this.currentAnim.rewind();
			this.attackTimer = new ig.Timer();
			
		}
		
		// set the current animation, based on the player's speed
		if(!this.attacking){
			if( this.vel.y < 0 ) {
				this.currentAnim = this.anims.jump;
			}
			else if( this.vel.y > 0 ) {
				this.currentAnim = this.anims.fall;
			}
			else if( this.vel.x != 0 && this.crouching) {
				this.currentAnim = this.anims.crouchwalk;
			}
			else if( this.vel.x != 0 && !this.crouching) {
				this.currentAnim = this.anims.run;
			}
			else {
				if(!this.crouching){
					this.currentAnim = this.anims.idle;
				} else {
					this.currentAnim = this.anims.crouchidle;
				}
			}
		}
		
		if(this.attacking){
			if(this.attackTimer.delta() > .45){
				this.attackTimer = null;
				this.attacking = false;
						
			}
		}
		/*
		if ( this.vel.y < 0 && this.isClimbing && this.momentumDirection.y == -1){
            this.currentAnim = this.anims.climbUp; // create your own climbing animations
            
        }else if ( this.vel.y > 0 && this.isClimbing && this.momentumDirection.y == 1){
            this.currentAnim = this.anims.climbDown; // create your own climbing animations
            
        }
        */
		
		this.currentAnim.flip.x = this.flip;
		
                                
        if(this.pos.y > ig.game.fallHeight){
             ig.game.endGame();
             this.kill();
        }
		
		// move!
		this.parent();
	},
	
	check: function( other ) {
		if (other.collides == ig.Entity.COLLIDES.FIXED){
    		 //this.flip = !this.flip;this.currentAnim.flip.x = this.flip;
  		}
  		
  		if(this.attacking){
  			//console.log(other);
  			other.kill();
  		}
	}
});




});