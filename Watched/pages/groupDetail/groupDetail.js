(function () {
    "use strict";

    var ui = WinJS.UI;

    ui.Pages.define("/pages/groupDetail/groupDetail.html", {
        /// <field type="WinJS.Binding.List" />
        _items: null,

        // This function is called to initialize the page.
        init: function (element, options) {
            var group = Data.resolveGroupReference(options.groupKey);

        
            // todo: 如何真正地在此页修改data，使得再次打开时不需要重新加载？


                var movies = Data.getItemsFromGroup(group); // a WinJS.Binding.List object

                for (var i = 0; i < movies.length; i++) {
                    // todo:  add sort
                }

                var moreMovies = Data.getMovies("/v2/movie/top250?start=" + movies.length + "&count=" + (50 - movies.length));

                for (var i = 0; i < moreMovies.length; i++) {
                    moreMovies[i] = Data.getMoreInfo(moreMovies[i], group);
                    moreMovies[i].doubanSort = "#" + (movies.length + 1).toString();
                    movies.push(moreMovies[i]);

                }

                this._items = movies;

            
            this._pageTitle = group.title;
            var pageList = this._items.createGrouped(
                function groupKeySelector(item) { return group.key; },
                function groupDataSelector(item) { return group; }
            );
            this.groupDataSource = pageList.groups.dataSource;
            this.itemDataSource = pageList.dataSource;
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));


        },

        // This function is called whenever a user navigates to this page. 
        ready: function (element, options) {
            element.querySelector("header[role=banner] .pagetitle").textContent = this._pageTitle;
        },

        unload: function () {
            this._items.dispose();
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
            
        },

        _itemInvoked: function (args) {
            var item = this._items.getAt(args.detail.itemIndex);
            WinJS.Navigation.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
        }
    });

})();
