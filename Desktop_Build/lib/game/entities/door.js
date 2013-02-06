ig.module(
    'game.entities.door'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityDoor = ig.Entity.extend({
        
      type: ig.Entity.TYPE.B, // Be careful cause you could "kill" the door
      checkAgainst: ig.Entity.TYPE.A, // your player is TYPE.A
      collides: ig.Entity.COLLIDES.FIXED,
        
        size:{x:16,y:48},    
        animSheet: new ig.AnimationSheet('media/simpledoor.png',16,48),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            this.addAnim( 'closed', 1, [0] );
            this.addAnim('open', 1, [1] );
        },
    
        update: function() {
            this.currentAnim = this.anims.closed;
            this.parent();
        },
        
        check: function(other) {
            if(other==ig.game.getEntitiesByType(EntityPlayer)[0]) {
  				this.currentAnim = this.anims.open;
 				// this was written incorrectly
    			this.collides = ig.Entity.COLLIDES.PASSIVE;
  			 } else {
			 	// if you want door to close behind you
   			  	this.currentAnim = this.anims.closed;
    		  	this.collides = ig.Entity.COLLIDES.FIXED; 
 			}
        }
        
    });
});                                                                                                                               