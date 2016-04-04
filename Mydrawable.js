
var $source;
var $decal;
var $element = 'div[data-drawable="true"]';
var $others;
var $back;
var $backValue;
var $process = $.Callbacks("once");


/*****************************************************
* 
* FUNCTIONS
* **************************************************/

function mouseDownHandler(e){
	if(e.buttons == 1){
		
		$source =  $(this);
	    $decal = parseInt(e.clientX - $source.position().left);
		$back = $source.data('drawableback');	
		$backValue = $('.element').not($source).position().left;

	    $(document).on('mousemove',mouseMoveHandler);
	    $(document).on('mouseup',mouseUpHandler);
	    $(document).off('mousedown',$element,mouseDownHandler);
	    $others = $($element).not($source);
	}
	
    return false;
}

function mouseMoveHandler(e){
	var x;
    var otherX;
    
    if( e.buttons != 1 || $('.right').hasClass('opened')){
    	return false;
    }
    
    if( e.clientX-$decal > 0 && e.clientX-$decal + $source.width()  < $(window).width() ){
        x = parseFloat(e.clientX-$decal);
        otherX = 15*$(document).width()/100 + (15*$('body').width()/100-x);
    }
		
	if( e.clientX-$decal + $source.width() >= $('body').width() ){
		x = $('body').width() - $source.width();
		otherX = 0
	}
	
	if( x < 15*$(document).width()/100){
		x = 15*$('body').width()/100;
		otherX = 15*$('body').width()/100;
	   	
	}
	
	$source.css('left',x);
   	$others.css('left',otherX);

    //$source.find('p').text($source.position().left+" "+$('.gauche').width());
    return false;
}

function mouseUpHandler(e){
	var Moved = Math.round($source.position().left) != Math.round(15*$('body').width()/100);
	if(Moved){
		$source.velocity({
	        translateZ: 0,
	        left: $back,
	        easing: "swing"    
	    },{
	    	duration:200
	    });		
	}
	
    if($source.position().left + $source.width() > $('body').width()*0.90){
    	hideLeft($others);
    }else{ 
    	if(Moved)
	    	$others.velocity({
				translateZ: 0,
				left: $back,
				easing: "swing" 	
	    	});
		$(document).on('mousedown',$element,mouseDownHandler);
    }
    
	$(document).off('mousemove',mouseMoveHandler);
	$(document).off('mouseup',mouseUpHandler);
	
	
	return false;
}

function hideLeft($elems,boolean,f){
	var elemsLeft = $elems.first().width();
	$(document).off('mousedown',$element,mouseDownHandler);
		
	if(boolean)
		$source = $('div[data-hash="'+location.hash.replace('#','')+'"]');
	
	$('.right').load($source.data('load'));
	
	$elems.velocity({
		translateZ: 0,
		left: "-100%",
		easing: "swing",
	},{
		complete: function(){
			$('.wrapper > .path').text($source.find('.title').text());
			$('.wrapper > .path').css('background-color',$source.css('background-color'));
			$('.path').fadeIn(200);
			$source.velocity({
				translateZ: 0,
				top: -($('.content').position().top + $source.position().top +$source.height()),
				easing: "swing",
			},{
				duration:200,
				complete: function(){
					$('.right').velocity({
						translateZ: 0,
						left: "10%",
						easing: "swing",
						width: "80%"
					},{
						 duration: 200,
					});
					toggleOpened();
					location.hash = $source.data('hash');
				}
			});
		},
	});
	$source.toggleClass('hover');
	if( f)
		f();
}

function outLeft($elems){
	var elemsLeft;
	elemsLeft = $elems.first().next().data('drawableback');
	$source.velocity('reverse');
	$('.path').fadeOut(200);
	$('.right > *').fadeOut(200);
	$('.right').empty();
	$source.toggleClass('hover');
	$elems.velocity("reverse");
	$elems.velocity({
		translateZ: 0,
		left: $elems.data('drawableback'),
		easing: "swing"	
	});
	
	$('.right').velocity('reverse');
	$(document).on('mousedown',$element,mouseDownHandler);
	toggleOpened();
	
}

function toggleOpened(){
	$('.left').toggleClass('opened');
	$('.right').toggleClass('opened');
}

function tapHandler(e){
	e.preventDefault();
	$('.element').off('touchstart',tapHandler);
	$source =  $(this);
	location.hash = $source.data('hash');
	
	hideLeft($('.element').not($source),false,function(){
		console.log('ok');
		$('.element').on('touchstart',tapHandler);
	});
}
/*****************************************************
* 
* BINDINGS
* **************************************************/
$('.element').on('touchstart',tapHandler);

$(document).on('mousedown',$element,mouseDownHandler);
	
$(window).on("hashchange", function (e,data) {
	if(location.hash == '' && $('.right').hasClass('opened')){
		outLeft($('.element').not($source))

	}
	if(location.hash != '' && $('.left').hasClass('opened')){
		hideLeft($('.element').not('div[data-hash="'+location.hash.replace('#','')+'"]'),true);
	}
	
	if(location.hash == '' && $('.left').hasClass('opened')){

	}
});

/*$(document).keydown(function(e){
    if (e.keyCode == 8 ){
		if( location.hash != '' && $('.right').hasClass('opened')){
			$('.velocity-animating').velocity("stop",true);
			$source.velocity({
				translateZ: 0,
				left: $back,
				easing: "swing"    
			},{
				duration:200
			});
			$others.velocity({
				translateZ: 0,
				left: $others.data('drawableback'),
				easing: "swing"	
			});
			$('.title.chemin').fadeOut(200);
			$('.right').velocity('reverse');
			toggleOpened();
			$(document).on('mousedown',$element,mouseDownHandler);
		}
    }
})*/
