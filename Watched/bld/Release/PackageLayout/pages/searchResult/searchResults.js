// TODO: Connect the Search Results Page to your in-app search.
// For an introduction to the Search Results Page template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512
(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.UI.Pages.define("/pages/searchResult/searchResults.html", {
        _filters: [],
        _lastSearch: "",

        // This function is called to initialize the page.
        init: function (element, options) {
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
        },

        ready: function (element, options) {
            var listView = element.querySelector(".resultslist").winControl;
            this._handleQuery(element, options);
            //listView.element.focus();
            //document.getElementById("searchBox").winControl.focusOnKeyboardInput = true;
        },

        unload: function () {
            // Turn off type to search
            //document.getElementById("searchBox").winControl.focusOnKeyboardInput = false;
        },

        // This function filters the search data using the specified filter.
        _applyFilter: function (filter, originalResults) {
            if (filter.results === null) {
                filter.results = originalResults.createFiltered(filter.predicate);
            }
            return filter.results;
        },

        // This function responds to a user selecting a new filter. It updates the
        // selection list and the displayed results.
        _filterChanged: function (element, filterIndex) {
            var filterBar = element.querySelector(".filterbar");
            var listView = element.querySelector(".resultslist").winControl;

            utils.removeClass(filterBar.querySelector(".highlight"), "highlight");
            utils.addClass(filterBar.childNodes[filterIndex], "highlight");

            listView.itemDataSource = this._filters[filterIndex].results.dataSource;
        },

        _generateFilters: function () {
            this._filters = [];
            this._filters.push({ results: null, text: "All", predicate: function (item) { return true; } });
            // todo: 之后更改这个代码可以实现显示 top 250 榜单里面的
            //this._filters.push({ results: null, text: "Group 1", predicate: function (item) { return item.group.key === "group1"; } });
            //this._filters.push({ results: null, text: "Group 2+", predicate: function (item) { return item.group.key !== "group1"; } });
        },

        // 执行搜索
        _handleQuery: function (element, args) {
            var originalResults;

            this._lastSearch = args.queryText;

            WinJS.Namespace.define("searchResults", {
                markText: WinJS.Binding.converter(this._markText.bind(this))
            });

            this._initializeLayout(element);
            this._generateFilters();
            originalResults = this._searchData(args.queryText);
            if (originalResults.length === 0) {
                document.querySelector('.filterbar').style.display = "none";    // 无结果，搜索结果设为none
            } else {
                document.querySelector('.resultsmessage').style.display = "none"; // 有结果，提示信息设为none
            }
            this._populateFilterBar(element, originalResults);
            this._applyFilter(this._filters[0], originalResults);
        },

        // 初始化，显示header
        _initializeLayout: function (element) {
            element.querySelector(".titlearea .pagetitle").textContent = "看过 Watched";
            element.querySelector(".titlearea .pagesubtitle").innerHTML = "<i>" + this._lastSearch + '</i> 的搜索结果';
        },

        // Navigate to the item that was invoked. => 导航到对应电影的页面 itemDetailPage.html
        _itemInvoked: function (args) {
            args.detail.itemPromise.done(function itemInvoked(item) {
                var item = SearchResult.movies.getAt(args.detail.itemIndex);
                WinJS.Navigation.navigate("/pages/itemDetail/itemDetail.html", { item: ["fromSearch", item.id] });
                // item: [item.group.key, item.id]
            });
        },

        // 标蓝搜索关键词
        _markText: function (text) {
            return text.replace(this._lastSearch, "<mark>" + this._lastSearch + "</mark>");
        },

        // This function generates the filter selection list.
        _populateFilterBar: function (element, originalResults) {
            var filterBar = element.querySelector(".filterbar");
            var listView = element.querySelector(".resultslist").winControl;
            var li, option, filterIndex;

            filterBar.innerHTML = "";
            for (filterIndex = 0; filterIndex < this._filters.length; filterIndex++) {
                this._applyFilter(this._filters[filterIndex], originalResults);

                li = document.createElement("li");
                li.filterIndex = filterIndex;
                li.tabIndex = 0;
                li.textContent = this._filters[filterIndex].text + " (" + this._filters[filterIndex].results.length + ")";
                li.onclick = function (args) { this._filterChanged(element, args.target.filterIndex); }.bind(this);
                li.onkeyup = function (args) {
                    if (args.key === "Enter" || args.key === "Spacebar")
                        this._filterChanged(element, args.target.filterIndex);
                }.bind(this);
                utils.addClass(li, "win-type-interactive");
                utils.addClass(li, "win-type-x-large");
                filterBar.appendChild(li);

                if (filterIndex === 0) {
                    utils.addClass(li, "highlight");
                    listView.itemDataSource = this._filters[filterIndex].results.dataSource;
                }

                option = document.createElement("option");
                option.value = filterIndex;
                option.textContent = this._filters[filterIndex].text + " (" + this._filters[filterIndex].results.length + ")";
            }
        },

        // This function populates a WinJS.Binding.List with search results for the
        // provided query.
        _searchData: function (queryText) {
            var movies;
            movies = Data.getMovies("/v2/movie/search?q=" + encodeURI(queryText));
            for (var i = 0; i < movies.length; i++) {
                movies[i] = Data.getMoreInfo(movies[i], 0);
            }
            var movieResults = new WinJS.Binding.List(movies);

            WinJS.Namespace.define("SearchResult", {
                movies: movieResults
            })

            return movieResults;
        }
    });
})();
