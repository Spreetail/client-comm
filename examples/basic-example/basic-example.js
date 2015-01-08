(function() {

	// Elements
	var	
		$message = $('#txtMessage'),
		$send = $('#btnSend');

	// Setup our communication hub.
	var hub = ClientComm.Hub('basic-example');
	var client = hub.CreateSubscriber();
	
})();