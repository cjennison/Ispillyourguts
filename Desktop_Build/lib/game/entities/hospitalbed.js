ig.module(
    'game.entities.hospitalbed'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityHospitalbed = EntityStealthobject.extend({
       
        
        size:{x:101,y:60},    
        offset:{x:0, y:-10},
        animSheet: new ig.AnimationSheet('media/objects/bedfixed.png',101,56),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            
        },
        
        update:function(){
        	this.parent();
        }
    

    });
});                                                                                                                               