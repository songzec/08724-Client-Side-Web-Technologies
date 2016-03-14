(function() {
	
	var init = new XMLHttpRequest();

	init.onreadystatechange = function() {
		if(init.readyState === XMLHttpRequest.DONE) {
			/*
			 * Check the HTTP response code to make sure it was successful.
			 */
			if( ( 200 <= init.status && init.status < 300 ) || init.status === 304 ) {
				/*
				 * Deserialize the JSON returned.
				 */
				var dat = JSON.parse(init.responseText);
				var section = document.querySelector("select");
				section.innerHTML = "";
				var id = 1;
				dat.forEach(
					function(val, index, array) {
						section.innerHTML += "<option>" + val.name + "</option>";
						id = id + 1;
					}
				);
			} else {
				alert("Error: " + init.status);
			}
			init = null;
		}
	}
	init.open("get", "http://csw08724.appspot.com/breeds.ajax", true);

	init.send(null);
	display();

	document.querySelector("select").addEventListener("change", display, false);

	
	function display() {
	
		/*
		 * Create a new XMLHttpRequest instance.
		 * 
		 * http://www.w3.org/TR/XMLHttpRequest2/
		 * 
		 * Not all parts of level 2 have been implemented by all browsers, but much of
		 * what is in the spec has been. As always, it is important to verify
		 * the functionality that you want to use with respect to its adoption by your targeted browsers.
		 */
		var xhr = new XMLHttpRequest();
		
		/*
		 * There are events on the object that we can listen to in order
		 * to take appropriate actions as needed.
		 */
		xhr.onreadystatechange = function() {
			/*
			 * No event object is passed in so we can
			 * just reference the xhr object instance inside
			 * the handler - this handler will become a closure since it will
			 * be able to access xhr.
			 */

			/*
			 * State:
			 *
			 * 1 - Open			open() called but not send()
			 * 2 - Sent			send() called but no response
			 * 3 - Receiving	some data has been received
			 * 4 - Complete		Response is finished and we can use the response data
			 *
			 */
			console.log("Ready State: " + xhr.readyState);
			
			if(xhr.readyState === XMLHttpRequest.DONE) {
				/*
				 * Check the HTTP response code to make sure it was successful.
				 */
				if( ( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304 ) {
					/*
					 * Deserialize the JSON returned.
					 */
					var data = JSON.parse(xhr.responseText);

					var nameTag = document.querySelector("h1[id='breed-name']");
					nameTag.innerHTML = data.name;

					var descriptionTag = document.querySelector("div[id='description']");
					descriptionTag.innerHTML = data.description;

					var originsTag = document.querySelector("div[id='origins']");
					originsTag.innerHTML = data.origins;

					var rightForYouTag = document.querySelector("div[id='rightForYou']");
					rightForYouTag.innerHTML = data.rightForYou;

					var imgTag = document.querySelector("img");
					imgTag.src = "http://csw08724.appspot.com/" + data.imageUrl;
					var index = 0;
					

				} else {
					alert("Error: " + xhr.status);
				}
				xhr = null;
			}
		};
		
		/*
		 * Specify the HTTP method, URL, and whether it should be asynchronous
		 */
		
		var currentId = document.querySelector("select").selectedIndex + 1;
		if (currentId === 0) {
			currentId = 1;
		}
		console.log(currentId);
		var uri  = "http://csw08724.appspot.com/breed.ajax?id=" + currentId;
		console.log(uri);
		xhr.open("get", uri, true);
		
		/*
		 * Execute the request. We can send data in the request body
		 * if we want, otherwise we need to specify null.
		 */
		xhr.send(null);
	}
	
})();








