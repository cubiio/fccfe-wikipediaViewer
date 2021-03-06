/*globals $:false */

// use strict:
"use strict";

// checks if user entered a search, if not prompts the user, if yes, stores as a variable for the ajax call
function getKeyword() {
    var keyword = document.getElementById('userSearch').value;
    if (userSearch.value.length < 1) {
        confirm("Please enter a keyword to search");
    } else {
        return keyword;
    }
}

// detects if 'enter' is hit when user searches
// http://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
window.onload = function() {
    document.getElementById("userSearch") // id of textbox
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                document.getElementById("search-btn").click(); // id of search button
            }
        })
}

// function wrapper for the ajax call. Only calls if a keyword has been entered in function getKeyword
function doWikiSearch() {
    var keyword = getKeyword();
    if (keyword.length < 1) {
        return;
    } else {
        // start ajax
        $.ajax({
            url: '//en.wikipedia.org/w/api.php',
            data: {
                action: "query",
                list: "search",
                srsearch: keyword,
                format: "json",
                prop: "info",
                inprop: "url"
            },
            dataType: "jsonp",
            success: function(searchResults) {
                displaySearch(searchResults);
            },
            xhrFields: {
                withCredentials: false
            }
        });
        // end ajax
    }
}

// takes the search results from the ajax call and
// loops through to build and display the search results
function displaySearch(searchResults) {

	// check if the search returns any results
	if (searchResults.query.search.length === 0) {
		
		// if no results
		return noSearchResults();

		// if results then search results are displayed 
	} else {

	    // call the function to hide / show divs here
	    changeDisplay();

	    // variable used to append json to the placeholder element
	    var searchList = document.getElementById("placeholder");

	    // loop to display search results
	    for (var i = 0; i < searchResults.query.search.length; i++) {

	        // Displays Wikipedia article title as a URL
	        var url = document.createElement("a");
	        url.href = buildWikiURL(searchResults.query.search[i].title);
	        url.target = "_blank";
	        url.innerHTML = searchResults.query.search[i].title;
            url.className = "title-anchor";
	        searchList.appendChild(url);

	        // Displays article snippet
	        var p = document.createElement("p");
	        p.innerHTML = searchResults.query.search[i].snippet;
            p.className = "snippet-p";
	        searchList.appendChild(p);

	        // console logs for testing purposes
	        // console.log(searchResults.query.search);
	        // console.log(searchResults.query.search[i].title);
	        // console.log(searchResults.query.search[i].snippet);
	        // console.log(buildWikiURL(searchResults.query.search[i].title))
	    }
	}
}

// a hack as ajax doesn't return a URL, so this function builds
// a URL based on the wiki article title returned by the ajax call
function buildWikiURL(searchTitle) {
    var articleTitle = searchTitle;
    articleTitle = articleTitle.replace(/ /g, "_");
    var wikiURL = "https://en.wikipedia.org/wiki/" + articleTitle;
    return wikiURL;
}

// once a search is made by the user, hides the search & displays the results instead
function changeDisplay() {
    document.getElementById("search").remove();
    document.getElementById("display-results").style.display = "block";
}

// if a search returns no results, hides the search and displays a msg
function noSearchResults() {
    // console.log("Search returned no results");
    document.getElementById("search").remove();
    document.getElementById("no-results").style.display = "block"; 
}
