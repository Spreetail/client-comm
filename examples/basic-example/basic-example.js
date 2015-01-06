(function() {

	// Elements
	var
		$messages = $('.chat > ul'),
		$newMessage = $('#txtMessage'),
		$send = $('#btnSend');

	// Setup our communication hub.
	var hub = new ClientComm.Hub();

	hub.subscribe(function(data) {
		var $msg = $('<li>').text(data);
		$messages.append($msg);
	});

	// Setup our data publishing
	$send.click(function() {
		var msg = $newMessage.val();

		hub.publish(msg);
	});

})();