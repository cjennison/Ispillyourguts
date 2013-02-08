ig.module(
	'game.entities.objects.objects'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

	EntitySurgicalTable = ig.Entity.extend({
		size: {x: 27, y: 32},
		animSheet: new ig.AnimationSheet( 'media/objects/surgicaltablething.png', 27, 37 ),
		type: ig.Entity.TYPE.A,
	
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			console.log(settings);
			
			this.addAnim( 'idle', 1, [0] );
		},
		
		
		update: function() {
	        this.parent();
		},
	});
	
	EntityEndTable = ig.Entity.extend({
		size: {x: 27, y: 32},
		animSheet: new ig.AnimationSheet( 'media/objects/coffeetablething.png', 22, 29 ),
		type: ig.Entity.TYPE.A,
	
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			console.log(settings);
			
			this.addAnim( 'idle', 1, [0] );
		},
		
		
		update: function() {
	        this.parent();
		},
	});
	
	EntityCoffeeTable = ig.Entity.extend({
		size: {x: 59, y: 30},
		animSheet: new ig.AnimationSheet( 'media/objects/coffeetable.png', 59, 33 ),
		type: ig.Entity.TYPE.A,
	
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			console.log(settings);
			
			this.addAnim( 'idle', 1, [0] );
		},
		
		
		update: function() {
	        this.parent();
		},
	});
	
	EntityPosterOne = ig.Entity.extend({
		size: {x: 59, y: 30},
		animSheet: new ig.AnimationSheet( 'media/objects/posterone.png', 33, 43 ),
	
		
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
	
	EntityPosterTwo = ig.Entity.extend({
		size: {x: 59, y: 30},
		animSheet: new ig.AnimationSheet( 'media/objects/postertwo.png', 30, 46 ),
	
		
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
	
	EntityPosterThree = ig.Entity.extend({
		size: {x: 59, y: 30},
		animSheet: new ig.AnimationSheet( 'media/objects/posterthree.png', 37, 52 ),
	
		
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