ig.module(
	'game.entities.ui.dialogue'
)
.requires(
	'impact.entity',
	'impact.font'
)
.defines(function(){
	
EntityDialogue = ig.Entity.extend({
	size: {x: 16, y: 9},
	font: new ig.Font( 'media/font/molot.font.png' ),
	animSheet: new ig.AnimationSheet( 'media/screens/intro/overlay.png', 568, 240 ),
	zIndex:1000,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim('idle', 1, [0])
		
	},
	
	
	
	update: function() {
       
        
        this.parent();
	},
                                      
    draw: function(){
    	this.parent();

    	
    },                  		                
	
	kill: function(){
		this.parent();	
	}
	
	
});

});