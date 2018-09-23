var url = '/shares-gradle/analyse/analyseTrend.do';
var analyseUrl = '/shares-gradle/analyse/getAnalyseDayData.do';
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
	getData(81.0, 1, 50);
});

function getData (minTrend, pageNum, pageSize) {
	var tempUrl = url + "?minTrend=" + minTrend +
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
    var profit = 0;/*总收益*/
    var tempProfit = 0;/*最大收益*/
    var profitFor15 = 0;/*总收益*/
    var tempProfitFor15 = 0;/*最大收益*/
    var profitFor20 = 0;/*总收益*/
    var tempProfitFor20 = 0;/*最大收益*/
    var totalPositiveCount = 0;
    var totalNegativeCount = 0;
    var totalPositiveCountFor15 = 0;
    var totalNegativeCountFor15 = 0;
    var totalPositiveCountFor20 = 0;
    var totalNegativeCountFor20 = 0;
    var arithmetic1Result = 0;
    var positiveCount1 = 0;
    var negativeCount1 = 0;
    var arithmeticResult2 = 0;
    var positiveCount2 = 0;
    var negativeCount2 = 0;
    var arithmeticResult3 = 0;
    var positiveCount3 = 0;
    var negativeCount3 = 0;
    var lostCount = 0;
    var totalDiff = 0;
    var lostCountFor15 = 0;
    var totalDiffFor15 = 0;
	// 预算值在后期的行情中没有出现
    var smartError = 0;
    
    /* 算法盈利 */
    
    /* 正确预算次数(小于最高价) */
    var positiveCount1For15 = 0;
    /* 失败预算次数(大于最高价) */
    var negativeCount1For15 = 0;
    var positiveCount2For15 = 0;
    var negativeCount2For15 = 0;
    var positiveCount3For15 = 0;
    var negativeCount3For15 = 0;
    
    var positiveCount1For20 = 0;
    var negativeCount1For20 = 0;
    var positiveCount2For20 = 0;
    var negativeCount2For20 = 0;
    var positiveCount3For20 = 0;
    var negativeCount3For20 = 0;
    var baseGT0 = 0;
	var baseLT0 = 0;
	var baseGT0All = 0;
	var baseLT0All = 0;
    /*标志位, 低于购买价*/
    var lowBuyPrce = true;
    /*标志位, 高于最高价*/
    var overMaxPrice = true;
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
        trsStr = trsStr + '<td class="tdBorder buyPrice" width="60px">' + formatNumber(analises[i].todayDayData.maxTrendPrice).toFixed(2) + '</td>';
        trsStr = trsStr + '<td class="tdBorder todayEnd" width="60px">' + formatNumber(analises[i].todayDayData.todayEnd).toFixed(2) + '</td>';
        if (isNotNull(analises[i].tomorrowDayData)) {
            trsStr = trsStr + '<td class="tdBorder todayStartT" width="60px">' + formatNumber(analises[i].tomorrowDayData.todayStart).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder maxPriceT" width="60px">' + formatNumber(analises[i].tomorrowDayData.maxPrice).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder minPriceT" width="60px">' + formatNumber(analises[i].tomorrowDayData.minPrice).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart1" width="60px">' + ((formatNumber(analises[i].todayDayData.maxPrice)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart2" width="60px">' + ((formatNumber(analises[i].todayDayData.todayEnd)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart3" width="60px">' + ((formatNumber(analises[i].tomorrowDayData.todayStart)/formatNumber(analises[i].todayDayData.todayEnd) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder smart4" width="60px">' + ((formatNumber(analises[i].tomorrowDayData.maxPrice)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100).toFixed(2) + '</td>';
            
            var tempBestProfit = (formatNumber(analises[i].tomorrowDayData.maxPrice)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100;
            if (tempBestProfit > 1) {
            	totalPositiveCount++;
            } else {
            	totalNegativeCount++;
            }
            
            arithmetic1Result = arithmetic1(analises[i]);
            if (arithmetic1Result < 0) {
            	negativeCount1++;
            } else {
            	positiveCount1++;
            }
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + arithmetic1Result + '</td>';
            
            arithmeticResult2 = arithmetic2(analises[i]);
            if (arithmeticResult2 < 0) {
                negativeCount2++;
            } else {
                positiveCount2++;
            }
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + arithmeticResult2 + '</td>';
            
            arithmeticResult3 = arithmetic3(analises[i]);
			trsStr = trsStr + '<td class="tdBorder" width="60px">' + (formatNumber(analises[i].tomorrowDayData.maxPrice/arithmeticResult3 - 1)*100).toFixed(2) + '</td>';
            if (arithmeticResult3 > analises[i].tomorrowDayData.maxPrice) {
                negativeCount3++;
                overMaxPrice = true;
            } else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice){
                positiveCount3++;
                overMaxPrice = false;
            }
            if (arithmeticResult3 < analises[i].todayDayData.maxTrendPrice ) {
            	lostCount++;
            	totalDiff += (analises[i].todayDayData.maxTrendPrice - arithmeticResult3)/analises[i].todayDayData.maxTrendPrice * 100;
            	lowBuyPrce = true;
            } else {
            	lowBuyPrce = false;
			}
            trsStr = trsStr + '<td class="tdBorder" width="60px">';
            if (lowBuyPrce) {
            	trsStr = trsStr + '<span class="redText">' + analises[i].todayDayData.maxTrendPrice + '</span>';
            } else {
            	trsStr = trsStr + '<span>' + analises[i].todayDayData.maxTrendPrice + '</span>';
            }
            trsStr = trsStr + '/' + arithmeticResult3 + '/';
            if (overMaxPrice) {
            	trsStr = trsStr + '<span class="redText">' +analises[i].tomorrowDayData.maxPrice + '</span>';
            } else {
            	trsStr = trsStr + '<span>' + analises[i].tomorrowDayData.maxPrice + '</span>';
            }
            trsStr = trsStr + '</td>';
            if (i - nullNum < 25) {
                if (tempBestProfit > 1) {
                    totalPositiveCountFor15++;
                } else {
                    totalNegativeCountFor15++;
                }
                
                if (arithmetic1Result < 0) {
                    negativeCount1For15++;
                } else {
                    positiveCount1For15++;
                }
                
                if (arithmeticResult2 < 0) {
                    negativeCount2For15++;
                } else {
                    positiveCount2For15++;
                }
                var baseTrend = (analises[i].tomorrowDayData.todayStart/analises[i].todayDayData.maxTrendPrice - 1) * 100;
				if (baseTrend > 0) {
					baseGT0All++;
				} else {
					baseLT0All++;
				}
                if (arithmeticResult3 > analises[i].tomorrowDayData.maxPrice) {
                    negativeCount3For15++;
					if (baseTrend > 0) {
						baseGT0++;
					} else {
						baseLT0++;
					}
                } else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice){
                    positiveCount3For15++;
                }
                if (arithmeticResult3 < analises[i].todayDayData.maxTrendPrice ) {
                    lostCountFor15++;
                    totalDiffFor15 += (analises[i].todayDayData.maxTrendPrice - arithmeticResult3)/analises[i].todayDayData.maxTrendPrice * 100;
                }
            }
            if (analises.length - i < 20) {
                if (tempBestProfit > 1) {
                    totalPositiveCountFor20++;
                } else {
                    totalNegativeCountFor20++;
                }
                
                if (arithmetic1Result < 0) {
                    negativeCount1For20++;
                } else {
                    positiveCount1For20++;
                }
                
                if (arithmeticResult2 < 0) {
                    negativeCount2For20++;
                } else {
                    positiveCount2For20++;
                }
                
                if (arithmeticResult3 > analises[i].tomorrowDayData.maxPrice) {
                    negativeCount3For20++;
                } else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice){
                    positiveCount3For20++;
                }
            }
            
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + (formatNumber((analises[i].todayDayData.maxPrice/analises[i].todayDayData.maxTrendPrice  - 1) * 100)).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + (formatNumber((analises[i].tomorrowDayData.todayStart/analises[i].todayDayData.maxTrendPrice  - 1) * 100)).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + (formatNumber((analises[i].tomorrowDayData.todayStart/analises[i].todayDayData.todayEnd - 1) * 100)).toFixed(2) + '</td>';
            
            // 针对购买数据,获取预期价格在哪天会出现
            // 先去获取数据
            if (isNotNullForJava(sellDay) && isNotNullForJava(sellDay[i])) {
            	trsStr = trsStr + '<td class="tdBorder" width="150px">' + getTimeStrFormJava(sellDay[i].updateTime) + '</td>';
            	trsStr = trsStr + '<td class="tdBorder" width="60px">' + Math.floor((sellDay[i].updateTime - analises[i].todayDayData.updateTime) / oneDay)  + '</td>';
            	trsStr = trsStr + '<td class="tdBorder" width="60px">' + sellDay[i].maxPrice.toFixed(2) + '</td>';
            	trsStr = trsStr + '<td class="tdBorder" width="60px">' + (formatNumber((sellDay[i].maxPrice/analises[i].todayDayData.maxTrendPrice  - 1) * 100)).toFixed(2) + '</td>';
            } else {
				smartError++;
            	trsStr = trsStr + '<td class="tdBorder" width="150px"><span class="redText">' + smartError + '</span></td><td class="tdBorder" width="60px"></td><td class="tdBorder" width="60px"></td><td class="tdBorder" width="60px"></td>';
            }
        } else {
        	nullNum ++;
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + ((formatNumber(analises[i].todayDayData.maxPrice)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px">' + ((formatNumber(analises[i].todayDayData.todayEnd)/formatNumber(analises[i].todayDayData.maxTrendPrice) -1 ) * 100).toFixed(2) + '</td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
            trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
			trsStr = trsStr + '<td class="tdBorder" width="120px"></td>';
			trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
			trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
			trsStr = trsStr + '<td class="tdBorder" width="60px"></td>';
			trsStr = trsStr + '<td class="tdBorder" width="150px"></td><td class="tdBorder" width="60px"></td><td class="tdBorder" width="60px"></td><td class="tdBorder" width="60px"></td>';
        }
        trsStr = trsStr + '</tr>';
    }
    $("#table_body").html(trsStr);
    
    $("#more_1").html(positiveCount1 + '/' + negativeCount1);
    $("#more_2").html(positiveCount2 + '/' + negativeCount2);
    $("#more_3").html(positiveCount3 + '/' + negativeCount3);
    $("#more_4").html(lostCount + '/' + totalDiff.toFixed(2));
    
    
    $("#more_1_15").html(positiveCount1For15 + '/' + negativeCount1For15);
    $("#more_2_15").html(positiveCount2For15 + '/' + negativeCount2For15);
    $("#more_3_15").html(positiveCount3For15 + '/' + negativeCount3For15);
    $("#more_4_15").html(lostCountFor15 + '/' + totalDiffFor15.toFixed(2));

    $("#more_1_20").html(positiveCount1For20 + '/' + negativeCount1For20);
    $("#more_2_20").html(positiveCount2For20 + '/' + negativeCount2For20);
    $("#more_3_20").html(positiveCount3For20 + '/' + negativeCount3For20);
    
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

function arithmetic1(obj) {
	var lastTrend = (obj.todayDayData.maxPrice / obj.todayDayData.maxTrendPrice - 1) * 100;
	var baseTrend = (obj.tomorrowDayData.todayStart / obj.todayDayData.maxTrendPrice - 1) * 100;
	var todayBase = (obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
	var lastTrend2 = (obj.todayDayData.maxPrice / obj.todayDayData.minPrice - 1) * 100;
	var sellPrice = 0;
	var trend = 0;
	if (baseTrend > 0.9) {
		if (lastTrend > 4 && todayBase > 1) {
			trend = todayBase + lastTrend * todayBase;
		} else {
			trend = baseTrend + lastTrend * lastTrend / 10 - Math.abs(obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
		}
		if (trend > 11) {
			trend = 11;
		}
		if (trend < 1.5) {
			trend = 1.5;
		}
		sellPrice = obj.todayDayData.maxTrendPrice * (1 + trend / 100);
	} else if (baseTrend > 0) {
		trend = (lastTrend2 / 1.6 + todayBase   + lastTrend / 2) - 3;
		if (trend < 1.5) {
			trend = 1.5;
		}
	}
	if (trend < 1.5) {
		trend = 1.5;
	}
	sellPrice = obj.todayDayData.maxTrendPrice * (1 + trend / 100);
	return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function arithmetic2(obj) {
	var lastTrend = (obj.todayDayData.maxPrice/obj.todayDayData.maxTrendPrice  - 1) * 100;
    var baseTrend = (obj.tomorrowDayData.todayStart/obj.todayDayData.maxTrendPrice - 1) * 100;
	var todayBase = (obj.tomorrowDayData.todayStart/obj.todayDayData.todayEnd - 1) * 100;
    var sellPrice = 0;
    var trend = 0;
    if (baseTrend > 0) {
	    trend = todayBase + lastTrend * lastTrend / 10;
	    
	    if (trend < 2) {
	        trend = 2;
	    }
        sellPrice = obj.todayDayData.maxTrendPrice * (1 + trend / 100);
    } else {
    	sellPrice = obj.todayDayData.maxTrendPrice * 1.01;
    }
    return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function arithmetic3(obj) {
//	var lastTrend = (obj.todayDayData.maxPrice / obj.todayDayData.maxTrendPrice - 1) * 100;
//	var baseTrend = (obj.tomorrowDayData.todayStart / obj.todayDayData.maxTrendPrice - 1) * 100;
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
//		sellPrice = obj.todayDayData.maxTrendPrice * (1 + trend / 100);
//	} else if (baseTrend > 0) {
//		trend = (lastTrend2 / 1.6 + todayBase   + lastTrend / 2) - 3;
//		if (trend < 0.5) {
//			trend = 0.3;
//		}
//		sellPrice = obj.todayDayData.maxTrendPrice * (1 + trend / 100);
//	} else {
//		sellPrice = obj.todayDayData.maxTrendPrice;
//	}
	var sellPrice = 0;
	var trend = 0;
	trend = (obj.todayDayData.maxPrice/obj.todayDayData.todayStart - 1) + (obj.tomorrowDayData.todayStart / obj.todayDayData.maxTrendPrice - 1) + 1;
	if (trend < 1.01) {
		trend = 1.01;
	}
	sellPrice = obj.todayDayData.maxTrendPrice * trend;
    return formatNumber((sellPrice).toFixed(2));
}

function isNotNullForJava(obj) {
	return isNotNull(obj) && obj != null;
}

function initSellDayData () {
	if (isNotNull(analises)) {
		sellDay.length = 0;
		for (var i = 0; i < analises.length; i++) {
			if (isNotNull(analises[i].tomorrowDayData)) {
				$.getJSON(analyseUrl + "?shareCode=" + analises[i].todayDayData.shareCode + "&price=" + arithmetic1(analises[i]) + "&baseTime=" + analises[i].todayDayData.updateTime + "&index=" + i + "&callback=?", function(data) {
					data = data[0];
			        if (data.success && isNotNullForJava(data.result.dayData)) {
			        	sellDay[data.result.index] = data.result.dayData;
			        	//analises[data.result.index].tomorrowDayData = data.result.dayData;
			        }
				});
			}
		}
	}
}