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

                 if (typeof movieItem.casts[i].alt === "undefined" || movieItem.casts[i].alt == null) {
                     movieItem.casts[i].alt = "javascript: alert('hi')";//"http://www.imdb.com/find?ref_=nv_sr_fn&q=" + movieItem.casts[i].name + "&s=nm";
                 } 

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
                } else {
                    var posterUrl = "/images/poster_error.jpg";
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

                var douban_rating_str = generate_rating_str (movieItem.rating.average, movieItem.ratings_count) ;

                function generate_rating_str(rate, votes) {
                    if (rate == 0) {
                        return '(无人评分)';
                    } else if (votes > 10000) {
                        return '(' + (votes / 10000).toFixed(1) + '万人评分)';
                    } else {
                        return '(' + votes + '人评分)';
                    }
                }

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
                
                
                var links = document.createElement("p");
                var douban_link = document.createElement("a");
                douban_link.href = "http://movie.douban.com/subject/" + movieItem.id + "/";
                douban_link.innerHTML = "<span style='font-family:\"Segoe UI Symbol\"'>&#xe2A9;</span>豆瓣"
                links.appendChild(douban_link);
                links.innerHTML += " / ";
                var share = document.createElement("a");
                share.addEventListener("click", function () {
                    Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
                });
		        share.textContent="分享屏幕截图";
                links.appendChild(share);

                fragment1.appendChild(links);
                



                section1.appendChild(fragment1);
                /* ---------------- section1 over ---------------- */

                /* ---------------- more info section, known as section3 ---------------- */
                var fragment2 = document.createDocumentFragment();

                var tags = document.createElement("p");
                tags.innerText = movieItem.countries.join(" / ");
                tags.innerText += " / ";
                tags.innerText += movieItem.genres.join(" / ");
                fragment2.appendChild(tags);
                
                // --- 评分 table
                
                var rate_table = document.createElement("table");
                rate_table.appendChild(generate_row(movieItem.alt, movieItem.rating.average, movieItem.ratings_count));

                var imdb_toggle = document.createElement("div");
                imdb_toggle.id = "imdbToggle";
                var imdbToggle = function () {
                    var toggle_control = document.getElementById("imdbToggle").winControl;
                    if (toggle_control.checked) {
                        // true => 显示
                        var temp = -1;
                        do {
                            if (temp == -1) {
                                var keyword = movieItem.original_title;
                            } else if (temp < movieItem.aka.length) {
                                var keyword = movieItem.aka[temp];
                            } else {
                                //alert("没有找到更多评分");
                                break;
                            }
                            temp++;
                            var imdb_xhr = new XMLHttpRequest();
                            var requestUrl = "http://www.omdbapi.com/?t=" + encodeURI(keyword) + "&y=" + encodeURI(movieItem.year) + "&plot=short&r=json&tomatoes=true";
                            imdb_xhr.open("get", requestUrl, false);
                            imdb_xhr.send(null);
                            var imdbItem = JSON.parse(imdb_xhr.responseText);
                        } while (imdbItem.Response != "True")

                        if (typeof imdbItem === 'undefined') {

                        } else {
                            if (typeof imdbItem.imdbVotes === 'undefined' || imdbItem.imdbVotes.toLowerCase() == "n/a") {

                            } else {
                                imdbItem.imdbVotes = parseInt(imdbItem.imdbVotes.replace(",", ""));
                                imdbItem.imdbRating = parseFloat(imdbItem.imdbRating);
                                var imdb_row = generate_row("http://imdb.com/title/" + imdbItem.imdbID, imdbItem.imdbRating, imdbItem.imdbVotes);
                                rate_table.appendChild(imdb_row);
                            }

                            if (typeof imdbItem.tomatoMeter === "undefined" || imdbItem.tomatoMeter.toLowerCase() == "n/a") {

                            } else {
                                var tomato = document.createElement("th");
                                tomato.setAttribute("colspan", "2");
                                tomato.style.fontSize = "2em"
                                if (imdbItem.tomatoImage == "fresh" || imdbItem.tomatoImage == "certified") {
                                    tomato.innerHTML = "<span>" +
                                        imdbItem.tomatoMeter + "% <img width='25' src='/images/tomato-fresh.png' /></span>";
                                } else {
                                    tomato.innerHTML = "<span>" +
                                        imdbItem.tomatoMeter + "% <img width='25' src='/images/tomato-rotten.png' /></span>";
                                }
                                rate_table.appendChild(tomato);
                            }

                            if (typeof imdbItem.Metascore === "undefined") {

                            } else {
                                if (imdbItem.Metascore.toLowerCase() != "n/a") {

                                    var metascore = document.createElement("td");
                                    var div = document.createElement("div");
                                    div.width = div.offsetHeight;
                                    div.className = "metascore";
                                    div.textContent = " " + imdbItem.Metascore + " ";
                                    metascore.appendChild(div);
                                    rate_table.appendChild(metascore);
                                }
                            }
                        }
                        
                    } else {
                        // false => 不显示
                        while(rate_table.childNodes.length > 1){
                            rate_table.removeChild(rate_table.lastChild);
                        }
                    }
                }

                function generate_row(website, rate, count) {
                    var rate_span = document.createElement("span");
                    rate_span.textContent = rate.toFixed(1);
                    rate_span.style.fontSize = "2em";
                    var ratings_count = document.createElement("span");
                    var rating_str = generate_rating_str(rate, count);
                    ratings_count.textContent = rating_str;
                    var rate_control = document.createElement("div");
                    rate_control.className = "win-small";
                    var RateControl = new WinJS.UI.Rating(rate_control, { averageRating: rate / 2, maxRating: 5, disabled: true });
                    
                    var row1 = document.createElement("tr");
                    var r1cell1 = document.createElement("td");    
                    r1cell1.appendChild(rate_span);
                    row1.appendChild(r1cell1);
                    var r1cell2 = document.createElement("td");
                    if (website.indexOf("douban") != -1) {
                        website = "<a href='" + website + "'>douban</a>";
                    } else {
                        website = "<a href='" + website + "'>imdb</a>";
                    }
                    r1cell2.innerHTML = '/10 ' + rating_str + "<sup>" + website + "</sup>";
                    row1.appendChild(r1cell2);
                    var r1cell3 = document.createElement("td");
                    r1cell3.appendChild(rate_control);
                    row1.appendChild(r1cell3);
                    return row1;
                }
                
                var toggle = new WinJS.UI.ToggleSwitch(imdb_toggle, { checked: false, onchange: imdbToggle, labelOn: "显示更多评分", labelOff: "显示更多评分" });
                


                fragment2.appendChild(rate_table);
                fragment2.appendChild(imdb_toggle);

                /* rotten tomatoes part
                
                */

                // --- 评分 table 完

                var links = document.createElement("p");
                links.innerHTML = "<a href='http://www.bilibili.com/search?keyword=" + encodeURI(movieItem.title) + "'>" +
                    "<span class='symbol'>&#xe102;</span>在线观看</a>";
                links.innerHTML += " / <a href='https://www.baidu.com/s?wd=" + encodeURI(movieItem.title + " HR-HDTV") + "'>" +
                    "<span class='symbol'>&#xe118;</span>下载字幕版</a>";
                links.innerHTML += " / <a href='https://kickass.to/usearch/" + encodeURI(movieItem.original_title.replace("'", " ")) + "'>" +
                    "下载高清生肉</a>";
                fragment2.appendChild(links);

                var description = document.createElement("p");
                description.innerHTML = "<br>剧情简介 <span class='symbol'>&#xe011;</span>";
                description.innerHTML += "<p>" + function () {
                    if (movieItem.summary.replace(/\n/, "</p><p>").length > 300) {
                        return movieItem.summary.replace(/\n/, "</p><p>").substring(0, 300) +
                            "<span class='symbol'>&#xe10c;</span>" + 
                            "<a href='http://movie.douban.com/subject/" + movieItem.id + "/'><span class='symbol'>&#xe2AA;</span>豆瓣</a>"
                    } else
                        return movieItem.summary.replace(/\n/, "</p><p>");
                }() + "</p>";
                fragment2.appendChild(description);
                
                var section3 = document.getElementById("section3");
                section3.appendChild(fragment2);
                /* ---------------- section3 over ---------------- */

                
                var imageRecommand = document.getElementById("image-recommand");
                imageRecommand.src = posterUrl;

                // 感觉还是有一点bug，有时候会显示错误图片，然后加载出来全部图片之后就不管大小了，明天再说！晚安！
                var check = function () {
                    if (imageRecommand.width > 50) {
                        if (imageRecommand.width > imageRecommand.height) {
                            imageRecommand.width = 420;
                        } else {
                            imageRecommand.height = document.documentElement.clientHeight * 0.5;
                        }
                        clearInterval(set);
                    }
                }

                var set = setInterval(check, 40);

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