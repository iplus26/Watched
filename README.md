# overview
第三方豆瓣电影 for Windows 8.1 客户端

![Imgur](http://i.imgur.com/Uw8Kjbd.jpg)
![Imgur](http://i.imgur.com/EjqRgdF.jpg)

# todo
* **important & urgent:** 电影页面，use Hub UI. (ME)
	* 豆瓣的基本信息，IMDb 信息等
	* 跳转播放预告片、在线观看等
* **important:** Charms Bar Search（精哥）
* icon and launch picture. (韩)
* Charms Bar Share based on screen shot of the movie item detail page. [Document](https://msdn.microsoft.com/en-us/library/windows/apps/windows.applicationmodel.datatransfer.datatransfermanager.showshareui.aspx)
* 影人页面
* 剧集页面（剧集使用 Trakt.tv 的 API 获取剧集更新，监测 kickass 的资源更新，在线播放等）
* 「看过」的更多功能
* *豆瓣在新版 API 中去掉了收藏电影的接口，科科*

# update
2015.03.20

* itemDetail Page
	* 降伏 WinJS.UI.Rating

2015.03.19

* itemDetail Page
	* 海报（豆瓣不向普通权限开放海报的接口，自己 hack 了一下）
	* 角儿 ListView

2015.03.18

* add itemDetail Page
	* 基本信息
	* CSS 文本两端对齐 [知乎](http://www.zhihu.com/question/19895400/answer/13383826)
* fix a bug: 首页点进去会错乱到口碑榜的其他电影

2015.03.11

* add 豆瓣电影口碑榜（豆瓣不向普通权限开放口碑榜接口, dirty hack）

2015.03.10

* groupDetail Page

2015.03.09

* groupedItems Page

