ig.module(
    'game.entities.boxes'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityBoxes = EntityStealthobject.extend({
       
        
        size:{x:89,y:57},    
        offset:{x:0, y:2},
        animSheet: new ig.AnimationSheet('media/objects/boxes.png',68,63),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            
        },
        
        update:function(){
        	this.parent();
        }
    

    });
});                                                                                                                               