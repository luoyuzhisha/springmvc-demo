var url = '/shares-gradle/analyse/analyse.do';
var analises;
$(function() {
	$.getJSON(url + "?callback=?", function(data) {
		data = data[0];
		if (data.success) {
			analises = data.result;
			formatTable();
		} else {
			alert("error")
		}
	});
});

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

function formatTable() {
	var size = analises.length;
	var trsStr = '';
	var profit = 0;/* 总收益 */
	var tempProfit = 0;/* 最大收益 */
	var profitFor15 = 0;/* 总收益 */
	var tempProfitFor15 = 0;/* 最大收益 */
	var profitFor20 = 0;/* 总收益 */
	var tempProfitFor20 = 0;/* 最大收益 */
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
	var obj;

	var tempProfitFor3 = 0;
	var tempProfitFor3For15 = 0;
	var tempProfitFor3For20 = 0;

	var positiveCount1For15 = 0;
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

	var chartForResult3ForMax = [];
	var chartForResult3ForResult = [];
	var equesLine = [];
	
	var i = 0;
	for (; i < size; i++) {
		if (isNotNull(analises[i].tomorrowDayData)) {
			var tempBestProfit = (formatNumber(analises[i].tomorrowDayData.maxPrice) / formatNumber(analises[i].buy.buyPrice) - 1) * 100;
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

			arithmeticResult2 = arithmetic2(analises[i]);
			if (arithmeticResult2 < 0) {
				negativeCount2++;
			} else {
				positiveCount2++;
			}

			arithmeticResult3 = arithmetic3(analises[i]);
			if (arithmeticResult3 > analises[i].tomorrowDayData.maxPrice) {
				negativeCount3++;
			} else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice) {
				positiveCount3++;
			}
			if (arithmeticResult3 < analises[i].buy.buyPrice) {
				lostCount++;
				totalDiff += (analises[i].buy.buyPrice - arithmeticResult3);
			}
			tempProfitFor3 += (arithmeticResult3 * 0.99
					/ analises[i].buy.buyPrice - 1) * 100;
			if (i < 15) {
				profitFor15 = profitFor15 + (analises[i].buy.sellPrice * 0.991 - analises[i].buy.buyPrice) * analises[i].buy.buyNum;
				tempProfitFor15 = tempProfitFor15 + (analises[i].tomorrowDayData.maxPrice * 0.991 - analises[i].buy.buyPrice) * analises[i].buy.buyNum;
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

				if (arithmeticResult3 > analises[i].tomorrowDayData.maxPrice) {
					negativeCount3For15++;
				} else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice) {
					positiveCount3For15++;
				}
				tempProfitFor3For15 += (arithmeticResult3 * 0.99 / analises[i].buy.buyPrice - 1) * 100;
				if (arithmeticResult3 < analises[i].buy.buyPrice) {
					lostCountFor15++;
					totalDiffFor15 += (analises[i].buy.buyPrice - arithmeticResult3);
				}
			}
			if (analises.length - i < 20) {
				profitFor20 = profitFor20 + (analises[i].buy.sellPrice * 0.991 - analises[i].buy.buyPrice) * analises[i].buy.buyNum;
				tempProfitFor20 = tempProfitFor20 + (analises[i].tomorrowDayData.maxPrice * 0.991 - analises[i].buy.buyPrice) * analises[i].buy.buyNum;
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
				} else if (arithmeticResult3 < analises[i].tomorrowDayData.maxPrice) {
					positiveCount3For20++;
				}
				tempProfitFor3For20 += (arithmeticResult3 * 0.99 / analises[i].buy.buyPrice - 1) * 100;
			}
			profit = profit + (analises[i].buy.sellPrice * 0.991 - analises[i].buy.buyPrice)* analises[i].buy.buyNum;
			tempProfit = tempProfit + (analises[i].tomorrowDayData.maxPrice * 0.991 - analises[i].buy.buyPrice) * analises[i].buy.buyNum;

			obj = analises[i];
			var lastTrend = (obj.todayDayData.maxPrice / obj.buy.buyPrice - 1) * 100;
			var baseTrend = (obj.tomorrowDayData.todayStart / obj.buy.buyPrice - 1) * 100;
			var todayBase = (obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
			chartForResult3ForMax.push([ formatNumber(baseTrend),
			                             formatNumber(analises[i].tomorrowDayData.maxPrice/analises[i].buy.buyPrice) ]);
			chartForResult3ForResult.push([ formatNumber(baseTrend),
			                                formatNumber(arithmeticResult3/analises[i].buy.buyPrice) ]);
			equesLine.push([formatNumber(baseTrend), 1]);
		}
	}

	$("#td_statistics").html(
			'共盈利' + profit.toFixed(2) + ', 理论可以盈利' + tempProfit.toFixed(2)
					+ ', 盈利比' + totalPositiveCount + '/' + totalNegativeCount
					+ ', 算法3盈利 ' + tempProfitFor3.toFixed(2));
	$("#td_statistics_15").html(
			'最近15次交易共盈利' + profitFor15.toFixed(2) + ', 理论可以盈利'
					+ tempProfitFor15.toFixed(2) + ', 盈利比'
					+ totalPositiveCountFor15 + '/' + totalNegativeCountFor15
					+ ', 算法3盈利 ' + tempProfitFor3For15.toFixed(2));
	$("#td_statistics_20").html(
			'最后20次交易共盈利' + profitFor20.toFixed(2) + ', 理论可以盈利'
					+ tempProfitFor20.toFixed(2) + ', 盈利比'
					+ totalPositiveCountFor20 + '/' + totalNegativeCountFor20
					+ ', 算法3盈利 ' + tempProfitFor3For20.toFixed(2));
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

	if (i % 2 == 1) {
		$("#td_statistics").parents("tr").addClass("backColor");
		$("#td_statistics_15").parents("tr").removeClass("backColor");
		$("#td_statistics_20").parents("tr").addClass("backColor");
	} else {
		$("#td_statistics").parents("tr").removeClass("backColor");
		$("#td_statistics_15").parents("tr").addClass("backColor");
		$("#td_statistics_20").parents("tr").removeClass("backColor");
	}
	chartForResult3ForMax = chartForResult3ForMax.sort(compareData);
	chartForResult3ForResult = chartForResult3ForResult.sort(compareData);
	
	myDrawChart("analyse_1", chartForResult3ForMax);
	myDrawChart("analyse_2", chartForResult3ForResult);
	myDrawChart("analyse_3", chartForResult3ForMax, chartForResult3ForResult, equesLine);

}

