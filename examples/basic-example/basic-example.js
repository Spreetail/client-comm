(function() {

	// Elements
	var	
		$message = $('#txtMessage'),
		$send = $('#btnSend');

	// Setup our communication hub.
	var hub = ClientComm.Hub('basic-example');
	var client = hub.createSubscriber();
	
	client.onMessage = function(msg) {
		$message.val(msg);
	};

	$send.click(function() {
		client.broadcast($message.val());
	});

})();