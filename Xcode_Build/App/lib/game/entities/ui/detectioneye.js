ig.module(
	'game.entities.ui.detectioneye'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDetectionEye = ig.Entity.extend({
	size: {x: 16, y: 9},
	
	animSheet: new ig.AnimationSheet( 'media/spike.png', 16, 9 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'no_detect', 1, [0] );
		this.addAnim( 'half_detect', 1, [1] );
		this.addAnim( 'full_detect', 1, [2] );
		
		this.changeDetection(1);
	},
	
	
	update: function() {
        this.pos.x = ig.game.screen.x + 10;
        this.pos.y = ig.game.screen.y + 10;
        
        this.parent();
	},
                                      
                                      
	changeDetection: function(detectNum){
		switch (detectNum){
			case 1:
				this.currentAnim = this.anims.no_detect;
				break;
			case 2:
				this.currentAnim = this.anims.half_detect;
				break;
			case 3:
				this.currentAnim = this.anims.full_detect;
				break;
		
		}
	}
	
	
	
});

});