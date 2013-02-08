ig.module(
	'game.entities.objects.weapons'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntityWeaponWire = ig.Entity.extend({
		size: {x: 60, y: 60},
		
		name:"weapon",
		wepType:"WIRE",
		
		animSheet: new ig.AnimationSheet( 'media/weapons/wire.png', 60, 60 ),
		type: ig.Entity.TYPE.B,
	
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			console.log(settings);
			this.gravityFactor = 0;
			this.addAnim( 'idle', 1, [0] );
		},
		
		
		update: function() {
	        this.parent();
		},
	});
	
});