ig.module(
    'game.entities.door'
    )
.requires(
    'impact.entity',
    'impact.sound'
    )
.defines(function(){
    EntityDoor = ig.Entity.extend({
        
      type: ig.Entity.TYPE.B, // Be careful cause you could "kill" the door
      checkAgainst: ig.Entity.TYPE.A, // your player is TYPE.A
      collides: ig.Entity.COLLIDES.FIXED,
        
        size:{x:20,y:48},
        offset:{x:22, y:10},
        animSheet: new ig.AnimationSheet('media/objects/door.png',60,60),
        
        openSound: new ig.Sound("media/effects/Door Open.*"),

		openPlayed:false,
		closePlayed:false,
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            this.addAnim( 'closed', 1, [0] );
            this.addAnim('open', 1, [1] );
        },
    
        update: function() {
            this.currentAnim = this.anims.closed;
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if(player && this.distanceTo(player) > 20){
            	this.openPlayed = false;
            }
            
            
            this.parent();
        },
        
        check: function(other) {
            if(other==ig.game.getEntitiesByType(EntityPlayer)[0]) {
  				this.currentAnim = this.anims.open;
  				this.pos.x 
  				if(this.openPlayed == false){
  					 this.openSound.play();
  					 this.openPlayed = true;
  				}
 				// this was written incorrectly
    			this.collides = ig.Entity.COLLIDES.PASSIVE;
  			 } else {
			 	// if you want door to close behind you
			 	
  				this.closeSound.play();
  					
   			  	this.currentAnim = this.anims.closed;
    		  	this.collides = ig.Entity.COLLIDES.FIXED; 
 			}
        }
        
    });
});                                                                                                                               