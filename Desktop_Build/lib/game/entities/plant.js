ig.module(
    'game.entities.plant'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityPlant = ig.Entity.extend({
        name: "stealthObject",
      type: ig.Entity.TYPE.B, // Be careful cause you could "kill" the door
      checkAgainst: ig.Entity.TYPE.A, // your player is TYPE.A
      collides: ig.Entity.COLLIDES.PASSIVE,
        
        size:{x:33,y:68},    
        animSheet: new ig.AnimationSheet('media/objects/tree.png',33,70),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            this.addAnim( 'closed', 1, [0] );
            this.addAnim('open', 1, [1] );
        },
    
        update: function() {
            this.currentAnim = this.anims.closed;
            
            ig.game.getEntitiesByType(EntityPlayer)[0].currentAnim.alpha = 1;
            
            
            this.parent();
        },
        
        check:function(other){
        	if(ig.input.state("crouch")){
        		other.currentAnim.alpha = .3;
        		other.hiding = true;
        	} else {
        		ig.game.getEntitiesByType(EntityPlayer)[0].hiding = false;
        	}
        	
        }
        
       
        
    });
});                                                                                                                               