function arithmetic1(obj) {
	var lastTrend = (obj.buy.buyPrice / obj.todayDayData.todayStart - 1) * 100;
	var sellPrice = 0;
	if (lastTrend > 5) {
		sellPrice = obj.buy.buyPrice * (1 + lastTrend * 1.667 / 100);
	} else if (lastTrend > 2.5) {
		sellPrice = obj.buy.buyPrice * (1 + lastTrend * 1.333 / 100);
	} else {
		sellPrice = obj.buy.buyPrice * 1.025;
	}
	return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function arithmetic2(obj) {
	var lastTrend = (obj.buy.buyPrice / obj.todayDayData.todayEnd - 1) * 100;
	var sellPrice = 0;
	if (lastTrend > 5) {
		sellPrice = obj.buy.buyPrice * (1 + lastTrend * 1.667 / 100);
	} else if (lastTrend > 2.5) {
		sellPrice = obj.buy.buyPrice * (1 + lastTrend * 1.333 / 100);
	} else {
		sellPrice = obj.buy.buyPrice * 1.025;
	}
	return ((obj.tomorrowDayData.maxPrice / sellPrice - 1) * 100).toFixed(2);
}

function arithmetic3(obj) {
	var lastTrend = (obj.todayDayData.maxPrice / obj.buy.buyPrice - 1) * 100;
	var baseTrend = (obj.tomorrowDayData.todayStart / obj.buy.buyPrice - 1) * 100;
	var todayBase = (obj.tomorrowDayData.todayStart / obj.todayDayData.todayEnd - 1) * 100;
	var lastTrend2 = (obj.todayDayData.maxPrice / obj.todayDayData.minPrice - 1) * 100;
	var sellPrice = 0;
	var trend = 0;
	if (baseTrend > 0.9) {
		if (lastTrend > 4 && todayBase > 1) {
			trend = todayBase + lastTrend * todayBase;
		} else {
			trend = baseTrend
					+ lastTrend
					* lastTrend
					/ 10
					- Math.abs(obj.tomorrowDayData.todayStart
							/ obj.todayDayData.todayEnd - 1) * 100;
		}
		if (trend > 11) {
			trend = 11;
		}

		if (trend < 1.5) {
			trend = 1.5;
		}
		sellPrice = obj.buy.buyPrice * (1 + trend / 100);
	} else if (baseTrend > 0) {
		trend = (lastTrend2 / 1.6 + todayBase   + lastTrend / 2) - 3;
		if (trend < 0.5) {
			trend = 0.3;
		}
		sellPrice = obj.buy.buyPrice * (1 + trend / 100);
	} else {
		sellPrice = obj.buy.buyPrice;
	}
    return formatNumber((sellPrice).toFixed(2));
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


function myDrawChart(id, data1, data2, data3) {
	var datas = [];
	if (isNotNull(data1)) {
		datas.push(data1);
	}
	if (isNotNull(data2)) {
		datas.push(data2);
	}
	if (isNotNull(data3)) {
		datas.push(data3);
	}
	var graph = Flotr.draw(document.getElementById(id), datas, {
		mouse : {
			track : true, // Enable mouse tracking
			lineColor : 'purple',
			relative : true,
			position : 'ne',
			sensibility : 1,
			trackDecimals : 2,
			trackFormatter : function(o) {
				return 'x = ' + o.x + ', y = ' + o.y;
			}
		},
		crosshair : {
			mode : 'xy'
		}
	});
}