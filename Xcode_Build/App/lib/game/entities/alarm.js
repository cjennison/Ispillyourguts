ig.module(
	'game.entities.alarm'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityAlarm = ig.Entity.extend({
	size: {x: 8, y: 10},
	
	animSheet: new ig.AnimationSheet( 'media/alarms.png', 8, 10 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		console.log(settings);
		
		this.addAnim( 'off', 1, [0] );
		this.addAnim( 'on', 1, [1] );
                               
                               this.gravityFactor = 0;
		
	},
	
	
	update: function() {
      
        
        this.parent();
	},
                                      
        
	
	
	
});

});