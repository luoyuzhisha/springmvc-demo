var flashUrl = 'http://finance.sina.com.cn/flash/cn.swf?';
var analyse_url = '/shares-gradle/analyse/getAnalyseDayDatas.do';
var analyse_capital_data_url = '/shares-gradle/analyse/getCapitalData.do';
$(function() {
	
	$("#buys_div .buysTable").delegate("tr", "click", function () {
		$("#buys_div .buysTable tr").removeClass("focusBackColor");
		$(this).addClass("focusBackColor");
		showChart($(this).find(".shareCode").html(), $(this).find(".updateTime").html(), null);
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
		return Number(0);
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

function showChart(shareCode, startTime, endTime) {
	if (isNotNull(shareCode)) {
		if (isNotNull(startTime)) {
			var sendStartTime = new Date(startTime).setHours(0);
		} else {
			var sendStartTime = "";
		}
		if (isNotNull(endTime)) {
			var sendEndTime = new Date(endTime).setHours(23);
		} else {
			var sendEndTime = "";
		}
		$.ajax({
	        type: "GET",
	        url: analyse_capital_data_url + "?shareCode=" + shareCode + "&startTime=" + sendStartTime + "&endTime=" + sendEndTime + "&date=" + new Date(),
	        dataType: "json",
	        success: function(data){
	        	var days = data.result;
	        	if (!data.success) {
	        		alert(data.result)
	        		return;
	        	}
	        	var priceData = [];
	        	var veryBigRatioData = [];
	        	var totalInData = [];
	        	var totalOutData = [];
	        	var totalData = [];
	        	var totalPerData = [];
	        	if (isNotNull(days)) {
	        		$("#analyseDayTableBody").html("");
	        		var maxPrice = 0;
	        		var minPrice = 100000;
	        		var totalIn = 0;
	        		var maxTotalIn = 0;
	        		var minTotalIn = 100000000000000.0;
	        		var totalOut = 0;
	        		var maxTotalOut = 0;
	        		var minTotalOut = 10000000000000.0;
	        		var total = 0;
	        		var maxTotal = 0;
	        		var minTotal = 100000000000000.0;
	        		// 主净流入占主流入百分比
	        		var totalPer = 0;
	        		var maxTotalPer = -100;
	        		var minTotalPer = 100;
	        		for (var i =0; i < days.length; i++) {
	        			totalIn = formatNumber(days[i].veryBigIn) + formatNumber(days[i].bigIn) + formatNumber(days[i].middleIn) + formatNumber(days[i].smallIn);
                        totalOut = formatNumber(days[i].veryBigOut) + formatNumber(days[i].bigOut) + formatNumber(days[i].middleOut) + formatNumber(days[i].smallOut);
                        total = totalIn - totalOut;
                        if ((totalIn - formatNumber(days[i].smallIn)) == 0) {
                        	totalPer = -100;
                        } else {
                        	totalPer = (total - formatNumber(days[i].smallIn) + formatNumber(days[i].smallOut)) / (totalIn - formatNumber(days[i].smallIn)) * 100;
                        }
	        			if (maxPrice < days[i].currentPrice) {
	        				maxPrice = days[i].currentPrice;
	        			}
	        			if (minPrice > days[i].currentPrice) {
	        				minPrice = days[i].currentPrice;
	        			}
	        			if (maxTotal < total) {
	        				maxTotal = total;
	        			}
	        			if (minTotal > totalPer) {
	        				minTotal = totalPer;
	        			}
	        			if (maxTotalPer < totalPer) {
	        				maxTotalPer = totalPer;
	        			}
	        			if (minTotalPer > totalPer) {
	        				minTotalPer = totalPer;
	        			}
	        		}
	        		// 这两个值直接取
	        		minTotalIn = 0;
	        		minTotalOut = 0;
	        		maxTotalIn = totalIn;
	        		maxTotalOut = totalOut;
	        		
	        		var priceSpan = maxPrice - minPrice;
	        		var totalSpan = maxTotal - minTotal;
	        		var totalPerSpan = maxTotalPer - minTotalPer;
	        		// 更新时间和购买时间的间隔
	        		var currentTime = 0;
	        		for (var i =0; i < days.length; i++) {
	        			totalIn = formatNumber(days[i].veryBigIn) + formatNumber(days[i].bigIn) + formatNumber(days[i].middleIn) + formatNumber(days[i].smallIn);
                        totalOut = formatNumber(days[i].veryBigOut) + formatNumber(days[i].bigOut) + formatNumber(days[i].middleOut) + formatNumber(days[i].smallOut);
                        total = totalIn - totalOut;
                        if ((totalIn - formatNumber(days[i].smallIn)) == 0) {
                        	totalPer = -100;
                        } else {
                        	totalPer = (total - formatNumber(days[i].smallIn) + formatNumber(days[i].smallOut)) / (totalIn - formatNumber(days[i].smallIn)) * 100;
                        }
	        			currentTime = formatNumber(days[i].createTime);
	        			
	        			priceData.push([currentTime, formatNumber(days[i].currentPrice)]);
	        			veryBigRatioData.push([currentTime, minPrice + convertRatio(days[i].bigRatio) / 360 * priceSpan])
	        			totalInData.push([currentTime, minPrice + totalIn / maxTotalIn * priceSpan]);
	        			totalOutData.push([currentTime, minPrice + totalOut / maxTotalOut * priceSpan]);
	        			totalData.push([currentTime, minPrice + (total - minTotal) / totalSpan * priceSpan]);
	        			totalData.push([currentTime, minPrice + (total - minTotal) / totalSpan * priceSpan]);
	        			totalPerData.push([currentTime, minPrice + (totalPer - minTotalPer) / totalPerSpan * priceSpan]);
	        		}
	        		
	        		priceData = priceData.sort(compareData);
	        		veryBigRatioData = veryBigRatioData.sort(compareData);
	        		totalInData = totalInData.sort(compareData);
	        		totalOutData = totalOutData.sort(compareData);
	        		totalData = totalData.sort(compareData);
	        		totalPerData = totalPerData.sort(compareData);
	        		
	        		//myDrawChart("analyse_chart", priceData, veryBigRatioData, totalData, totalOutData);
	        		myDrawChart("analyse_chart", priceData, totalData, null, null);
	        	}
	        }
		});
	}
}

/**
 * 转换新浪的主力罗盘为0~360
 * @param ratio
 */
function convertRatio(ratio) {
	if (formatNumber(ratio) > 0) {
		return formatNumber(ratio);
	} else if (formatNumber(ratio) < 0) {
		return 360 - formatNumber(ratio) * -1;
	}
}

function myDrawChart(id, data1, data2, data3, data4) {
	var datas = [];
	if (isNotNull(data1)) {
		datas.push({ data : data1, label :'价格', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data2)) {
		datas.push({ data : data2, label :'罗盘', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data3)) {
		datas.push({ data : data3, label :'净入', lines : { show : true }, points : { show : true } });
	}
	if (isNotNull(data4)) {
		datas.push({ data : data4, label :'总出', lines : { show : true }, points : { show : true } });
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
			labelsAngle:90
			//noTicks : 10
			
		},
		colors: ['#00FF00', '#FF0000', '#0000FF', '#FFFF00', '00FFFF'],
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