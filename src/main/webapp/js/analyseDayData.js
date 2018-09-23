var flashUrl = 'http://finance.sina.com.cn/flash/cn.swf?';
var analyse_url = '/shares-gradle/analyse/getAnalyseDayDatas.do';
var analyse_day_data_url = '/shares-gradle/analyse/getDayDatas.do';
$(function() {
	
	$("#buys_div .buysTable").delegate("tr", "click", function () {
		$("#buys_div .buysTable tr").removeClass("focusBackColor");
		$(this).addClass("focusBackColor");
		showChart($(this).find(".shareCode").html(), 10, $(this).find(".longUpdateTime").val());
		$("#analyseTableHeadDiv").html("股票代码：" 
				+ $(this).find(".shareCode").html()
				+ "， 分析时间：" + $(this).find(".updateTime").html()
				+ "， Trend：" + $(this).find(".trend").html());
		$("#show_share_mode_flash").html(buildFlashObject($(this).find(".shareCode").html()));
	});
	getData(81.0, 1, 50);
});

function getData (maxTrend, pageNum, pageSize) {
	var tempUrl = analyse_url + "?pageNum=" + pageNum + 
	    "&pageSize=" + pageSize +
		"&maxTrend=" + maxTrend + "&callback=?";
	$.getJSON(tempUrl, function(data) {
		data = data[0];
        if (data.success) {
            formatTable(data);
        } else {
            alert("error")
        }
	});
}

// 获取java时间戳代表的时间
function getTimeStrFormJava(javaTime) {
	if (!isNotNull(javaTime)) {
		return "";
	}
	var jsTime = Number(javaTime);
	var updateTime = new Date(jsTime);
	var updateTimeStr = getTimeStr(updateTime);
	return updateTimeStr;
}

//获取java时间戳代表的时间
function getShortTimeStrFormJava(javaTime) {
	if (!isNotNull(javaTime)) {
		return "";
	}
	var jsTime = Number(javaTime);
	var updateTime = new Date(jsTime);
	var updateTimeStr = getShortDateStr(updateTime);
	return updateTimeStr;
}

// 不要直接调用
function getTimeStr(mydate) {
	var myyear, mymonth, myweek, myday, mytime, mymin, myhour, mysec;
	myyear = mydate.getFullYear();
	mymonth = addZero(mydate.getMonth() + 1);
	myday = addZero(mydate.getDate());
	myhour = addZero(mydate.getHours());
	mymin = addZero(mydate.getMinutes());
	mysec = addZero(mydate.getSeconds());
	mytime = myyear + "/" + mymonth + "/" + myday + " " + myhour + ":" + mymin + ":" + mysec;
	return mytime;
}

//不要直接调用
function getShortDateStr(mydate) {
	var myyear, mymonth, myday, mytime;
	myyear = mydate.getFullYear();
	mymonth = addZero(mydate.getMonth() + 1);
	myday = addZero(mydate.getDate());
	mytime = myyear + "/" + mymonth + "/" + myday;
	return mytime;
}

function isNotNull(obj) {
	return typeof (obj) != "undefined" && obj != "null" && obj != null && obj != "";
}
function addZero(str) {
	str = str.toString();
	if (str.length == 1) {
		str = '0' + str;
	}
	return str;
}
function formatNumber(str) {
	if (isNotNull(str)) {
		return Number(str);
	} else {
		return Number(-1);
	}
}

function compareData(data1, data2) {
	if (formatNumber(data2[0]) < formatNumber(data1[0])) {
		return -1;
	} else if (formatNumber(data2[0]) > formatNumber(data1[0])) {
		return 1;
	} else {
		return 0;
	}
}

function formatTable(data) {
	var result = data.result;
	var tempTr = null;
	$(".buysTable tbody tr:visible").each(function(){
		$(this).remove();
	});
	if (isNotNull(result)) {
		for (var i =0; i < result.length; i++) {
			tempTr = $(".hideBuyTr").clone();
			tempTr.find(".shareCode").html(result[i].shareCode);
			tempTr.find(".longUpdateTime").val(result[i].updateTime);
			tempTr.find(".updateTime").html(getShortTimeStrFormJava(result[i].updateTime));
			tempTr.find(".todayStart").html((formatNumber(result[i].todayStart)).toFixed(2));
			tempTr.find(".minPrice").html((formatNumber(result[i].minPrice)).toFixed(2));
			tempTr.find(".maxPrice").html((formatNumber(result[i].maxPrice)).toFixed(2));
			tempTr.find(".todayEnd").html((formatNumber(result[i].todayEnd)).toFixed(2));
			tempTr.find(".trend").html((formatNumber(result[i].maxTrend)).toFixed(2));
			tempTr.removeClass("hideBuyTr");
			$(".buysTable tbody").append(tempTr);
		}
	}
}

