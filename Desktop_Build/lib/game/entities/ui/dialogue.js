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
	textObject: "Null",
	animSheet: new ig.AnimationSheet( 'media/screens/intro/overlay.png', 568, 240 ),
	zIndex:1000,
	killTimer:null,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim('idle', 1, [0])
		this.currentAnim.alpha = .8;
		this.gravityFactor = 0;
		this.killTimer = new ig.Timer();

	},
	
	setText:function(text){
		this.textObject = text;
	},
	
	update: function() {
       var player = ig.game.getEntitiesByType(EntityPlayer)[0];
       if(player){
       	 	this.pos.x = player.pos.x - ig.system.width/2;
            this.pos.y = player.pos.y - ig.system.height/2;
       }
        
        if(this.killTimer.delta() > 5){
        	this.currentAnim.alpha -= .01;
        	this.font.alpha -= .01;
        	if(this.currentAnim.alpha <= 0){
        		this.currentAnim.alpha = .8;
        		this.font.alpha = 1;
        		this.killTimer.reset();
        		this.killTimer = null;
        		this.kill();
        	}
        }
        
        if(ig.input.pressed('enter')){
        	this.kill();
        }
        
        this.parent();
	},
                                      
    draw: function(){
    	this.parent();

    	var x = ig.system.width/2,
			y = ig.system.height/2;
		 
        	this.font.draw( this.textObject, x, y, ig.Font.ALIGN.CENTER );
        	
        
    },                  		                
	
	kill: function(){
		ig.game.dialogueActive = false;
		this.parent();	
	}
	
	
});

});