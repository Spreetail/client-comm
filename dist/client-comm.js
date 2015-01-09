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
		this.key = data.name + '-msg';
		this.subscriberIds = data.subscriberIds || [];				

		this.save = function() {			
			localStorage.setItem(this.name, JSON.stringify(this));
		};				

		this.destroy = function() {
			localStorage.removeItem('basic-example');
		};		

		this.removeSubscriber = function(id) {
			var idx = this.subscriberIds.indexOf(id);

			if(idx > -1) {
				this.subscriberIds.splice(idx, 1);
				this.save();
			}

			if(this.subscriberIds.length === 0)
				this.destroy();
		};

		this.createSubscriber = function() {
			var sub = new Subscriber(this);
			
			this.subscriberIds.push(sub.id);		
			this.save();

			return sub;	
		};	

		function registerEvents() {

		};			
	};
	
	var Subscriber = function(hub) {
		var context = this;

		this.id = utils.generateGuid();
		this.hubName = hub.name;
		this.messageKey = hub.name + '-msg';
		this.onMessage = null;			

		this.broadcast = function(msg) {			
			localStorage.setItem(this.messageKey, msg);
		};

		this.destroy = function() {			
			var hub = getHub(this.hubName);			
			hub.removeSubscriber(this.id);				
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
				context.destroy();				

				return null;
			}
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
		return new Hub({ name: hubName });				
	};

	// Release to global scope

	window.ClientComm = {
		Hub: getHub
	};

})();