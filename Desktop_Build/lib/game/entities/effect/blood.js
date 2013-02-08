ig.module(
	'game.entities.effect.blood'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityBlood = ig.Entity.extend({
	size: {x: 8, y: 10},
	animSheet: new ig.AnimationSheet( 'media/graphics/blood1.png', 60, 60 ),

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		console.log(settings);
		
		this.addAnim( 'splatter', .05, [0,1,2], true);
        this.gravityFactor = 0;
		
	},
	
	setAlarm:function(){
		this.currentAnim = this.anims.on;
	},
	
	disableAlarm:function(){
		this.currentAnim = this.anims.off;
	},
	
	
	update: function() {
      
        
        this.parent();
	},
                                      
        
	
	
	
});

});