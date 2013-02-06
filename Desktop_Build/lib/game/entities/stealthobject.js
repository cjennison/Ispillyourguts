ig.module(
    'game.entities.stealthobject'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityStealthObject = ig.Entity.extend({
        name: "stealthObject",
      type: ig.Entity.TYPE.B, // Be careful cause you could "kill" the door
      checkAgainst: ig.Entity.TYPE.A, // your player is TYPE.A
      collides: ig.Entity.COLLIDES.PASSIVE,
        
        beingUsed:false,
        size:{x:33,y:68},    
        animSheet: new ig.AnimationSheet('media/objects/tree.png',33,70),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            this.addAnim( 'idle', 1, [0] );
        },
    
        update: function() {
            this.currentAnim = this.anims.idle;
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if(!player){return;}
            player.currentAnim.alpha = 1;
            
            if( player && this.distanceTo( player ) > this.size.x ) {
				player.hiding = false;
			}
            
            this.parent();
        },
        
        check:function(other){
        	
        	if(ig.input.state("crouch")){
        		other.currentAnim.alpha = .3;
        		other.hiding = true;
        	} else {
        		other.hiding = false;
        		other.currentAnim.alpha = 1;
        	}
        	
        }
        
       
        
    });
});                                                                                                                               