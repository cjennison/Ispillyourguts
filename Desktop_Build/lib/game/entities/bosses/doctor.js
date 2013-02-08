ig.module(
	'game.entities.bosses.doctor'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityBossDoctor = ig.Entity.extend({
	
	name:"boss",
	dead:false,
	size: {x: 70, y: 50},
	offset:{x:0, y:0},
	animSheet: new ig.AnimationSheet( 'media/levels/hospital/bossDoc.png', 70, 60 ),
	type: ig.Entity.TYPE.B, // Evil enemy group
	
	deadTimer:null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		console.log(settings);
		
		this.addAnim( 'idle', .05, [0,1,2], false);
		this.addAnim( 'dying', .9, [3,4,5], false);
		this.addAnim( 'dead', .9, [5], true);
		
	},
	
	decapitate:function(){
		this.currentAnim = this.anims.dying;
		this.deadTimer = new ig.Timer();
		
		if(!Data.doctorDecapitated){
				ig.game.queAchievement("headsup");
				Data.doctorDecapitated = true;
			}
	},

	performBossFinal:function(){
		
	},
	update: function() {
		if(this.deadTimer != null){
        if(this.deadTimer.delta() > 1.5){
		this.currentAnim = this.anims.dead;
        }
       }
        this.parent();
	},
                                      
    kill:function(){
    	this.decapitate();
		this.dead = true;
		
		ig.game.spawnEntity(EntityHeadExplosion, this.pos.x, this.pos.y);
    }
	
	
	
});


EntityHeadExplosion = ig.Entity.extend({
        lifetime: 10,
        callBack: null,
        particles: 1,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityHeadParticle, x, y);
                this.idleTimer = new ig.Timer();
            },
            update: function() {
               
            }
    });
    EntityHeadParticle = ig.Entity.extend({
        size: {x: 15, y: 15},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.PASSIVE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/levels/hospital/docHead.png', 15, 15 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 0.2, [0] );
            this.vel.x = (Math.random() * 2 - 2) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            
           // this.currentAnim.angle += this.vel.x/2;
            /*
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            */
            this.parent();
        }
    });

});