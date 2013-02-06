ig.module(
    'game.entities.hospitalbed'
    )
.requires(
    'impact.entity'
    )
.defines(function(){
    EntityHospitalbed = EntityStealthobject.extend({
       
        
        size:{x:89,y:57},    
        offset:{x:0, y:-16},
        animSheet: new ig.AnimationSheet('media/objects/bed.png',89,57),
    
        init: function( x, y, settings ) {
            this.parent(x,y,settings );
            
        },
        
        update:function(){
        	this.parent();
        }
    

    });
});                                                                                                                               