(function() {

	// Utilities

	var utils = {
		generateGuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
	};

	var defaults = {
		hub: {},
		listener: {}
	};

	// Base objects	

	var Hub = function(data) {		
		var context = this;

		this.name = data.name || '';
		this.subscriberIds = data.subscriberIds || [];		

		this.save = function() {			
			localStorage.setItem(this.name, JSON.stringify(this));
		};		

		this.destroy = function() {
			localStorage.removeItem(this.name);
		};

		this.CreateSubscriber = function() {
			var sub = new Subscriber(this);
			
			this.subscriberIds.push(sub.id);		
			this.save();

			return sub;	
		};			
	};
	
	var Subscriber = function(hub) {
		var context = this;

		this.id = utils.generateGuid();
		this.hubName = hub.name;
		this.messageKey = hub.name + '-msg';
		this.onMessage = null;			

		this.send = function(msg) {
			localStorage.setItem(this.hubName, msg);
		};

		registerEvents();
		registerCleanupTasks();

		function registerEvents() {
			if(window.addEventListener) {
				window.addEventListener('storage', handleStorageEvent, false);				
			} else {
				window.attachEvent('onstorage', handleStorageEvent);
			}

			function handleStorageEvent(event) {
				if(event.key !== context.messageKey) return;
				
				if(typeof this.onMessage !== 'function') throw "A subscribers onMessage property must be a function.";
				context.onMessage(event.newValue);
			};
		};		

		function registerCleanupTasks() {
			window.onbeforeunload = function(e) {										
				var hub = getHub(context.hubName);

				var idIdx = hub.subscriberIds.indexOf(context.id);
				if(idIdx > -1) array.splice(idIdx, 1);

				if(hub.subscriberIds.length === 0) hub.destroy();
			};
		};
	};

	// Retrieval functions

	function getHub(hubName) {
		var hubData = localStorage.getItem(hubName);
		
		if(!hubData) {
			return buildHub(hubName);						
		} else {
			return new Hub(JSON.parse(hubData));
		}
	};

	function buildHub(hubName) {
		var hub = new Hub({ name: hubName });
		hub.save();

		return hub;
	};

	// Release to global scope

	window.ClientComm = {
		Hub: getHub
	};

})();