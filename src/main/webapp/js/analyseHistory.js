var url = '/shares-gradle/analyse/getProfitableShares.do';
var oneDay = 1000 * 60 * 60 * 24;
var analises;
var sellDay = new Array();
$(function(){
	$("#table_body").delegate("tr", "mouseover", function () {
		$(this).addClass("focusBackColor");
	});
	$("#table_body").delegate("tr", "mouseout", function () {
		$(this).removeClass("focusBackColor");
	});
	
	getData(1.05, 1, 50);
	
});

function getData (minProfit, pageNum, pageSize) {
	var tempUrl = url + "?minProfit=" + minProfit +
		"&pageNum=" + pageNum +
		"&pageSize=" + pageSize +
		"&callback=?";
	$.getJSON(tempUrl, function(data) {
		data = data[0];
        if (data.success) {
            analises = data.result;
            formatTable();
        } else {
            alert("error")
        }
	});
}

//获取java时间戳代表的时间
function getTimeStrFormJava(javaTime) {
    if (!isNotNull(javaTime)) {
        return "";
    }
    var jsTime = Number(javaTime);
    var updateTime = new Date(jsTime);
    var updateTimeStr = getTimeStr(updateTime);
    return updateTimeStr;
}
// 不要直接调用
function getTimeStr(mydate) {
    var myyear,mymonth,myweek,myday,mytime,mymin,myhour,mysec;
    myyear=mydate.getFullYear();
    mymonth=addZero(mydate.getMonth() + 1);
    myday=addZero(mydate.getDate());
    myhour=addZero(mydate.getHours());
    mymin=addZero(mydate.getMinutes());
    mysec=addZero(mydate.getSeconds());
    mytime= myyear+"/"+mymonth+"/"+myday+" "+myhour+":"+mymin+":"+mysec;
    return mytime;
}
function isNotNull(obj) {
    return typeof(obj) != "undefined" && obj != "null" && obj != null && obj!= "";
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

function formatTable() {
	var size = analises.length;
    var trsStr = '';
    var arithmeticResultOld = 0;
    var arithmeticResultNew = 0;
    var lowBuyPrce = false;
    var overMaxPrice = false;
    var i = 0;
    /* 明日数据为空的记录数 */
    var nullNum = 0;
    for (; i < size; i++) {
        if (i%2 == 1) {
            trsStr = trsStr + '<tr class="backColor">';
        } else {
            trsStr = trsStr + '<tr>';
        }
        trsStr = trsStr + '<td class="tdBorder" width="40px">' + (i+1) + '</td>';
        trsStr = trsStr + '<td class="tdBorder" width="100px">' + analises[i].todayDayData.shareCode + '</td>';
        trsStr = trsStr + '<td class="tdBorder" width="150px">' + getTimeStrFormJava(analises[i].todayDayData.updateTime) + '</td>';
        trsStr = trsStr + '<td class="tdBorder todayStart" width="60px">' + formatNumber(analises[i].todayDayData.todayStart).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder maxPrice" width="60px">' + formatNumber(analises[i].todayDayData.maxPrice).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder minPrice" width="60px">' + formatNumber(analises[i].todayDayData.minPrice).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder todayEnd" width="60px">' + formatNumber(analises[i].todayDayData.todayEnd).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder todayTrend" width="60px">' + formatNumber(analises[i].todayDayData.trend).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder todayTrend" width="60px">' + formatNumber(analises[i].todayDayData.maxTrend).toFixed(2) + '</td>';
        if (isNotNull(analises[i].tomorrowDayData)) {
            trsStr = trsStr + '<td class="tdBorder todayStartT" width="60px">' + formatNumber(analises[i].tomorrowDayData.todayStart).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder maxPriceT" width="60px">' + formatNumber(analises[i].tomorrowDayData.maxPrice).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder minPriceT" width="60px">' + formatNumber(analises[i].tomorrowDayData.minPrice).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder tomorrowTrend" width="60px">' + formatNumber(analises[i].tomorrowDayData.trend).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart1" width="120px">' + ((formatNumber(analises[i].todayDayData.maxPrice)/formatNumber(analises[i].todayDayData.minPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart2" width="120px">' + ((formatNumber(analises[i].todayDayData.todayEnd)/formatNumber(analises[i].todayDayData.minPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart3" width="120px">' + ((formatNumber(analises[i].tomorrowDayData.todayStart)/formatNumber(analises[i].todayDayData.todayEnd) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart4" width="120px">' + ((formatNumber(analises[i].tomorrowDayData.maxPrice)/formatNumber(analises[i].todayDayData.minPrice) -1 ) * 100).toFixed(2) + '</td>';
            
            arithmeticResultOld = arithmeticOld(analises[i]);
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + arithmeticResultOld + '</td>';
            
            arithmeticResultNew = arithmeticNew(analises[i]);
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + arithmeticResultNew + '</td>';
            
            trsStr = trsStr + '<td class="tdBorder" width="60px">';
            if (lowBuyPrce) {
            	trsStr = trsStr + '<span class="redText">' + analises[i].todayDayData.minPrice + '</span>';
            } else {
            	trsStr = trsStr + '<span>' + analises[i].todayDayData.minPrice + '</span>';
            }
            trsStr = trsStr + '/' + arithmeticResultOld + '/';
            if (overMaxPrice) {
            	trsStr = trsStr + '<span class="redText">' +analises[i].tomorrowDayData.maxPrice + '</span>';
            } else {
            	trsStr = trsStr + '<span>' + analises[i].tomorrowDayData.maxPrice + '</span>';
            }
            trsStr = trsStr + '</td>';
            
        } else {
        	nullNum ++;
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
        }
        trsStr = trsStr + '</tr>';
    }
    $("#table_body").html(trsStr);
    
    $("#td_statistics").html('');
    $("#td_statistics_15").html('');
    $("#td_statistics_20").html('');
    $("#more_1").html('');
    $("#more_2").html('');
    $("#more_3").html('');
    $("#more_4").html('');
    
    
    $("#more_1_15").html('');
    $("#more_2_15").html('');
    $("#more_3_15").html('');
    $("#more_4_15").html('');

    $("#more_1_20").html('');
    $("#more_2_20").html('');
    $("#more_3_20").html('');
    
    var tfootTop = $("#table_body").height() + $("#table_body").position().top;
    $("#td_statistics").parents("tfoot").attr("style", 'position: absolute; margin: 10px auto; top:' + tfootTop + 'px;');
    if (i%2 == 1) {
    	$("#td_statistics").parents("tr").addClass("backColor");
    	$("#td_statistics_15").parents("tr").removeClass("backColor");
    	$("#td_statistics_20").parents("tr").addClass("backColor");
    } else {
        $("#td_statistics").parents("tr").removeClass("backColor");
    	$("#td_statistics_15").parents("tr").addClass("backColor");
        $("#td_statistics_20").parents("tr").removeClass("backColor");
    }
}

function arithmeticOld(obj) {
//	var lastTrend = (obj.todayDayData.maxPrice / obj.todayDayData.minPrice - 1) * 100;
//	var baseTrend = (obj.tomorrowDayData.todayStart / obj.todayDayData.minPrice - 1) * 100;
//	var todayBase = (obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
//	var lastTrend2 = (obj.todayDayData.maxPrice / obj.todayDayData.minPrice - 1) * 100;
//	var sellPrice = 0;
//	var trend = 0;
//	if (baseTrend > 0.9) {
//		if (lastTrend > 4 && todayBase > 1) {
//			trend = todayBase + lastTrend * todayBase;
//		} else {
//			trend = baseTrend + lastTrend * lastTrend / 10 - Math.abs(obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
//		}
//		if (trend > 11) {
//			trend = 11;
//		}
//		if (trend < 1.5) {
//			trend = 1.5;
//		}
//		sellPrice = obj.todayDayData.minPrice * (1 + trend / 100);
//	} else if (baseTrend > 0) {
//		trend = (lastTrend2 / 1.6 + todayBase   + lastTrend / 2) - 3;
//		if (trend < 0.5) {
//			trend = 0.3;
//		}
//		sellPrice = obj.todayDayData.minPrice * (1 + trend / 100);
//	} else {
//		sellPrice = obj.todayDayData.minPrice;
//	}
	var lastTrend = (obj.todayDayData.maxPrice/obj.todayDayData.minPrice  - 1) * 100;
    var baseTrend = (obj.tomorrowDayData.todayStart/obj.todayDayData.minPrice - 1) * 100;
	var todayBase = (obj.tomorrowDayData.todayStart/obj.todayDayData.todayEnd - 1) * 100;
    var sellPrice = 0;
    var trend = 0;
    if (baseTrend > 0) {
	    trend = todayBase + lastTrend * lastTrend / 10;
	    
	    if (trend < 2) {
	        trend = 2;
	    }
        sellPrice = obj.todayDayData.minPrice * (1 + trend / 100);
    } else {
    	sellPrice = obj.todayDayData.minPrice * 1.01;
    }
    return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function arithmeticNew(obj) {
	var lastTrend = (obj.todayDayData.maxPrice/obj.todayDayData.minPrice  - 1) * 100;
    var baseTrend = (obj.tomorrowDayData.todayStart/obj.todayDayData.minPrice - 1) * 100;
	var todayBase = (obj.tomorrowDayData.todayStart/obj.todayDayData.todayEnd - 1) * 100;
    var sellPrice = 0;
    var trend = 0;
    if (baseTrend > 0) {
	    trend = todayBase + lastTrend * lastTrend / 10;
	    
	    if (trend < 2) {
	        trend = 2;
	    }
        sellPrice = obj.todayDayData.minPrice * (1 + trend / 100);
    } else {
    	sellPrice = obj.todayDayData.minPrice * 1.01;
    }
    return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function isNotNullForJava(obj) {
	return isNotNull(obj) && obj != null;
}
