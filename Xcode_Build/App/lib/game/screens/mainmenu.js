ig.module( 
	'game.screens.mainmenu' 
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

MainMenu = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    
    //Buttons
    buttons: [],
    buttonImage: new ig.Image('media/buttons.png'),                    
    
	
	init: function() {
		// Initialize your game here; bind keys etc.
        
        ig.input.bind(ig.KEY.ENTER, 'start');
        
        var x = ig.system.width/2,
			y = ig.system.height/2;
                        
         if(ig.ua.mobile){
             this.buttons = [
                 new ig.TouchButton('start', x, y, 40, 48, this.buttonImage, 0),
             ];
         }
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		if( ig.input.pressed('start') ) {
			ig.system.setGame(HospitalLevel);
		}
		
		// Add your own, additional update code here
	},
                        
   
	
	draw: function() {
		// Draw all entities and backgroundMaps
        //this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
		this.parent();
		
		for(var i = 0; i < this.buttons.length; i++){
             this.buttons[i].draw();
        }
       
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});

});