ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'impact.sound',
    'plugins.touch-button',
    'plugins.analog-stick',
    'game.screens.mainmenu',
    'game.screens.introduction',
    'game.entities.enemies.enemy',
    'game.entities.player',
    'game.entities.ui.detectioneye',
    'game.entities.ui.blackoverlay',
    'game.entities.ladder',
    'game.entities.door',
    'game.entities.alarm',
    'game.entities.stealthobject',
    'game.entities.hospitalbed',
    'game.entities.boxes',

    'game.levels.Hospital'
)
.defines(function(){

HospitalLevel = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/font/04b03.font.png' ),
    gravity: 150,
    fallHeight: 800,
                        
    //Buttons
    buttons: [],
    buttonImage: new ig.Image('media/buttons.png'),

    
    //Timers
    gameEndTimer: null,
    gameOver: false,
    
    enraged:false,
    enragedTimer:null,
    rageOverlay: new ig.Image('media/ui/rageoverlay.png'),

	
	init: function() {
	
	
		ig.music.next();
	
		// Initialize your game here; bind keys etc.
         ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
         ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
         ig.input.bind(ig.KEY.UP_ARROW, 'up');
         ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

         ig.input.bind(ig.KEY.CTRL, 'crouch');
         ig.input.bind(ig.KEY.SPACE, 'jump');
         ig.input.bind(ig.KEY.Z, 'quickAttack');
         ig.input.bind(ig.KEY.X, 'execute');
                        
         if(ig.ua.mobile){
             var yPos = ig.system.height - 48;
             this.buttons = [
                 //new ig.TouchButton('left', 0, yPos, 40, 48, this.buttonImage, 0),
                // new ig.TouchButton('right', 40, yPos, 40, 48, this.buttonImage, 1),
                // new ig.TouchButton('up', 80, yPos, 40, 48, this.buttonImage, 3),
                 new ig.TouchButton('quickAttack', ig.system.width - 40, yPos, 40, 48, this.buttonImage, 2),
                 new ig.TouchButton('jump', ig.system.width - 80, yPos, 40, 48, this.buttonImage, 3)
             ];
         }
                               
         var baseSize = 50;
   	     var stickSize = 20;
         var margin = 10;
         var y = ig.system.height - baseSize - margin;
         var x1 = baseSize + margin;

         this.stickLeft = new ig.AnalogStick( x1, y, baseSize, stickSize );                      
        
                               /*
        //Smooth Scrolling                
        if( window.ejecta ) {
   			 // Figure out the scaling ratio of internal to hardware pixels
   			 var hwpx = (window.innerWidth / ig.system.width) * ig.ua.pixelRatio;
   			 console.log('Hardware Pixel Scale: ', hwpx);

    	     ig.system.getDrawPos = function( p ) {
             // Snap draw positions to the closest hardware pixel
                return ((p*hwpx)|0)/hwpx;
             };
	     }
                                */
                        
                        
         this.loadLevel(LevelHospital);
         //this.spawnEntity(EntityPlayer, 32, 480);
         this.spawnEntity(EntityStealthobject, 400, 400);
         this.spawnEntity(EntityHospitalbed, 20, 480);
         this.spawnEntity(EntityBoxes, 400, 580);
         this.spawnEntity(EntityBoxes, 1280, 450);

         var nurse = this.spawnEntity(EntityEnemy, 400, 460);
         var nurse2 = this.spawnEntity(EntityEnemy, 1280, 460);
         
         var alarm = this.getEntitiesByType(EntityAlarm)[0];
         var alarm2 = this.getEntitiesByType(EntityAlarm)[1];
         nurse.setTargetAlarm(alarm);
         nurse2.setTargetAlarm(alarm2);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
        var player = this.getEntitiesByType(EntityPlayer)[0];
        if(player){
             this.screen.x = player.pos.x - ig.system.width/2;
             this.screen.y = player.pos.y - ig.system.height/2;
        }
        
        if(this.gameEndTimer){
        	if(this.gameEndTimer.delta() > 2){
        		ig.system.setGame(MainMenu);
        	}
        }
        if(this.enraged){
        	if(this.enrageTimer.delta() > 5){
        		this.enraged = false;
        		this.enrageTime = null;
        	}
        }
         
		
		// Add your own, additional update code here
	},
                        
    loadLevel: function( data ) {
         this.parent( data );
                        
          for( var i = 0; i < this.backgroundMaps.length; i++ ) {
              this.backgroundMaps[i].chunkSize = 1024;
              this.backgroundMaps[i].preRender = true;
           }
    },
    
    enrage: function(){
    	this.enrageTimer = new ig.Timer();
    	this.enraged = true;
    },
    
    endGame: function(){
    	this.gameEndTimer = new ig.Timer();
    	this.gameOver = true;
    	console.log("Game is Over");
    },
	
	draw: function() {
		// Draw all entities and backgroundMaps
        //this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
		this.parent();
		
        for(var i = 0; i < this.buttons.length; i++){
             this.buttons[i].draw();
        }
        
        if(ig.ua.mobile){
        	this.stickLeft.draw();
        }
        
       if(this.enraged){
        	this.rageOverlay.draw(0,0);
        }

		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
			
		if(this.gameOver){
			this.font.draw( 'You Died', x, y - 30, ig.Font.ALIGN.CENTER );
		}
		
		//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
         
         var height = 240;
         var scale = window.innerHeight / height;
         var width = window.innerWidth / scale;
         
         if(!ig.ua.mobile){
         	height = 240;
         	width = 568;
         }
         
         ig.System.drawMode = ig.System.DRAW.SUBPIXEL;
         ig.Sound.use = [ig.Sound.FORMAT.CAF, ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
		ig.main( '#canvas', Introduction, 60, width, height, 1 );

});
