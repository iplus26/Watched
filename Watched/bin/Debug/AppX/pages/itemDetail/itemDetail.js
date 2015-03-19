(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var session = WinJS.Application.sessionState;
    var util = WinJS.Utilities;

    // 请忽略这一页狂草的代码 反正我做出来了 :)

    var Movie = WinJS.Class.define(
            function ( movieItem ) {
                this._initObservable();
                this.title = "sample title";
                this.info = "change the movie info";
                this.timeout = null;
            },

            {
                _accessInfo: function () {
                    
                },

                start: function () {
                    this._accessInfo();
                },

                
                stop: function () {
                    // Stops the process.
                }



            }

        );
    // - - define Movie Class end.

    WinJS.Class.mix(Movie, WinJS.Binding.mixin, WinJS.Binding.expandProperties({ name: "", color: "" }));

    function alert(message) {
        var msgBox = new Windows.UI.Popups.MessageDialog(message);
        msgBox.showAsync();
    }

    function parseToDOM(str) {
        var div = document.createElement("div");
        if (typeof str == "string")
            div.innerHTML = str;
        return div;//.childNodes;
    }

    var movieItem;

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        _items: null,

        
        
        init: function (element, options) {
            // options.item = [item.group.key, item.id]

             movieItem = Data.resolveItemReference(options.item);
            // 无论这个item是从groupDetail, or groupedItem, or searchResult链接过来的
            // 都具有一些豆瓣电影object的基本信息
            // 根据这个item.id去查询item detail获得一个更完整的对象
             movieItem = Data.getMovie(movieItem.id);

        },
       
        

        processed: function (element) {
            return WinJS.Resources.processAll(element);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var hub = element.querySelector(".hub").winControl;
            hub.onheaderinvoked = function (args) {
                args.detail.section.onheaderinvoked(args);
            };
            hub.onloadingstatechanged = function (args) {
                if (args.srcElement === hub.element && args.detail.loadingState === "complete") {
                    hub.onloadingstatechanged = null;
                }
            }


            // below

            var movie = new Movie();

            movie.bind("info", accessInfo);

            function accessInfo() {

                var xhr = new XMLHttpRequest();
                var posterPage = "http://movie.douban.com/subject/" + movieItem.id + "/photos";//?type=W&start=0&sortby=vote&size=1920x1080&subtype=a";
                xhr.open("get", posterPage, false);
                xhr.send(null);
                var posterPageDOM = parseToDOM(xhr.responseText);
                var posterUrl = posterPageDOM.querySelector("img[src^='http://img5.douban.com/view/photo/']").src.replace(/thumb/, "photo");
                document.getElementById("hubhero").style.backgroundImage = "url(" + posterUrl + ")";

                document.getElementById("movieTitle").innerText = movieItem.title + " (" + movieItem.year + ")";
                document.getElementById("title").innerText = movieItem.title + " (" + movieItem.year + ")";
                document.getElementById("original_title").innerText = movieItem.original_title;
                document.getElementById("moviePoster").src = movieItem.images.large;
                document.getElementById("description").innerHTML = movieItem.summary.replace(/\n/, "</p><p>") + "</p>";

               // document.getElementById("rateDetail").innerText = "豆瓣 " + movieItem.ratings_count + " 人评分";
                document.getElementById("movieLink").href += "subject/" + movieItem.id;
                document.getElementById("genres").innerText = movieItem.genres.join(" / ");
            }

            movie.start();
        },
        
        itemDataSource: item.dataSource,

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
    });
})();