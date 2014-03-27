var hnbookmarklet = (function( global, undefined ) {
    var hnsearch = {
        url : "https://hn.algolia.com/api/v1/search_by_date",
        frontPage : "http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedurl=https%3A%2F%2Fnews.ycombinator.com%2Frss",
        filter :{
            top    : {},
            newest : {
                        tags:'story'
                     },
            askHN  : {
                        tags:'ask_hn,story'
                     },  
            showHN : {
                        tags:'ask_hn,story'
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
    	var container = document.getElementById("posts-container");
        if(show === true){
            container.innerHTML = ("<img id='waiting' src='data:image/gif;base64,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'>");
            container.style['text-align'] = 'center';
        }else{
            if(document.getElementById("waiting") != null)
                document.getElementById("waiting").remove();
            container.style['text-align'] = 'left';
        }
    } 
	function attachListeners(){
		$('#frontpage-hn').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "json",
			  url: hnsearch.frontPage,
			  success: getFeed
			});
		});
		$('#show-hn').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "json",
			  url: hnsearch.url,
			  data: hnsearch.filter.showHN,
			  success: getFeed
			});
		});
		$('#newest').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "json",
			  url: hnsearch.url,
			  data: hnsearch.filter.newest,
			  success: getFeed
			});
		});
		$('#ask-hn').on('click', function(){
			waitIcon(true);
			$.ajax({
			  dataType: "json",
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
	  var numberOfPosts = (typeof data.count === "undefined")?data.hits.length:data.count;
      for(var i = 0; i < numberOfPosts; i++ ) {
        var HackerNewsPost, post = undefined;
		if(typeof data.hits === "undefined"){
			post = data.value.items[i];
			post.url = post.link;
			post.id = post.comments.replace('https://news.ycombinator.com/item?id=','');
		}
		post = post || data.hits[i];
		//link and comments
        HackerNewsPost = {
            id : post.objectID,
            points : post.points,
            title : post.title,
            url : (post.url === null)? "https://news.ycombinator.com/item?id="+ post.id : post.url,
            createdAt : post.created_at,
            postedBy : post.author,
            text : post.story_text,
            comments : post.num_comments
        };
        var pointsHtml = (typeof HackerNewsPost.points !== "undefined")?("<div class='subtext'>"+HackerNewsPost.points + " points | "):("<div class='subtext'>");
        HackerNewsPost.html = "<li><a target='_blank' href='"+HackerNewsPost.url+"'>"+HackerNewsPost.title+"</a>"+pointsHtml+"<a target='_blank' href='https://news.ycombinator.com/item?id="+ HackerNewsPost.id +"'>"+(HackerNewsPost.comments||"")+" comments</a></div></li>";
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
		cssLink.setAttribute('href', style);
		var styles = document.head.getElementsByTagName("link");
		for(var i = 0; i < styles.length; i++){
		if(styles[i].getAttribute('href') === cssLink.getAttribute('href'))
			return;
		}
		document.head.appendChild(cssLink);
	};
	function renderInterface(){
		attachStyle(location.protocol.replace('file','http')+'//dkroy.github.io/hnbookmarklet/css/hnbookmarklet.css');
		var html = '<div id="hnbookmarklet-container"> \
			<div id="hnbookmarklet-header"> \
				<span id="hnb-logo"><a id="frontpage-hn" href="#"><img src="https://news.ycombinator.com/y18.gif" /> HN Boomarklet</a></span> \
				<a href="javascript:window.location=%22http://news.ycombinator.com/submitlink?u=%22+encodeURIComponent(document.location)+%22&t=%22+encodeURIComponent(document.title);">Submit</a> | \
				<a id="newest" href="#">Newest</a> | \
				<a id="show-hn" href="#">Show HN</a> | \
				<a id="ask-hn" href="#">Ask HN</a>\
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
			   script.onload = initBookmark;
			   document.body.appendChild(script);
			}else{
			  initBookmark();
			}
		}
	};
	return core;
}( this ) );
    
