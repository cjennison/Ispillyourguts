ig.module(
	'game.entities.ui.achievement'
)
.requires(
	'impact.entity',
	'impact.font'
)
.defines(function(){
	
EntityAchievement = ig.Entity.extend({
	size: {x: 16, y: 9},
	animSheet: new ig.AnimationSheet( 'media/achievements/achievements.png', 350, 60 ),
	zIndex:1000,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim('idle', 1, [0])
		
	},
	
	setAnimation:function(){
		//this.
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