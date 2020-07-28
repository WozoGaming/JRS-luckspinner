window.gameWrapper = (function() {

	var gameWrapper = {
		//Say ty game wrapper that game is busy. Free spins, bonus game or spin are running
		setBusy: function() {
			// old version of messaging
			// window.parent.postMessage(JSON.stringify({
			// 	"type" : "status",
			// 	"payload" : {
			// 		"freeSpins" : true
			// 	}
			// }),"*");


			window.parent.postMessage(JSON.stringify({
				"idle": false
			}), "*");
		},
		//Say ty game wrapper that game is in Idle state. Game wrapper will be able to show some screens
		setIdle: function() {
			// old version of messaging
			// window.parent.postMessage(JSON.stringify({
			// 	"type" : "status",
			// 	"payload" : {
			// 		"freeSpins" : false
			// 	}
			// }),"*");

			window.parent.postMessage(JSON.stringify({
				"idle": true
			}), "*");
		},
		onWrapperActivated: function() {
			//console.log('%c Wrapper Activated ', 'background: green; color:white;');
		},
		onWrapperDeactivated: function() {
			//console.log('%c Wrapper Deactivated ', 'background: green; color:white;');
		}
	};

	function onWrapperActivityChanged(activity) {
		if (!gameWrapper) {
			return false;
		}
		if (activity) {
			if (typeof gameWrapper.onWrapperActivated === 'function') {
				gameWrapper.onWrapperActivated();
			}
		} else {
			if (typeof gameWrapper.onWrapperDeactivated === 'function') {
				gameWrapper.onWrapperDeactivated();
			}
		}
	}

	//subscribe to messages from game wrapper client
	window.addEventListener('message', function(message) {
		//console.log('message from gameWrapper: ', message.data);
        var data;
        try {
        	data = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
		} catch (err) {
        	return;
		}

		if (data.gameWrapper !== undefined) {
			onWrapperActivityChanged(data.gameWrapper);
			return;
		}

		//DEPRICATED check old version of wrapper message
		if (data.depricated) {
			return;
		}
		if (data.type !== undefined && data.name !== undefined) {
			if (data.name === 'RealityCheck') {
				onWrapperActivityChanged(data.type === 'Tilt');
			}
		}
	}, false);

	return gameWrapper;
})();