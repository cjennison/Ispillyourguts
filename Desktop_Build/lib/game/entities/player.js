ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	name:"player",
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 20, y:45},
	offset: {x: 20, y: 9},
	
	maxVel: {x: 100, y: 200},
	friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/characters/characterDennis.png', 60, 60 ),
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: true,
	accelGround: 100,
	accelAir: 200,
	jump: 70,
	health: 10,
	canClimb: false,
    isClimbing: false,
    hiding: false, //Am I hiding?
    attacking: false, //Are we attacking?
    crouching: false, //Are we crouching?
    executing: false, //Are we executing someone?
    momentumDirection: {'x':0,'y':0},
    ladderReleaseTimer: new ig.Timer(0.0),
    ladderSpeed: 75,
    
    lightAttackSound: new ig.Sound("media/effects/Light atk 1.*"),
    footStepsSound: new ig.Sound("media/effects/Footsteps.*"),
	heavyAttackSound: new ig.Sound("media/effects/heavyatk.*"),
	
    attackTimer:null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		// Add the animations
		this.addAnim( 'idle', 1, [0,1,2,1] );
		this.addAnim( 'run', 0.1, [3,4,5,6,7,8] );
		this.addAnim( 'jump', 1, [8] );
		this.addAnim( 'fall', 0.4, [6,7] );
		this.addAnim( 'climb', 0.2,[50,51]);
		this.addAnim( 'climbIdle', 1,[50])

		this.addAnim('crouch', 0.1, [11,12,13]);
		this.addAnim('crouchidle', 1, [12]);
		this.addAnim('crouchwalk', 0.1, [13,14, 15, 14]);
		this.addAnim('quickAttack', 0.1, [20,21,22,23,24], false);
		this.addAnim('execution', 0.3, [31,32,33,34]);

		
		//if (!ig.global.wm)ig.game.sortEntitiesDeferred();
		
	},
	
	
	update: function() {
		
		if(ig.game.dialogueActive){
			this.parent();
			this.currentAnim.flip.x = this.flip;

			return;
		}

		if(this.executing){
			this.execute();
			this.currentAnim.flip.x = this.flip;

			this.parent();
			return;
		}
		
		
		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if(this.crouching){
			this.maxVel.x = 50;
			accel = accel/4;
			
		} else {
			this.maxVel.x = 100;
			
		}
		
		if(ig.input.pressed("crouch")){
			if(this.vel.y == 0){
				this.size.y = 25;
				this.offset.y = 28;
				this.pos.y = this.pos.y += 20;
			}
		}
		
		if(ig.input.released("crouch")){
			if(this.vel.y == 0 && this.crouching){
				this.size.y = 45;
				this.offset.y = 8;
				this.pos.y = this.pos.y -= 20;
			}
		}
		
		
		if(ig.ua.mobile){
			this.moveMobile();
		} else {
			this.moveDesktop();
		}
		
		// attack
		if( ig.input.pressed('quickAttack') ) {
			this.attacking = true;
			this.vel.x = 0;
			this.lightAttackSound.play();
			this.currentAnim = this.anims.quickAttack;
			this.currentAnim.rewind();
			this.attackTimer = new ig.Timer();
			
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
        
		
		// set the current animation, based on the player's speed
		if(!this.attacking){
			 if(this.isClimbing && (ig.input.state("up") || ig.input.state("down"))){
			 	
				this.currentAnim = this.anims.climb;
			 } else if(this.isClimbing){
			 	this.currentAnim = this.anims.climbIdle;

			 }
			else if( this.vel.y < 0 ) {
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
				//this.footStepsSound.play();
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

		
		this.currentAnim.flip.x = this.flip;
		
                                
        if(this.pos.y > ig.game.fallHeight){
             ig.game.endGame();
             this.kill();
        }
		this.canClimb = false;
		// move!
		this.parent();
	},
	
	
	execute:function(){
		
	},
	
	moveDesktop:function(){
		if(ig.input.state('right')){
			this.vel.x = this.accelGround;
			this.flip = false;
        	this.direction = "right";
        	if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		
		if(ig.input.state('left')){
			this.vel.x = -this.accelGround;
			this.flip = true;
        	this.direction = "left";
        	if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		
		if( this.canClimb ) {   
			//this.vel.y = 0;        
            if(ig.input.state("up") || ig.input.state("down")){
	            this.isClimbing=true;
	            console.log("CLIMBING");
	            
	            this.vel.x = 0; // don't fall off sides of ladder unintentionally
	            
	            //momentumDirection allows for up, down and idle movement (-1, 0 & 1) so you can stop on ladders
	            if (ig.input.state("up")) {
	                this.pos.y += -1;
	
	            }else if( ig.input.state("down")){
					this.pos.y += 1;
	            }
            }
        }       
		
		if(this.isClimbing){
			this.gravityFactor = 0;
			this.vel.y = 0;

		} else { this.gravityFactor = 1;}
		
		if(ig.input.state("crouch")){
			this.crouching = true;
		} else {
			this.crouching = false;
		}
		
	},
	
	moveMobile:function(){
		this.vel.x = ig.game.stickLeft.input.x * this.accelGround;
        //this.vel.y = ig.game.stickLeft.input.y * this.accelGround;
		
		if(this.vel.x < 0){
        	this.flip = true;
        	this.direction = "left";
        	if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode

        }
        if(this.vel.x > 0){
        	this.flip = false;
        	this.direction = "right";
        	if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode

        }
		
        
       if( this.canClimb && ig.game.stickLeft.input.y != 0 ) {           
            
            this.isClimbing=true;
            console.log("CLIMBING");
            
            //this.vel.x = 0; // don't fall off sides of ladder unintentionally
            
            //momentumDirection allows for up, down and idle movement (-1, 0 & 1) so you can stop on ladders
            if (ig.game.stickLeft.input.y < .5) {
                this.vel.y = -this.ladderSpeed;

            }else if( ig.game.stickLeft.input.y > .5){
				this.vel.y = this.ladderSpeed;
            }
        }                
                                
		
		
		
		//console.log(ig.game.stickLeft.input.y);
		if(ig.game.stickLeft.input.y > .55){
			this.crouching = true;
			//this.size.y /= 2;
		} else {
			this.crouching = false;
			//this.size.y = 45;
		}
	},
	
	check: function( other ) {
	
		if(other.name == "ladder"){
			this.canClimb = true;
			if(ig.input.state("up") || ig.input.state("down")){
				this.pos.x = other.pos.x - 7;
			}
			return;
		} else {
			
		}
			
		if (other.collides == ig.Entity.COLLIDES.FIXED){
    		 //this.flip = !this.flip;this.currentAnim.flip.x = this.flip;
  		}
  		
  		if(this.attacking && other.name == "enemy"){
  			//console.log(other);
  		
  			if(!Data.firstKill && !other.dead){
				ig.game.queAchievement("babysfirstkill");
				Data.firstKill = true;
			}
			if(other.dead == false){
				ig.game.createBlood("splatter", other.pos.x, other.pos.y, other);
			}
  			other.kill();
  		}
  		
  		
  		
  		if(ig.input.pressed('execute') && other.name == "enemy" && !other.dead){
  			this.executing = true;
  			ig.game.zoomScreen();
  			ig.game.playZoom();
			this.heavyAttackSound.play();
  			other.setExecution();
  			//ig.game.createBlood("thin splatter", other.pos.x, other.pos.y, other);
			this.currentAnim = this.anims.execution;
			this.currentAnim.rewind();
  			//this.currentAnim.rewind();
  			this.resetExecution(other);
  		} 
  		
  		if((ig.input.pressed('execute') || ig.input.pressed('quickAttack')) && other.name == "boss" && other.dead == false){
  			ig.game.zoomScreen();
  			this.executing = true;
			ig.game.playZoom();
			this.heavyAttackSound.play();
			this.currentAnim = this.anims.execution;
			this.currentAnim.rewind();
  			//other.performBossFinal();
  			this.resetExecution(other);
  		}
  		
  		if(ig.input.pressed("interact") && other.name == "weapon"){
  			console.log("touch");
  			ig.game.setEquippedWeapon(other.wepType);
  			other.kill();
  		}
	},
	
	resetExecution:function(other){
		setTimeout(function(){
			ig.game.getEntitiesByType(EntityPlayer)[0].executing = false;
	  		other.kill();
  			ig.game.createBlood("thin splatter", other.pos.x, other.pos.y, other);

	  		ig.game.enrage();
	  		ig.game.unZoom();
	  		if(!Data.firstExecution && other.name != "boss"){
				ig.game.queAchievement("sorethroat");
				Data.firstExecution = true;
			}

		}, 1000)
		
	}
});




});