function showChart(shareCode, day, endTime) {
	if (isNotNull(shareCode)) {
		var sendEndTime = formatNumber(endTime) + 1000 * 60 * 60 * 24 * 3;
		$.ajax({
	        type: "GET",
	        url: analyse_day_data_url + "?shareCode=" + shareCode + "&maxTrend=81.0&day=" + day + "&endTime=" + sendEndTime + "&date=" + new Date(),
	        dataType: "json",
	        success: function(data){
	        	var days = data.result;
	        	var maxPriceData = [];
	        	var startPriceData = [];
	        	var endPriceData = [];
	        	var maxDealNumData = [];
	        	if (isNotNull(days)) {
	        		$("#analyseDayTableBody").html("");
	        		var maxPrice = 0;
	        		var minPrice = 100000;
	        		var maxDealNum = 0;
	        		var minDealNum = 10000000000;
	        		for (var i =0; i < days.length; i++) {
	        			if (maxPrice < days[i].maxPrice) {
	        				maxPrice = days[i].maxPrice;
	        			}
	        			if (minPrice > days[i].todayStart) {
	        				minPrice = days[i].todayStart;
	        			}
	        			if (maxDealNum < days[i].maxDealNum) {
	        				maxDealNum = days[i].maxDealNum;
	        			}
	        			if (minDealNum > days[i].maxDealNum) {
	        				minDealNum = days[i].maxDealNum;
	        			}
	        		}
	        		var priceSpan = (maxPrice - minPrice) / 10;
	        		var dealNumSpan = (maxDealNum - minDealNum) / 10;
	        		// 更新时间和购买时间的间隔
	        		var timeSpan = 0;
	        		var tempTr = "";
	        		for (var i =0; i < days.length; i++) {
	        			timeSpan = formatNumber(days[i].updateTime) - formatNumber(endTime);
	        			maxPriceData.push([formatNumber(days[i].updateTime),
	        			                             formatNumber(days[i].maxPrice) ]);
	        			startPriceData.push([formatNumber(days[i].updateTime),
  			                             formatNumber(days[i].todayStart) ]);
	        			endPriceData.push([formatNumber(days[i].updateTime),
	  			                             formatNumber(days[i].todayEnd) ]);
	        			maxDealNumData.push([formatNumber(days[i].updateTime),
  			                             formatNumber((days[i].maxDealNum - minDealNum) / dealNumSpan * priceSpan + minPrice) ]);
	        			if (timeSpan >= 0 && timeSpan <  43200000) {
	        				tempTr = "<tr class='focusBackColor'>";
	        			} else {
	        				tempTr = "<tr>";
	        			}
	        			tempTr += "<td>" + getShortTimeStrFormJava(days[i].updateTime) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].todayStart).toFixed(2) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].maxPrice).toFixed(2) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].minPrice).toFixed(2) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].todayEnd).toFixed(2) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].maxDealNum) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].trend).toFixed(2) +"</td>";
	        			tempTr += "<td>" + formatNumber(days[i].maxTrend).toFixed(2) +"</td>";
	        			tempTr += "<td>" + getTimeStrFormJava(days[i].maxTrendTime) +"</td>";
	        			tempTr += "<td>" + getTimeStrFormJava(days[i].minTime) +"</td>";
	        			tempTr += "</tr>";
	        			$("#analyseDayTableBody").append(tempTr);
	        		}
	        		
	        		maxPriceData = maxPriceData.sort(compareData);
	        		startPriceData = startPriceData.sort(compareData);
	        		endPriceData = endPriceData.sort(compareData);
	        		maxDealNumData = maxDealNumData.sort(compareData);
	        		
	        		myDrawChart("analyse_chart", maxPriceData, startPriceData, endPriceData, maxDealNumData);
	        	}
	        }
		});
	}
}

function myDrawChart(id, data1, data2, data3, data4) {
	var datas = [];
	if (isNotNull(data1)) {
		datas.push({ data : data1, label :'最高价', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data2)) {
		datas.push({ data : data2, label :'开盘价', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data3)) {
		datas.push({ data : data3, label :'收盘价', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data4)) {
		datas.push({ data : data4, label :'成交量', lines : { show : true }, points : { show : true } });
	}
	var graph = Flotr.draw(document.getElementById(id), datas, {
		mouse : {
			track: true,          // => 为true时,当鼠标移动到每个折点时,会显示折点的坐标
            trackAll: true,       // => 为true时,当鼠标在线条上移动时,显示所在点的坐标
            position: 'se',        // => 鼠标事件显示数据的位置 (default south-east)
            relative: false,       // => 当为true时,鼠标移动时,即使不在线条上,也会显示相应点的数据
            trackFormatter: function (n) { return getShortTimeStrFormJava(n); },
			lineColor : 'purple',
			relative : true,
			sensibility : 1,
			trackDecimals : 2,
			trackFormatter : function(o) {
				return 'x = ' + getShortTimeStrFormJava(o.x) + ', y = ' + o.y;
			}
		},
		crosshair : {
			mode : 'xy'
		},
		xaxis : {
			tickFormatter : function (n) { return getShortTimeStrFormJava(n); },
			labelsAngle:90,
			noTicks : 10
			
		},
		colors: ['#00FF00', '#FF0000', '#0000FF', '#AAAAAA', 'AAAA00'],
		shadowSize:0
	});
}

function buildFlashObject(shareCode) {
    var flashObjectStr = '<object type="application/x-shockwave-flash" data="' + flashUrl + '" width="560" height="490" id="flash" style="visibility: visible;">';
    flashObjectStr += '<param name="allowFullScreen" value="true">';
    flashObjectStr += '<param name="allowScriptAccess" value="always">';
    flashObjectStr += '<param name="wmode" value="transparent">';
    flashObjectStr += '<param name="flashvars" value="symbol=sh' + shareCode + '">';
    flashObjectStr += '</object>';
    return flashObjectStr;
}