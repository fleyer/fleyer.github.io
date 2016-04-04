function photoClickHandler(e){
    $('.photo').off('click',photoClickHandler);
    $('drawer').velocity({
        translateZ: 0,
		left: "0",
		easing: "swing"	
    },{
        complete:function(){
            $('drawer').toggleClass('opened');
        }
    });
}

function closeMenu(){
     $('drawer').velocity('reverse',{
        complete:function(){
            $('drawer > .chemin').empty();
            $('drawer').toggleClass('opened');
            $('.photo').on('click', photoClickHandler)
        }
    });
}

$('.photo').on('click', photoClickHandler)

$(document).keydown(function(e){
    if (e.keyCode == 27 && $('drawer').hasClass('opened')){
        e.preventDefault();
       closeMenu();
    }
})

$(document).on('click touchstop',function(e){
    if(!$(e.target).is('drawer') && !$(e.target).is('span.glyphicon.glyphicon-remove') &&
        $('drawer').hasClass('opened')){
       closeMenu();
    }
})

/*$(document).on('keypress',function(e){
    console.log('ok');
    if (e.keyCode == 27 && $('drawer').hasClass('opened')){
        $('drawer').velocity('reverse');
        $('drawer').toggleClass('opened');
    }
})*/