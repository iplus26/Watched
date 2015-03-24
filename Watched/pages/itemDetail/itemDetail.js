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

            if (options.item[0] != 'fromSearch') {
                movieItem = Data.resolveItemReference(options.item);
            } else {
                movieItem = Data.getMovie(options.item[1]);
            }

            // 无论这个item是从groupDetail, or groupedItem, or searchResult链接过来的
            // 都具有一些豆瓣电影object的基本信息
            // 根据这个item.id去查询item detail获得一个更完整的对象

            var items = [];

             var i = 0;
             for (i = 0; i < movieItem.directors.length; i++) {
                 if (movieItem.directors[i].avatars != null)
                     movieItem.directors[i].picture = movieItem.directors[i].avatars.medium;
                 else
                     movieItem.directors[i].picture = "/images/celebrity-default-medium.gif";
                 movieItem.directors[i].job = "导演";
                 items.push(movieItem.directors[i]);
             }
             for (i = 0; i < movieItem.casts.length; i++) {
                 if (movieItem.casts[i].avatars != null)
                     movieItem.casts[i].picture = movieItem.casts[i].avatars.medium;
                 else
                     movieItem.casts[i].picture = "/images/celebrity-default-medium.gif";
                 movieItem.casts[i].job = "出演";
                 items.push(movieItem.casts[i]);
             }


             WinJS.Namespace.define("itemDetail", {
                 casts: new WinJS.Binding.List(items)
             });
             WinJS.UI.processAll();
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
                // movieItem = Data.getMovie(movieItem.id);
                // 以下的这一块hack是因为豆瓣并没有向普通权限（就是我们）开放海报API
                var xhr = new XMLHttpRequest();
                var posterPage = "http://movie.douban.com/subject/" + movieItem.id + "/photos";//?type=W&start=0&sortby=vote&size=1920x1080&subtype=a";
                xhr.open("get", posterPage, false);
                xhr.send(null);
                var posterPageDOM = parseToDOM(xhr.responseText);
                var img = posterPageDOM.querySelector("img[src^='http://img5.douban.com/view/photo/'], img[src^='http://img3.douban.com/view/photo/']");
                if (img) {
                   var posterUrl = img.src.replace(/thumb/, "raw");
                }
                //如果这部电影没有图片 会出错 try catch
                document.getElementById("hubhero").style.backgroundImage = "url(" + posterUrl + ")";

                document.getElementById("movieTitle").innerText = movieItem.title + " (" + movieItem.year + ")";

                // 下面这一段代码是因为 Nicholas C. Zakas - Speed up your JavaScript, Part 4 说 fragment 能够提高修改 DOM 的效率
                // http://www.nczonline.net/blog/2009/02/03/speed-up-your-javascript-part-4/

                var section1 = document.getElementById("section1");

                var fragment1 = document.createDocumentFragment();

                var poster = document.createElement("img");
                poster.src = movieItem.images.large;
                poster.height = 300;
                fragment1.appendChild(poster);

                var title = document.createElement("p");
                var title_span = document.createElement("span");
                title_span.textContent = movieItem.title + " (" + movieItem.year + ")";
                var original_title_span = document.createElement("span");
                original_title_span.textContent = movieItem.original_title;
                original_title_span.style.color = "#919191";
                title.appendChild(title_span);
                title.appendChild(document.createElement("br"));
                title.appendChild(original_title_span);
                fragment1.appendChild(title);

                var douban_rating_str = '(' + function () {
                    var rate = movieItem.rating.average;
                    var votes = movieItem.ratings_count;
                    
                    if (rate == 0) {
                        return '无人评分';
                    } else if (votes > 10000) {
                        return (votes / 10000).toFixed(1) + '万人评分';
                    } else {
                        return votes + '人评分';
                    }

                }() + ')';

                    //(movieItem.rating.average == 0) ? '无人评分' : ('(' + (movieItem.ratings_count >= 10000 ? ((movieItem.ratings_count / 10000).toFixed(1) + "万") : movieItem.ratings_count) + "人评分)");
                
                var douban_rate_span = document.createElement("span");
                douban_rate_span.textContent = movieItem.rating.average.toFixed(1);
                douban_rate_span.style.fontSize = "2em";
                fragment1.appendChild(douban_rate_span);
                var ratings_count = document.createElement("span");
                ratings_count.textContent = "/10 " + douban_rating_str;

                fragment1.appendChild(ratings_count);

                fragment1.appendChild(document.createElement("br"));

                var douban_rate_control = document.createElement("div");
                var doubanRateControl = new WinJS.UI.Rating(douban_rate_control, { averageRating: movieItem.rating.average / 2, maxRating: 5, disabled: true });
                fragment1.appendChild(douban_rate_control);
                fragment1.appendChild(document.createElement("br"));

                var genres = document.createElement("p");
                genres.innerText = movieItem.genres.join(" / ");
                fragment1.appendChild(genres);

                
                var countries = document.createElement("p");
                countries.innerText = movieItem.countries.join(" / ");
                fragment1.appendChild(countries);
                
                var douban_link = document.createElement("a");
                douban_link.href = "http://movie.douban.com/subject/" + movieItem.id + "/photos";
                douban_link.textContent = "数据来自豆瓣"
                fragment1.appendChild(douban_link);

                section1.appendChild(fragment1);

                var description = document.getElementById("description");
                description.innerHTML = movieItem.summary.replace(/\n/, "</p><p>") + "</p>";
                description.nextElementSibling.src = posterUrl;
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