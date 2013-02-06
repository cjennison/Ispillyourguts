ig.module(
	'game.entities.alarm'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityAlarm = ig.Entity.extend({
	size: {x: 8, y: 10},
	isAlarm:true,
	animSheet: new ig.AnimationSheet( 'media/objects/alarms.png', 8, 10 ),
		type: ig.Entity.TYPE.A,

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		console.log(settings);
		
		this.addAnim( 'off', 1, [0] );
		this.addAnim( 'on', 1, [1] );
                               
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