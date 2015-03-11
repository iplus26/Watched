(function () {
    "use strict";

    // 创建了一个更小的list，用于首页的显示
    var listLess = new WinJS.Binding.List();
    var groupedItemsLess = listLess.createGrouped(      // WinJS.Binding.GroupedSortedListProjection object
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );
    getMovieData(6).forEach(function (item) {
        listLess.push(item);
    });

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(      // WinJS.Binding.GroupedSortedListProjection object
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    WinJS.Namespace.define("Data", {
        items: groupedItems,   
        groups: groupedItems.groups,    // GroupedSortedListProjection.groups property, get a WinJS.Binding.List object
        itemsLess: groupedItemsLess,
        groupsLess: groupedItemsLess.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,

        getMovie: getDoubanMovie,
        getMovies: getMovies,
        getMoreInfo: formatMovieItem,
    });

    WinJS.Application.addEventListener("ready", function () {
        getMovieData(50).forEach(function (item) {
            list.push(item);
        });
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.id];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        return groupedItems.groups.getItemFromKey(key).data;
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item id.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.id === reference[1]) {
                return item;
            }
        }
    }

    function getMovies(douban_api) {
        // douban_api: "/v2/movie/search?q=Harry%20Potter", "/v2/movie/top250"
        var xhr = new XMLHttpRequest();
        var requestUrl = "http://api.douban.com" + douban_api;
        xhr.open("get", requestUrl, false);
        xhr.send(null);

        var jsonText = xhr.responseText;
        var returnedObject = JSON.parse(jsonText);

        var movies = returnedObject.subjects;

        return movies;
    }


    // Returns an array of sample data that can be added to the application's
    // data list. 
    function getMovieData(num) {
        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

        var groupImage = "http://t.douban.com/img/biz/poster-1357728694.jpg";

        var movieGroups = [
            {
                key: "movieGroup0",
                // todo: 权限问题解决、可以获取豆瓣口碑榜单的时候，将key值改为movieGroup0，在最前显示。
                // 因为仍然是 movieGroups[0] 所以其他代码不用做修改。
                title: "本周口碑榜",
                subtitle: "数据来自豆瓣电影",
                backgroundImage: groupImage,
                description: "口碑榜是豆瓣根据用户最近一周收藏的不低于7分的新片、依据算法按“评分+热度”排序的结果。"
            },
            {
                key: "movieGroup1",
                title: "豆瓣电影TOP250",
                subtitle: "数据来自豆瓣电影",
                backgroundImage: groupImage,
                description: "豆瓣用户每天都在对“看过”的电影进行“很差”到“力荐”的评价，豆瓣根据每部影片看过的人数以及该影片所得的评价等综合数据，通过算法分析产生豆瓣电影250。"
            },
            {
                key: "movieGroup2",
                title: "Harry Potter Collection",
                subtitle: "合集由「看过」团队制作",
                backgroundImage: groupImage,
                description: "此合集收纳了「哈利波特」系列的八部电影。"
                // todo: 根据豆列内容显示合集
            }
        ]

        var movieItems = [];
        var movieCollection = [];

        movieCollection.push(getMovies("/v2/movie/top250?count=" + num.toString()));   //array of douban movie objects
        movieCollection.push(getMovies("/v2/movie/search?q=harry%20potter&count=8").sort(
                function (a, b) {
                    return a.year - b.year;
                }
            ));

        for (var a = 0; a < movieCollection.length; a++) {
            for (var i = 0; i < (num <= movieCollection[a].length ? num : movieCollection[a].length) ; i++) {
                movieCollection[a][i] = formatMovieItem(movieCollection[a][i], movieGroups[a]);
                movieCollection[a][i].doubanSort = "#" + (i + 1).toString();
                movieItems.push(movieCollection[a][i]);
            }
        }

        return movieItems;
    }


    function getDoubanMovie(movieId) {
        var xhr = new XMLHttpRequest();
        var requestUrl = "http://api.douban.com/v2/movie/subject/" + movieId;
        xhr.open("get", requestUrl, false);
        xhr.send(null);

        var jsonText = xhr.responseText;
        var movie = JSON.parse(jsonText);   // a douban movie object

        return movie;
    }

    function formatMovieItem(dbMovieItem, group) {
        dbMovieItem.group = group;
        dbMovieItem.subtitle = dbMovieItem.original_title + " (" + dbMovieItem.year + ")";

        dbMovieItem.backgroundImage = //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        dbMovieItem.images.large; // todo: 如何分情况显示大图片和小图片？

        dbMovieItem.ratingOutOf10 = dbMovieItem.rating.average;
        dbMovieItem.ratingOutOf5 = dbMovieItem.rating.average / 2;

        for (var c = 0; c < dbMovieItem.directors.length; c++) {
            if (dbMovieItem.directorsAndCastsString == undefined) {
                dbMovieItem.directorsAndCastsString = dbMovieItem.directors[c].name + "（导演）";
            } else
                dbMovieItem.directorsAndCastsString += " / " + dbMovieItem.directors[c].name + "（导演）";
        }

        for (var c = 0; c < dbMovieItem.casts.length; c++) {
            if (dbMovieItem.directorsAndCastsString == undefined) {
                dbMovieItem.directorsAndCastsString = dbMovieItem.casts[c].name;
            }else
                dbMovieItem.directorsAndCastsString += " / " + dbMovieItem.casts[c].name;
        }

        dbMovieItem.genresString = dbMovieItem.genres.join(" / ");

        return dbMovieItem;
    }
})();
