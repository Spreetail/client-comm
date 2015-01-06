(function() {

	var utils = {
		generateHubName: function() {
			var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});

			console.debug('Hub: Generated Hub Name ' + guid);
			return guid;
		}
	};

	var defaults = {
		hub: {

		}
	};	

	var Hub = function(settings) {
		settings = $.extend({}, defaults.hub, settings);
		var self = this;		

		this.name = settings.name || utils.generateHubName();
		this.subscription = settings.subscription || null;

		if(this.subscription) setupEvents();		
		this.subscribe = function(handler) {
			console.debug('Hub: Subscription Setup');
			this.subscription = handler;
			setupEvents();
		};

		this.publish = function(msg) {
			console.debug('Hub: Message Published - ' + msg);
			publishToListeners(msg);
		};

		function setupEvents() {
			console.debug('Hub: Setup Events');
			window.addEventListener('storage', notifySubscriptions, false);
		};		

		function publishToListeners(msg) {
			localStorage.setItem(self.name, msg);
		};	

		function notifySubscriptions(event) {
			if(!self.subscription) return console.debug('Hub: There are no subscriptions.');
			self.subscription(event.newValue);
		};

	};

	// Release to global scope.
	window.ClientComm = {
		Hub: Hub
	};

})();