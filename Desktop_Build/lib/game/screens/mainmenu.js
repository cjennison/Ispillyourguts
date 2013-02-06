ig.module( 
	'game.screens.mainmenu' 
)
.requires(
	'impact.game',
    'impact.sound',
	'impact.font'
)
.defines(function(){

MainMenu = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    
    //Buttons
    buttons: [],
    buttonImage: new ig.Image('media/screens/mainmenu/playbtnsettwo_down.png'),                    
    bgImage: new ig.Image('media/screens/mainmenu/bg.png'),
    logoImage: new ig.Image('media/screens/mainmenu/logo.png'),
	
	
	init: function() {
		
		// Initialize your game here; bind keys etc.
		ig.music.add('media/music/MenuMusic.*', "mainmenu");
		ig.music.add('media/music/theme.*', "hospital");
		ig.music.loop = true;
		ig.music.volume = .1;
		ig.music.play();
		
		
		console.log(ig.music.tracks)
		
		
        ig.input.bind(ig.KEY.ENTER, 'start');
        
        var x = 55,
			y = ig.system.height/2;
                        
         if(ig.ua.mobile){
             this.buttons = [
                 new ig.TouchButton('start', x, y, 150, 75, this.buttonImage, 0),
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
		
		this.parent();
        
		this.bgImage.draw(ig.system.width - this.bgImage.width, 0);
                          
        this.logoImage.draw(ig.system.width/2 - this.logoImage.width/2 - 20, 0);

		for(var i = 0; i < this.buttons.length; i++){
             this.buttons[i].draw();
        }
       
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2 + 90;
		 if(!ig.ua.mobile){
        	this.font.draw( 'PRESS ENTER', x, y, ig.Font.ALIGN.CENTER );
        }
	}
});

});