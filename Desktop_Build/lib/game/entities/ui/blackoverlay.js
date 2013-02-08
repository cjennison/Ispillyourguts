ig.module(
	'game.entities.ui.blackoverlay'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityBlackOverlay = ig.Entity.extend({
	size: {x: 16, y: 9},
	
	animSheet: new ig.AnimationSheet( 'media/screens/intro/overlay.png', 900, 640 ),
	      collides: ig.Entity.COLLIDES.FIXED,
	gravityFactor:0,
	zIndex: 10000000,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim('idle', 1, [0])
		
	},
	
	
	update: function() {
       
        
        this.parent();
	},
                                      
                                      
	
	
	
});

});