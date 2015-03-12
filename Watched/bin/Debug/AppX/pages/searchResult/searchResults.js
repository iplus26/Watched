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

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            var listView = element.querySelector(".resultslist").winControl;
            this._handleQuery(element, options);
            listView.element.focus();
        },

        // This function updates the page layout in response to layout changes.
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
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

            // TODO: Replace or remove example filters.
            this._filters.push({ results: null, text: "Group 1", predicate: function (item) { return item.group.key === "group1"; } });
            this._filters.push({ results: null, text: "Group 2+", predicate: function (item) { return item.group.key !== "group1"; } });
        },

        // This function executes each step required to perform a search.
        _handleQuery: function (element, args) {
            var originalResults;
            this._lastSearch = args.queryText;
            WinJS.Namespace.define("searchResults", { markText: WinJS.Binding.converter(this._markText.bind(this)) });
            this._initializeLayout(element);
            this._generateFilters();
            originalResults = this._searchData(args.queryText);
            if (originalResults.length === 0) {
                document.querySelector('.filterbar').style.display = "none";
            } else {
                document.querySelector('.resultsmessage').style.display = "none";
            }
            this._populateFilterBar(element, originalResults);
            this._applyFilter(this._filters[0], originalResults);
        },

        _initializeLayout: function (element) {
            element.querySelector(".titlearea .pagetitle").textContent = "看过 Watched";
            element.querySelector(".titlearea .pagesubtitle").textContent = "“" + this._lastSearch + '”的搜索结果';
        },

        _itemInvoked: function (args) {
            args.detail.itemPromise.done(function itemInvoked(item) {
                // TODO: Navigate to the item that was invoked.
                // 导航到对应电影的页面 itemDetailPage.html
            });
        },

        // This function colors the search term. Referenced in /pages/searchResult/searchResults.html
        // as part of the ListView item templates.
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
            var originalResults;
            // TODO: Perform the appropriate search on your data.
            if (window.Data) {
                originalResults = Data.items.createFiltered(function (item) {
                    return (item.title.indexOf(queryText) >= 0 || item.subtitle.indexOf(queryText) >= 0 || item.description.indexOf(queryText) >= 0);
                });
            } else {
                originalResults = new WinJS.Binding.List();
            }
            return originalResults;
        }
    });
})();
