var baseURI = "http://localhost:8080/waslab02";
var tweetsURI = baseURI+"/tweets";

var req;
var tweetBlock = "	<div id='tweet_{0}' class='wallitem'>\n\
	<div class='likes'>\n\
	<span class='numlikes'>{1}</span><br /> <span\n\
	class='plt'>people like this</span><br /> <br />\n\
	<button onclick='{5}Handler(\"{0}\")'>{5}</button>\n\
	<br />\n\
	</div>\n\
	<div class='item'>\n\
	<h4>\n\
	<em>{2}</em> on {4}\n\
	</h4>\n\
	<p>{3}</p>\n\
	</div>\n\
	</div>\n";

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
			? args[number]
		: match
		;
	});
};

function likeHandler(tweetID) {
	var target = 'tweet_' + tweetID;
	var uri = tweetsURI+ "/" + tweetID +"/likes";
	// e.g. to like tweet #6 we call http://localhost:8080/waslab02/tweets/6/like

	req = new XMLHttpRequest();
	req.open('POST', uri, /*async*/true);
	req.onload = function() { 
		if (req.status == 200) { // 200 OK
			document.getElementById(target).getElementsByClassName("numlikes")[0].innerHTML = req.responseText;
		}
	};
	req.send(/*no params*/null);
}

function deleteHandler(tweetID) {
	/*

	 * TASK #4 */
	 req = new XMLHttpRequest();
	req.open('delete', tweetsURI + "/" + tweetID, /*async*/true);
	req.onload = function() {
		if ( req.status == 200) {
			var element = document.getElementById("tweet_" + tweetID);
			//element.parentNode.removeChild(element);
			element.remove(element);
		}
	};
	req.send(/*no params*/null);

	 
}

function getTweetHTML(tweet, action) {  // action :== "like" xor "delete"
	var dat = new Date(tweet.date);
	var dd = dat.toDateString()+" @ "+dat.toLocaleTimeString();
	return tweetBlock.format(tweet.id, tweet.likes, tweet.author, tweet.text, dd, action);

}

function getTweets() {
	req = new XMLHttpRequest(); 
	req.open("GET", tweetsURI, true); 
	req.onload = function() {
		if (req.status == 200) { // 200 OK
			
			var tweet_list = JSON.parse(req.responseText);
			for (tt of tweet_list) {
				document.getElementById("tweet_list").innerHTML += getTweetHTML(tt, "delete");
			}
		}
	};
	req.send(null); 
};


function tweetHandler() {
	var author = document.getElementById("tweet_author").value;
	var text = document.getElementById("tweet_text").value;
	/*
	 * TASK #3 -->
	 */
	//var mes1 = "Someone ({0}) wants to insert a new tweet ('{1}'),\n but this feature is not implemented yet!";
	//alert(mes1.format(author, text));
	req = new XMLHttpRequest();
		req.open('POST', tweetsURI, /*async*/true);
		req.onreadystatechange = function() {
			if (req.status == 200) {
				var tweet = req.responseText;
				var nt = JSON.parse(tweet);
				var currentHTML = document.getElementById("tweet_list").innerHTML;
				document.getElementById("tweet_list").innerHTML = getTweetHTML(nt, "delete") + currentHTML;
			}
		};
		req.setRequestHeader("Content-Type","application/json");
		var tweet = JSON.stringify(
				{
					author: author,
					text: text
				}
		);
		req.send(tweet);
	// clear form fields
	document.getElementById("tweet_author").value = "";
	document.getElementById("tweet_text").value = "";

};

//main
function main() {
	document.getElementById("tweet_submit").onclick = tweetHandler;
	getTweets();
};
