(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {
        init: function (element, options) {
            this.groupHeaderInvoked = ui.eventHandler(this._groupHeaderInvoked.bind(this));
            this.itemInvoked = ui.eventHandler(this._itemInvoked.bind(this));
            
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            document.getElementById("searchBox").winControl.focusOnKeyboardInput = true;
        },

        unload: function () {
            // Turn off type to search
            document.getElementById("searchBox").winControl.focusOnKeyboardInput = false;
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },

        // 点击 group 项
        _groupHeaderInvoked: function (args) {
            var group = Data.groups.getAt(args.detail.groupHeaderIndex);
            nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: group.key });
        },

        // 点击 item 项
        _itemInvoked: function (args) {
            var item = Data.itemsLess.getAt(args.detail.itemIndex);
            nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
        }
    });
})();
