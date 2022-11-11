/* Phillips scroll tracker */
var _scrollTracker = function(contentElement, debug) {

	var debug              = debug,
		elemRect             = contentElement.getBoundingClientRect(),
		bodyRect		         = document.body.getBoundingClientRect(),
		offset               = 199,
		timer			           = 0,
		timerOffset		       = new Date().getTime(),
        wordCount        = contentElement.innerText.trim().split(' ').length,
        avgReadSpeed     = 250/60;
  
  var readingTime        = (wordCount/avgReadSpeed)*1000;

	var documentHeight     = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	var viewportHeight     = Math.max(document.documentElement.clientHeight, window.innerHeight);
	var scrollPositionTop  = function() { return Math.max(document.documentElement.scrollTop, document.body.scrollTop); };
	var scrollPositionBot  = function() { return viewportHeight + scrollPositionTop(); };
	var elemPositionTop    = elemRect.top - bodyRect.top;
	var elemPositionBot    = elemRect.bottom - bodyRect.top;

	var scrollStarted      = false,
		startedReading       = false,
		reachedMid           = false,
		endReached           = false,
		bottomReached        = false;

	function init() {

		if(scrollPositionTop() > offset && !scrollStarted) {
			scrollStarted = true;
		}

		if(scrollPositionTop() > elemPositionTop && !startedReading) {
			startedReading = true;
		}

		if(scrollPositionBot() >= elemPositionBot && !endReached) {
			var endTime = new Date().getTime() - timerOffset;
			var readerType = (endTime > readingTime) ? 'Content Read' : 'Content Scanned';
            var reads = (readerType == 'Content Read') ? 1 : 0;
            var scans = (readerType == 'Content Scanned') ? 1 : 0;
            var readerVars = [endTime, readingTime, readerType, reads];

			var eventReaderType = {
				'event' : 'contentConsumption',
				'contentCategory' : 'Content Consumption',
				'contentAction' : readerType,
				'contentLabel' : document.title,
                'contentReads' : reads,
                'contentScans' : scans,
				'noninteraction' : 0
			};

			(!debug) ? dataLayer.push(eventReaderType) : console.log(eventReaderType);
          
            console.log(readerVars);
            console.log(eventReaderType);

			endReached = true;
		}

		if(scrollPositionBot() >= documentHeight && !bottomReached) {
			bottomReached = true;
		}

	}

    window.addEventListener('scroll', function() {
    	if(timer) {
    		clearTimeout(timer);
    	}
    	timer = setTimeout(init, 100);
    }, false);
}

_scrollTracker(document.querySelector('body.posts .container .content .post.single'), false);
