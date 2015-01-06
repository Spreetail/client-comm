(function() {

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

	var Listener = function(settings) {
		settings = $.extend({}, defaults.listener, settings);			
	};

	var Hub = function(settings) {
		settings = $.extend({}, defaults.hub, settings);		
		
		this.name = settings.name;		
	};
	
	function checkBuildHub(hubName) {
		var hub = localStorage.getItem(hubName);
		
		if(!hub) hub = buildHub(hubName);
		return subscribeToHub(hub)
	};

	function buildHub(hubName) {
		return new Hub({ name: hubName });		
	};

	function subscribeToHub(hub) {
		var listener = new Listener();		
		return listener;
	};

	// Release to global scope.
	window.ClientComm = {
		Hub: checkBuildHub
	};

})();