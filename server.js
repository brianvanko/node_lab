var request = require('request');
var async = require('async');

var http = request.defaults({
  json: true,
  headers: {
    'User-Agent': 'what-did-i-do-app',
    'Authorization': 'Token xxxxxxxxx'
  }
})

http.get('https://api.github.com/users/brianvanko/events/public',
  function (err, _, events) {
  if (err) { throw err; }

  var iteratorFn = function (event, callback) {

  	if (event.type === 'PushEvent') {
  		var url = 'https://api.github.com/repos/' + event.repo.name + '/git/commits/' + event.payload.head;

  		http.get(url, function (err, _, commit) {
  			if (err) { throw err; }
  			console.log(commit.message);
  			callback();
  		});
  	} else {
  		callback();
  	}
  };

  var doneFn = function (err) {
  	if (err) { console.error(err.toString()); }
  	console.log('done');
  }

  async.eachSeries(events, iteratorFn, doneFn);

  // events.forEach(function (event) {
  // 	if (event.type === 'PushEvent') {
  // 		var url = 'https://api.github.com/repos/' + event.repo.name + '/git/commits/' + event.payload.head;

  // 		http.get(url, function (err, _, commit) {
  // 			if (err) { throw err; }
  // 			console.log(commit.message);
  // 		})
  // 		//console.log(event.actor.login + " did " + event.type + " on " + event.repo.name);
  // 	}
  // })
});

// required vars
//   https://api.github.com/users/brianvanko/public
//  https://github.com/settings/applications#personal-access-tokens

