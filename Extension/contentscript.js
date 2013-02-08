chrome.extension.sendRequest({}, function(response) {});

var EventServer = {
	
	start : function() {
		ws = new WebSocket('ws://odin:8090');
		console.log('Connection open.');
		
		ws.onmessage = function(e) {
			console.log(e);
			
			d = JSON.parse(e.data);
			
			switch(d.action) {
			case 'player_next':
			case 'player_play_pause':
			case 'player_previous':
				document.getElementById(d.action).click();

				break;
			}
		}
		
	}
	
	
}

EventServer.start();

//console.log(document.getElementById('player_next'));

/*try { console.log($); } catch (e) {}

window.onload = function( ) {
	setTimeout(function() {
			console.log('>>>');
			try { console.log(jQuery); } catch (e) {}
			try { console.log($); } catch (e) {}
			try { console.log(window); } catch (e) {}
			try { console.log(document.getElementById('player_next')); } catch (e) {}
	}, 4000);
	try { console.log($); } catch (e) {}
	console.log(document.readyState);
	chrome.extension.sendRequest({}, function(response) {});
}*/

