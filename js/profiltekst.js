jQuery(document).ready(function($) {


	//////////////////////
	// 
	// 	Profiltekst.dk
	// 	Tao Kitamoto / taokitamoto.dk
	// 	2016
	// 
	//	lol ses
	// 


	// Check for tidligere besøg
	if( localStorage.getItem('seen')==null) {
		// First visit
		var returning = false;
		// console.log('first visit');
		localStorage.clear();
		var seen = [0];
		localStorage.setItem('seen', JSON.stringify(seen));
	} else {
		// Returning visit
		var returning = true;
		// console.log('returning visit');
		var seen = JSON.parse(localStorage.getItem('seen'));
		// console.log('seen: '+seen.length);
	}

	// No hash
	var count = undefined;;
	if( !window.location.hash ){
		// no hash -> random
		// get count first
		$.get('http://profiltekst.taokitamoto.dk/php/count.php', function(data) {
			count = parseInt(data);
			getRandom();
		});
	} else {
		// hash -> load specific
		// console.log('yes hash');
		$.get('http://profiltekst.taokitamoto.dk/php/count.php', function(data) {
			count = parseInt(data);
		});
		switch( getHash() ){
			case 'about':
				loadOtherIframe('about.html');
			break;
			case '':
				window.location.href = 'http://profiltekst.dk';
			break;
			default:
				if( JSON.parse(localStorage.getItem('seen')).indexOf( getHash() )==-1 ){
					getFromHash(getHash());
					seen.push(getHash());
					localStorage.setItem('seen', JSON.stringify(seen));
					var seen = JSON.parse(localStorage.getItem('seen'));
					// console.log(seen);
					localStorage.setItem('current', getHash() );
				}
				loadIframe( getHash() );
			break;
		}
	}



	// Lyt til hashchange -> vis profil
	$(window).on('hashchange', function(){
		// console.log('hash changed');
		if( getHash()!==undefined ){
			switch( getHash() ){
				case 'about':
					loadOtherIframe('about.html');
				break;
				case '':
					window.location.href = 'http://profiltekst.dk';
				break;
				default:
					loadIframe( getHash() );
				break;
			}
		}
		// console.log( JSON.parse(localStorage.getItem('seen')) );
	});


	// Navigation
	$(window).on('keydown', function(e){
		switch(e.which){
			// Forward
			case 39: // Right
				goNext();
				$(".go-back, .go-forward").addClass('low-opacity');
				$("#menu").addClass('hidden');
				return false;
			break;
			
			// Backward
			case 37:
				goPrevious();
				$(".go-back, .go-forward").addClass('low-opacity');
				$("#menu").addClass('hidden');
				return false;
			break;
		}
	});
	$(document).on('iframeEvent.keydown', function(e, data){
		switch(data){
			case 39:
				goNext();
				$(".go-back, .go-forward").addClass('low-opacity');
				$("#menu").addClass('hidden');
			break;
			case 37:
				goPrevious();
				$(".go-back, .go-forward").addClass('low-opacity');
				$("#menu").addClass('hidden');
			break;
		}
	});


	// Menu remove low opacity
	$("#menu").on('mouseover', function(){
		$(this).removeClass('hidden');
	})



	// Navigation functions
	function goNext(){
		if( getHash()!=='about' ){
			// Check om current hash er sidste i seen
			if( seen.indexOf(getHash()) == seen.length-1 ){
				// Check om der er flere tilbage eller hvad lol
				if(count==undefined){
					$.get('http://profiltekst.taokitamoto.dk/php/count.php', function(data) {
						var count = parseInt(data);
						if( seen.length < count+1 ){
							getRandom();
							$(".profiltekst.current").hide();
						} else {
							restart();
						}
					});
				} else {
					if( seen.length < count+1 ){
						getRandom();
						$(".profiltekst.current").hide();
					} else {
						restart();
					}
				}			
			} else {
				getFromHash(seen[seen.indexOf(getHash())+1]);
				$(".profiltekst.current").hide();
			}
		}
	}
	function goPrevious(){
		if( getHash()!=='about' ){
			// Check om current hash er første i seen (eller dvs 1)
			if( seen.indexOf(getHash())>1 ){
				getFromHash(seen[seen.indexOf(getHash())-1])
				$(".profiltekst.current").hide();
			} else {
				// console.log('no');
			}
		}
	}


	// Arrow click
	$(".go-forward").on('click', function(){
		goNext();
		$("#menu").addClass('hidden');
	}).on('mouseover', function(){
		$(".go-back, .go-forward").removeClass('low-opacity');
	});
	$(".go-back").on('click', function(){
		goPrevious();
		$("#menu").addClass('hidden');
	}).on('mouseover', function(){
		$(".go-back, .go-forward").removeClass('low-opacity');
	});

	// Restart
	function restart(){
		localStorage.removeItem('seen');
		localStorage.removeItem('current');
		localStorage.removeItem('count');
		window.location.href='http://profiltekst.dk';
	}


	// Lyt til iframe events
	// Besked modtaget når iframecontent er loadet -> show ifram
	$(document).on('iframeEvent.loaded', function(e, data){
		$(".profiltekst").fadeIn(200);
		$(".profiltekst.current").animate({'opacity':'1'}, 200);
		$(".profiltekst iframe").focus();
		$("body").removeClass('loading');
	});

	// Besked modtaget hvis iframe returner null på json (404 not found lol)
	$(document).on('iframeEvent.notfound', function(e, data){
		// alert("404 returned");
		window.location.href = 'http://profiltekst.dk';
	});



	// Go back from About page
	$("body").on('click', '.about-back', function(){
		if( localStorage.getItem('current')==null ){
			window.location.href = 'http://profiltekst.dk';
		} else {
			setHash(localStorage.getItem('current'));
		}
	});





	// Get random unseen
	function getRandom(){
		$("body").addClass('loading');
		$.ajax({
			url: 'http://profiltekst.taokitamoto.dk/php/random.php',
			type: 'POST',
			dataType: 'JSON',
			data: { seen: seen },
		})
		.done(function(json) {
			if( seen.indexOf(json.hash_id) == -1 ){
				setHash(json.hash_id);
				seen.push(json.hash_id);
				localStorage.setItem('seen', JSON.stringify(seen));
				localStorage.setItem('current',json.hash_id);
			} else {
				getRandom();
			}
		})
		.fail(function() {
			// console.log("error");
		});
	}

	// Get random
	function getFromHash(hash){
		$("body").addClass('loading');
		$.ajax({
			url: 'http://profiltekst.taokitamoto.dk/php/fromhash.php',
			type: 'GET',
			dataType: 'JSON',
			data: { hashid: hash },
		})
		.done(function(json) {

			if( JSON.parse(localStorage.getItem('seen')).indexOf( getHash() )==-1 ){
				// seen.push( getHash() );
				seen.push(json.hash_id);
				localStorage.setItem('seen', JSON.stringify(seen));
				// console.log(seen);
			};
			localStorage.setItem('current',json.hash_id);
			setHash(json.hash_id);

		})
		.fail(function() {
			// console.log("error");
		});
	}

	// Load to iframe
	function loadIframe(hash){
		var $profilbox = $(".profiltekst").clone();
		$profilbox.removeClass('template');
		$profilbox.find('iframe').attr('src', 'iframe.html#'+hash );
		$(".profiltekst.current").remove();
		$profilbox.hide().appendTo('.container');

		var seen = JSON.parse(localStorage.getItem('seen'));
		// console.log('Set: '+seen.length);

		if( $(".about-back").length ){
			$(".about-back").remove();
		}
		$(".go-back, .go-forward").show();

		// console.log(seen);
		if( seen.indexOf(getHash())==1 ){
			$(".go-back").hide();
			// console.log('first in seen');
		}

		// Check om alle er set, og om den er sidste i seen-array
		if(count!==undefined){
			if( seen.length >= count+1 && seen.indexOf(getHash()) == seen.length-1 ){
				$(".go-forward").addClass('last');
				$(".go-forward, .go-back").removeClass('low-opacity');
			} else {
				$(".go-forward").removeClass('last');
			}
		}

	}

	// Load other to iframe
	function loadOtherIframe(file){
		var $profilbox = $(".profiltekst").clone();
		$profilbox.removeClass('template');
		$profilbox.find('iframe').attr('src', file);
		$(".profiltekst.current").remove();
		$profilbox.hide().appendTo('.container');
		switch(file){
			case 'about.html':
				$("body").append('<div class="about-back"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></div>');
				$(".go-back,.go-forward").hide();
			break;
		}
	}


	// Get hash content
	function getHash(){
		return window.location.hash.split('/')[1];
	}
	function setHash(hash){
		window.location.hash = '/'+hash;
	}



});