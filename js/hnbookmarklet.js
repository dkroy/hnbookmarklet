var hnbookmarklet = (function( global, undefined ) {
    var hnsearch = {
        url : "http://api.thriftdb.com/api.hnsearch.com/items/_search",
        frontPage : "http://pipes.yahoo.com/pipes/pipe.run?_id=43ff25fbe7e150e2ed82a2644971c923&_render=json&rssUrl=https://www.hnsearch.com/rss",
        filter :{
            top    : {
                      limit : 30,
                      sortby : "product(points,pow(2,div(div(ms(create_ts,NOW),3600000),72))) desc",
                       'filter[fields][type]': 'submission'
                      },
            newest : { 
                       limit:30,
                       sortby:"create_ts desc",
                       'filter[fields][type]': 'submission'
                     },
            askHN  : {
                        limit:30,
                        sortby:'create_ts desc',
                        'filter[queries][]':'title:("ask hn")',
                        'filter[fields][type]': 'submission'
                     },  
            showHN : {
                        'filter[queries][]':'title:("show hn")',
                        limit:30,
                        sortby:'create_ts desc',
                        'filter[fields][type]': 'submission'
                     }
         }
    };
	
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = 0, len = this.length; i < len; i++) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };
    function waitIcon(show){
        if(show === true){
            document.getElementById("posts-container").innerHTML = ("<img id='waiting' src='./images/pending.gif' />");
        }else{
            if(document.getElementById("waiting") != null)
                document.getElementById("waiting").remove();
        }
    } 
	function attachListeners(){
		$('#show-hn').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "jsonp",
			  url: hnsearch.url,
			  data: hnsearch.filter.showHN,
			  success: getFeed
			});
		});
		$('#newest').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "jsonp",
			  url: hnsearch.url,
			  data: hnsearch.filter.newest,
			  success: getFeed
			});
		});
		$('#ask-hn').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "jsonp",
			  url: hnsearch.url,
			  data: hnsearch.filter.askHN,
			  success: getFeed
			});
		});
	}
	function initBookmark() { 
		waitIcon(true);
		$.ajax({
		  dataType: "json",
		  url: hnsearch.frontPage,
		  success: getFeed
		});
		attachListeners();
    }

    var posts = [];
    function getFeed(data){
      posts = [];
	  var numberOfPosts = (typeof data.count === "undefined")?data.results.length:data.count;
      for(var i = 0; i < numberOfPosts; i++ ) {
        var HackerNewsPost, post = undefined;
		if(typeof data.results === "undefined"){
			post = data.value.items[i];
			post.url = post.link;
			post.id = post.comments.replace('https://news.ycombinator.com/item?id=','');
		}
		post = post || data.results[i].item;
		//link and comments
        HackerNewsPost = {
            id : post.id,
            points : post.points,
            title : post.title,
            url : (post.url === null)? "https://news.ycombinator.com/item?id="+ post.id : post.url,
            createdAt : post.create_ts,
            postedBy : post.username,
            text : post.text,
            comments : post.num_comments
        };
        HackerNewsPost.html = "<li><a target='_blank' href='"+HackerNewsPost.url+"'>"+HackerNewsPost.title+"</a><div class='subtext'>"+HackerNewsPost.points+" points | <a target='_blank' href='https://news.ycombinator.com/item?id="+ HackerNewsPost.id +"'>"+HackerNewsPost.comments+" comments</a></div></li>";
        posts.push(HackerNewsPost);
        // posts.sort(function(a, b) {return b.points - a.points}); 
      }
       list = document.createElement( 'ul' );
       list.setAttribute('id','posts');
       var postsHtml = '';
       for(var i in posts)
            postsHtml += posts[i].html;
       list.innerHTML = postsHtml;
       waitIcon(false);
       $('#posts-container').html(list);
    }
	function attachStyle(style){
		var cssLink = document.createElement('link');
	    cssLink.setAttribute('rel', 'stylesheet');
		cssLink.setAttribute('href', host + style);
		var styles = document.head.getElementsByTagName("link");
		for(var i = 0; i < styles.length; i++){
		if(styles[i].getAttribute('href') === cssLink.getAttribute('href'))
			return;
		}
		document.head.appendChild(cssLink);
	};
	function renderInterface(){
		attachStyle(location.protocol.replace('file','http')+'//rawgithub.com/dkroy/hnbookmarklet/gh-pages/css/hnbookmarklet.css');
		var html = '<div id="hnbookmarklet-container"> \
			<div id="header"> \
				<span id="logo"><a href=""><img src="https://news.ycombinator.com/y18.gif" /> HN Boomarklet</a></span> \
				<a href="javascript:window.location=%22http://news.ycombinator.com/submitlink?u=%22+encodeURIComponent(document.location)+%22&t=%22+encodeURIComponent(document.title);">Submit</a> | \
				<a id="newest" href="#newest">Newest</a> | \
				<a id="show-hn" href="#showHN">Show HN</a> | \
				<a id="ask-hn" href="#askHN">Ask HN</a>\
			</div> \
			<div id="posts-container"></div> \
			<div id="hnbookmarklet-close"><a href="javascript: window.document.body.removeChild(window.document.getElementById(\'hnbookmarklet-container\')); void(0);">Close</a></div> \
		</div>';
		document.body.innerHTML += html;
	};
	var core = {
		init : function(){
			if(document.getElementById('hnbookmarklet-container') === null)
				renderInterface();
			if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too  
				script = document.createElement( 'script' );  
			   script.src = location.protocol.replace('file','http')+'//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';   
				script.onload=initBookmark;  
				document.body.appendChild(script);  
			}   
			else {  
				initBookmark();  
			}  
		}
	};
	return core;
}( this ) );
    
