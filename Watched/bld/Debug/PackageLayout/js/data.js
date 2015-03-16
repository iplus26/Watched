(function () {
    "use strict";

    // 创建了一个更小的list，用于首页的显示
    var listLess = new WinJS.Binding.List();
    var groupedItemsLess = listLess.createGrouped(      // WinJS.Binding.GroupedSortedListProjection object
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );
    getMovieData(3).forEach(function (item) {
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

    function getWeeklyMovies() {
        var movies =
            [
                { "rating": { "max": 10, "average": 8.6, "stars": "45", "min": 0 }, "reviews_count": 22, "wish_count": 10921, "collect_count": 5445, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2192834364.jpg", "large": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2192834364.jpg", "medium": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/spst\/public\/p2192834364.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/24750126\/", "id": "24750126", "mobile_url": "http:\/\/movie.douban.com\/subject\/24750126\/mobile", "title": "荒蛮故事", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["剧情", "喜剧"], "countries": ["阿根廷", "西班牙"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1387261340.73.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1387261340.73.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1387261340.73.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1013967\/", "id": "1013967", "name": "里卡杜·达林" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/11600.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/11600.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/11600.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1032655\/", "id": "1032655", "name": "达里奥·葛兰帝内提" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/51251.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/51251.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/51251.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1010747\/", "id": "1010747", "name": "莱昂纳多·斯巴拉格利亚" }, { "avatars": { "small": "http:\/\/img3.douban.com\/pics\/celebrity-default-small.gif", "large": "http:\/\/img3.douban.com\/pics\/celebrity-default-large.gif", "medium": "http:\/\/img3.douban.com\/pics\/celebrity-default-medium.gif" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1294280\/", "id": "1294280", "name": "迭戈·佩雷蒂" }], "current_season": null, "original_title": "Relatos salvajes", "summary": "《荒蛮故事》是一部黑色喜剧，由6个独立的暴力复仇小故事构成。\n本片由阿根廷和西班牙合资，西班牙阿莫多瓦兄弟制片，阿根廷的达米安·斯兹弗隆执导，阿根廷著名男演员里卡杜·达林出演了第4个小故事。本片首映于2014年戛纳电影节主竞赛单元，是该单元中唯一的喜剧片。", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1423382035.81.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1423382035.81.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1423382035.81.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1010314\/", "id": "1010314", "name": "达米安·斯兹弗隆" }], "comments_count": 2208, "ratings_count": 4742, "aka": ["生命中最抓狂的小事(台)", "无定向丧心病狂(港)", "蛮荒故事", "Wild Tales"] }, { "rating": { "max": 10, "average": 8.2, "stars": "45", "min": 0 }, "reviews_count": 169, "wish_count": 14758, "collect_count": 33743, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2215268072.jpg", "large": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2215268072.jpg", "medium": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/spst\/public\/p2215268072.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/10741643\/", "id": "10741643", "mobile_url": "http:\/\/movie.douban.com\/subject\/10741643\/mobile", "title": "外星醉汉PK地球神", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["剧情", "喜剧", "奇幻"], "countries": ["印度"], "casts": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/13628.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/13628.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/13628.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1031931\/", "id": "1031931", "name": "阿米尔·汗" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/14530.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/14530.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/14530.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1045145\/", "id": "1045145", "name": "安努舒卡·莎玛" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1360845462.63.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1360845462.63.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1360845462.63.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1025276\/", "id": "1025276", "name": "桑杰·达特" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/5652.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/5652.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/5652.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1036940\/", "id": "1036940", "name": "波曼·伊拉妮" }], "current_season": null, "original_title": "PK", "summary": "贾古（安努舒卡·莎玛 Anushka Sharma 饰）和男友相恋多年，感情十分要好的两人终于决定步入婚姻的殿堂，然而，一场意外的突然降临让贾古所期望的一切都化为了泡影，因此，伤心欲绝的贾古决定返回家乡，成为了一名记者。\n一次偶然中，贾古遇见了名为PK（阿米尔·汗 Aamir Khan 饰）的男子，让贾古感到惊讶的是，PK竟然声称自己是一名外星人，因为宇宙飞船被劫持，所以流落至地球。刚开始，贾古以为PK在胡言乱语，不过，之后发生的种种令贾古开始相信PK所言，贾古甚至决定帮助PK寻找返回他的星球的方法。随着时间的推移，PK渐渐爱上了勇敢善良的贾古，可惜贾古依然还爱着男友，PK决定暂且放下心中的感情，帮助贾古和男友破镜重圆。©豆瓣", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/16549.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/16549.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/16549.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1286677\/", "id": "1286677", "name": "拉吉库马尔·希拉尼" }], "comments_count": 12453, "ratings_count": 29712, "aka": ["Peekay", "P.K."] }, { "rating": { "max": 10, "average": 8.6, "stars": "45", "min": 0 }, "reviews_count": 11, "wish_count": 10568, "collect_count": 4701, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2206143129.jpg", "large": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2206143129.jpg", "medium": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/spst\/public\/p2206143129.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/26059437\/", "id": "26059437", "mobile_url": "http:\/\/movie.douban.com\/subject\/26059437\/mobile", "title": "第四公民", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["纪录片"], "countries": ["德国", "美国", "英国"], "casts": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/zNAUARHSe4scel_avatar_uploaded1398352606.49.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/zNAUARHSe4scel_avatar_uploaded1398352606.49.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/zNAUARHSe4scel_avatar_uploaded1398352606.49.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1339889\/", "id": "1339889", "name": "爱德华·斯诺登" }, { "avatars": null, "alt": null, "id": null, "name": "Jacob Appelbaum" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/41972.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/41972.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/41972.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1317960\/", "id": "1317960", "name": "朱利安·阿桑奇" }, { "avatars": null, "alt": null, "id": null, "name": "William Binney" }], "current_season": null, "original_title": "Citizenfour", "summary": "《第四公民》将能高度还原“棱镜门”事件始末，为观众真实揭秘身处漩涡中心的爱德华·斯诺登。\n纪录片导演柏翠丝本人也是“棱镜门”事件的核心人物，正是在她和《卫报》记者格仑·格林沃德的协助下，斯诺登才得以将美国国家安全局的监控丑闻公之于众。而柏翠丝与格林沃德也因此荣获普利策奖。片名“第四公民”（citizen four）正是斯诺登早期与柏翠丝邮件沟通时使用的匿名代号。2013年6月，当柏翠丝第一次飞往香港与斯诺登见面的时候，她随身携带的摄像机也真实记录了当时的场景。《第四公民》将能高度还原“棱镜门”事件始末，为观众真实揭秘身处漩涡中心的爱德华·斯诺登。", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1419049253.3.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1419049253.3.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1419049253.3.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1294652\/", "id": "1294652", "name": "劳拉·珀特阿斯" }], "comments_count": 1800, "ratings_count": 3938, "aka": [] }, { "rating": { "max": 10, "average": 8.1, "stars": "40", "min": 0 }, "reviews_count": 10, "wish_count": 3742, "collect_count": 1445, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2194962310.jpg", "large": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2194962310.jpg", "medium": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/spst\/public\/p2194962310.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/10754780\/", "id": "10754780", "mobile_url": "http:\/\/movie.douban.com\/subject\/10754780\/mobile", "title": "无人引航", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["剧情", "音乐"], "countries": ["美国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1413531816.25.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1413531816.25.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1413531816.25.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1009265\/", "id": "1009265", "name": "比利·克鲁德普" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/503.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/503.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/503.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1053562\/", "id": "1053562", "name": "安东·叶利钦" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/34656.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/34656.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/34656.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1036429\/", "id": "1036429", "name": "菲丽西提·霍夫曼" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/25658.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/25658.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/25658.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1031892\/", "id": "1031892", "name": "威廉姆·H·梅西" }], "current_season": null, "original_title": "Rudderless", "summary": "影片讲述父亲在意外去世的儿子谱写的歌曲中获得安慰的感人故事。\n广告公司总裁“金领”父亲Sam（比利·克鲁德普 Billy Crudup 饰）的儿子Josh（迈尔斯·赫尔泽 Miles Heizer 饰）不幸在一起大学校园枪击案中殒命，他悲伤不已，放弃了原有的生活，住到了 自己的帆船上，喝酒度日。一次偶然的机会，他发现了Josh生前创作的几首歌曲。音乐一直是父子二人共同的兴趣，于是Sam学会了儿子所有的歌。一次Sam在当地的一家酒吧演唱一曲，歌声吸引了坐在酒吧里，同样做着音乐梦的年轻人Quentin（安东·叶利钦 Anton Yelchin 饰），于是两人组成了一支乐队，表演Josh的遗作，谁知却意外走红，改变了两个人的人生……", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/25658.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/25658.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/25658.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1031892\/", "id": "1031892", "name": "威廉姆·H·梅西" }], "comments_count": 489, "ratings_count": 1234, "aka": ["无人指导"] }, { "rating": { "max": 10, "average": 8.2, "stars": "40", "min": 0 }, "reviews_count": 3, "wish_count": 3159, "collect_count": 10143, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2226659709.jpg", "large": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2226659709.jpg", "medium": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/spst\/public\/p2226659709.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/25955872\/", "id": "25955872", "mobile_url": "http:\/\/movie.douban.com\/subject\/25955872\/mobile", "title": "美味盛宴", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["动画", "短片"], "countries": ["美国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1402594003.31.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1402594003.31.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1402594003.31.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1229477\/", "id": "1229477", "name": "本·布莱索" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/1395502242.8.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/1395502242.8.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/1395502242.8.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1334839\/", "id": "1334839", "name": "凯蒂·洛斯" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/5icp1KJLRMIcel_avatar_uploaded1378037063.25.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/5icp1KJLRMIcel_avatar_uploaded1378037063.25.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/5icp1KJLRMIcel_avatar_uploaded1378037063.25.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1333947\/", "id": "1333947", "name": "亚当·沙皮罗" }, { "avatars": null, "alt": null, "id": null, "name": "Stewart Levine" }], "current_season": null, "original_title": "Feast", "summary": "夜幕降临，繁华都市的清静角落，一只花斑小狗在四处寻找食物。就在此时，一个路过的男人丢过来小吃，它小心翼翼尝了一口，这似乎让小家伙倍感兴奋。在此之后，小狗被带回男人家，还被起名叫温斯顿。男主人每天为它准备美味食物，从最初的狗粮，到后来的牛排、炸肉饼、煎蛋，我们的温斯顿胃口越来越大，口味越来越刁。男主人似乎坚信美味就要同享，所以狗狗真可谓度过了一段天堂般的美食岁月。直到某天，男主人和生命中的另一个她邂逅。两人频频约会，你侬我侬，甜言蜜语，而温斯顿则被晾到了一遍，伙食则每况愈下……\n本片荣获第87届奥斯卡金像奖最佳动画短片奖。©豆瓣", "subtype": "movie", "directors": [{ "avatars": null, "alt": null, "id": null, "name": "Patrick Osborne" }], "comments_count": 3222, "ratings_count": 8639, "aka": ["盛宴", "美餐", "宴席"] }, { "rating": { "max": 10, "average": 7.5, "stars": "40", "min": 0 }, "reviews_count": 30, "wish_count": 6832, "collect_count": 3205, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2190722758.jpg", "large": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2190722758.jpg", "medium": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/spst\/public\/p2190722758.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/21345845\/", "id": "21345845", "mobile_url": "http:\/\/movie.douban.com\/subject\/21345845\/mobile", "title": "涉足荒野", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["剧情", "传记"], "countries": ["美国"], "casts": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/49827.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/49827.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/49827.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1031217\/", "id": "1031217", "name": "瑞茜·威瑟斯彭" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/39168.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/39168.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/39168.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1013811\/", "id": "1013811", "name": "盖比·霍夫曼" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/18559.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/18559.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/18559.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1006983\/", "id": "1006983", "name": "劳拉·邓恩" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/1382112849.59.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/1382112849.59.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/1382112849.59.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1221276\/", "id": "1221276", "name": "查尔斯·贝克" }], "current_season": null, "original_title": "Wild", "summary": "影片改编自美国作家谢莉尔·斯瑞德2012年的同名自传，讲述婚姻触礁，母亲去世，自己在绝望中生活多年之后，虽然毫无徒步经验，却独自一人踏上Pacific Crest Trail 远足之路，通过长途步行找回自我的故事。", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/4976.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/4976.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/4976.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1274537\/", "id": "1274537", "name": "让-马克·瓦雷" }], "comments_count": 1251, "ratings_count": 2691, "aka": ["那时候，我只剩下勇敢(台)", "狂野行(港)", "走出荒野"] }, { "rating": { "max": 10, "average": 7.1, "stars": "35", "min": 0 }, "reviews_count": 906, "wish_count": 20529, "collect_count": 81388, "douban_site": "", "year": "2015", "images": { "small": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2225291257.jpg", "large": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2225291257.jpg", "medium": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/spst\/public\/p2225291257.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/3993588\/", "id": "3993588", "mobile_url": "http:\/\/movie.douban.com\/subject\/3993588\/mobile", "title": "狼图腾", "do_count": null, "seasons_count": null, "schedule_url": "http:\/\/movie.douban.com\/subject\/3993588\/cinema\/", "episodes_count": null, "genres": ["剧情", "冒险"], "countries": ["中国大陆", "法国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/11633.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/11633.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/11633.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1275721\/", "id": "1275721", "name": "冯绍峰" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/704.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/704.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/704.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1274225\/", "id": "1274225", "name": "窦骁" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/1418115594.17.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/1418115594.17.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/1418115594.17.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1345416\/", "id": "1345416", "name": "昂哈妮玛" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/49864.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/49864.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/49864.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1320883\/", "id": "1320883", "name": "巴森" }], "current_season": null, "original_title": "狼图腾", "summary": "上世纪60年代，北京知青陈阵（冯绍峰 饰）和杨克（窦骁 饰）来到了内蒙古额仑大草原插队，加入了蒙古族牧民毕利格老人（巴森 饰）以及他的儿媳噶斯迈（昂哈尼玛 饰）一家的生产队，从此开始若干年的放牧生活。在与狼群的接触过程中，陈阵带着强烈的好奇，逐渐了解了这种动物，甚至有了想自己养一 只小狼的念头。蒙古人民崇敬狼，热爱草原，而汉人则功利地掠夺土地，这导致了狼群与人之间的“战争”。以场部主任包顺贵（尹铸胜 饰）为首的生产队最终发起了一场灭狼运动，让狼群和人类之间的关系陷入到了剑拔弩张的地步…… 自然与人的关系也遭遇了前所未有的挑战。\n电影改编自姜戎同名小说，耗时5年拍摄完成。©豆瓣", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/42527.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/42527.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/42527.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1056047\/", "id": "1056047", "name": "让-雅克·阿诺" }], "comments_count": 37920, "ratings_count": 73504, "aka": ["Le Dernier loup", "Wolf Totem"] }, { "rating": { "max": 10, "average": 7.2, "stars": "40", "min": 0 }, "reviews_count": 42, "wish_count": 6027, "collect_count": 7726, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2190768432.jpg", "large": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2190768432.jpg", "medium": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/spst\/public\/p2190768432.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/5153254\/", "id": "5153254", "mobile_url": "http:\/\/movie.douban.com\/subject\/5153254\/mobile", "title": "爱你，罗茜", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["喜剧", "爱情"], "countries": ["德国", "英国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/38360.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/38360.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/38360.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1018977\/", "id": "1018977", "name": "莉莉·柯林斯" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/49727.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/49727.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/49727.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1010617\/", "id": "1010617", "name": "山姆·克拉弗林" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/4694.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/4694.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/4694.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1036455\/", "id": "1036455", "name": "塔姆欣·伊格顿" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/31139.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/31139.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/31139.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1315313\/", "id": "1315313", "name": "杰美·温斯顿" }], "current_season": null, "original_title": "Love, Rosie", "summary": "《親愛的，原來是你》(Love, Rosie)改編自全球破億經典愛情電影《留給最愛的情書》(PS, I Love You)原著小說作家Cecelia Ahern另一幽默感人作品《Where Rainbows End》。由基斯頓迪他(Christian Ditter)執導，《魔鏡•魔鏡:白雪公主決戰黑心皇后》莉莉歌蓮絲(Lily Collins)及《飢餓遊戲》系列森加芬(Sam Claflin)主演。故事講述青梅竹馬的二人，一同成長面對大世界，一直處於「友達以上，戀人未滿」的狀態，卻各自遇到戀愛上的酸甜苦辣，直到最後發現，最愛的原來就是對方。二人首次合作即默契十足，火花閃耀大銀幕。為今個聖誕，帶來最觸動人心、最浪漫感人的愛情喜劇。", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img3.douban.com\/pics\/celebrity-default-small.gif", "large": "http:\/\/img3.douban.com\/pics\/celebrity-default-large.gif", "medium": "http:\/\/img3.douban.com\/pics\/celebrity-default-medium.gif" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1282480\/", "id": "1282480", "name": "克利斯汀·迪特" }], "comments_count": 3558, "ratings_count": 6692, "aka": ["亲爱的，原来是你(港)", "真爱绕圈圈(台)"] }, { "rating": { "max": 10, "average": 7.2, "stars": "35", "min": 0 }, "reviews_count": 49, "wish_count": 9513, "collect_count": 9021, "douban_site": "", "year": "2015", "images": { "small": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2216003356.jpg", "large": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2216003356.jpg", "medium": "http:\/\/img5.douban.com\/view\/movie_poster_cover\/spst\/public\/p2216003356.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/11540651\/", "id": "11540651", "mobile_url": "http:\/\/movie.douban.com\/subject\/11540651\/mobile", "title": "许三观", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["剧情", "家庭"], "countries": ["韩国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/12645.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/12645.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/12645.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1032680\/", "id": "1032680", "name": "河正宇" }, { "avatars": { "small": "http:\/\/img5.douban.com\/img\/celebrity\/small\/359.jpg", "large": "http:\/\/img5.douban.com\/img\/celebrity\/large\/359.jpg", "medium": "http:\/\/img5.douban.com\/img\/celebrity\/medium\/359.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1032501\/", "id": "1032501", "name": "河智苑" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1357451695.41.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1357451695.41.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1357451695.41.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1028294\/", "id": "1028294", "name": "尹恩惠" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/GbadPeppScgcel_avatar_uploaded1362804460.73.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/GbadPeppScgcel_avatar_uploaded1362804460.73.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/GbadPeppScgcel_avatar_uploaded1362804460.73.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1327294\/", "id": "1327294", "name": "郑满植" }], "current_season": null, "original_title": "허삼관", "summary": "故事发生在20世纪60年代的韩国，居住在某个乡村的贫穷青年许三观（河正宇 饰）喜欢上了同村最美丽的姑娘许玉兰（河智苑 饰）。传闻玉兰是小混混何小勇的女朋友，但是三观凭借锲而不舍的精神和憨皮赖脸的劲头说服了未来的老丈人，如愿抱得美人归。婚后数年，夫妻二人先后育有一乐、二乐、三乐三个机灵调皮的儿子，一家人的生活也有滋有味。但是一乐越来越像何小勇，引来村里人议论纷纷，这让许三观坐立不安，而他对玉兰、一乐的感情似乎也由此发生了变化。在那个卖血成风的年代，三观曾经用自己的血换来了钱。令他想不到的是，在接下来的人生里，他将不得不为了家人们一次次卖血，苍白羸弱，命在旦夕……\n本片根据余华的小说《许三观卖血记》改编。©豆瓣", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/12645.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/12645.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/12645.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1032680\/", "id": "1032680", "name": "河正宇" }], "comments_count": 3761, "ratings_count": 7701, "aka": ["许三观卖血记", "허삼관 매혈기", "Chronicle of a Blood Merchant"] }, { "rating": { "max": 10, "average": 7.1, "stars": "35", "min": 0 }, "reviews_count": 84, "wish_count": 13746, "collect_count": 16884, "douban_site": "", "year": "2014", "images": { "small": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/ipst\/public\/p2203481530.jpg", "large": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/lpst\/public\/p2203481530.jpg", "medium": "http:\/\/img3.douban.com\/view\/movie_poster_cover\/spst\/public\/p2203481530.jpg" }, "alt": "http:\/\/movie.douban.com\/subject\/21263666\/", "id": "21263666", "mobile_url": "http:\/\/movie.douban.com\/subject\/21263666\/mobile", "title": "美国狙击手", "do_count": null, "seasons_count": null, "schedule_url": "", "episodes_count": null, "genres": ["传记", "动作", "战争"], "countries": ["美国"], "casts": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/6473.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/6473.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/6473.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1013757\/", "id": "1013757", "name": "布莱德利·库珀" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/61.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/61.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/61.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1003485\/", "id": "1003485", "name": "西耶娜·米勒" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/1375536678.24.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/1375536678.24.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/1375536678.24.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1004795\/", "id": "1004795", "name": "卢克·葛莱姆斯" }, { "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/8092.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/8092.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/8092.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1027808\/", "id": "1027808", "name": "凯尔·加尔纳" }], "current_season": null, "original_title": "American Sniper", "summary": "克里斯·凯尔（布莱德利·库珀 Bradley Cooper 饰）原本是一名普通美国牛仔，“911”事件以后他以30岁的高龄参加了海豹突击队，并成为了伊拉克战场上的一名优秀狙击手。参军之后克里斯认识了塔雅（西耶娜·米勒 Sienna Miller 饰），两人很快结婚生子，但是随着克里斯的多次出征伊拉克，两人的家庭发生了很多问题。战场上的克里斯十分优秀，被队友称呼为“传奇”，恐怖分子以高额奖金请职业狙击手猎杀他，但屡次都未得手，可是身边的队友却一个个遭遇不测，虽然妻子三番五次恳求他退伍，但是他抱着为队友复仇的信念最后一次出征……\n本片改编自克里斯·凯尔的自传《美国狙击手》©豆瓣", "subtype": "movie", "directors": [{ "avatars": { "small": "http:\/\/img3.douban.com\/img\/celebrity\/small\/5064.jpg", "large": "http:\/\/img3.douban.com\/img\/celebrity\/large\/5064.jpg", "medium": "http:\/\/img3.douban.com\/img\/celebrity\/medium\/5064.jpg" }, "alt": "http:\/\/movie.douban.com\/celebrity\/1054436\/", "id": "1054436", "name": "克林特·伊斯特伍德" }], "comments_count": 5605, "ratings_count": 14458, "aka": [] }
            ];

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

        movieCollection.push(getWeeklyMovies());
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
