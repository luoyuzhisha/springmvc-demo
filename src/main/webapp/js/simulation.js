// JavaScript Document
var serviceData = null;
var thisInformationUrl = "/shares-gradle/simulation/information.do";
var autoStartUrl = "/shares-gradle/simulation/start.do";
var autoStopUrl = "/shares-gradle/simulation/stop.do";
var hadSet = false;
var nullDivStr = '<div class="height-40">无</div>';
var orgBuyNum = 0;/* 每次刷新前，当日购买的股票数量 */
var canInit = false;

//node函数定义
$(function(){
    $("#closeErrorMoal").click(function() {
        canShowErrorModal = false;
        hideErrorModal();
    });
    
    $("#sys_start_btn").click(function() {
        $("#sys_start_btn").hide();
        $.ajax({
            type : "GET",
            url : autoStartUrl + "?date=" + new Date(),
            dataType : "json",
            success : function(data) {
                if (data.success) {
                    $("#sys_stop_btn").show();
                } else {
                    showErrorModal("启动错误:" + data.result);
                }
            }
        });
    });
    
    $("#sys_stop_btn").click(function() {
        $("#sys_stop_btn").hide();
        $.ajax({
            type : "GET",
            url : autoStopUrl + "?date=" + new Date(),
            dataType : "json",
            success : function(data) {
                if (data.success) {
                    $("#sys_start_btn").show();
                } else {
                    showErrorModal("停止错误:" + data.result);
                }
            }
        });
    });
    
    $("#sys_start_btn").hide();
    $("#sys_stop_btn").hide();
});

// 函数调用
$(function(){
    settime();
    updateInfo();
    setInterval("settime()", 1000);
    setInterval("updateInfo()", 1000);
});
// 更新当前时间
function settime (){
    $("#title_time").html(getTimeStr(new Date()));
}
//获取java时间戳代表的时间
function getTimeStrFormJava(javaTime) {
    if (!isNotNullForJava(javaTime)) {
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
//获取java时间戳代表的时间
function getShortTimeStrFormJava(javaTime) {
    if (!isNotNullForJava(javaTime)) {
        return "";
    }
    var jsTime = Number(javaTime);
    var updateTime = new Date(jsTime);
    var updateTimeStr = getShortTimeStr(updateTime);
    return updateTimeStr;
}
// 不要直接调用
function getShortTimeStr(mydate) {
    var myyear,mymonth,myweek,myday,mytime,mymin,myhour,mysec;
    mymonth=addZero(mydate.getMonth() + 1);
    myday=addZero(mydate.getDate());
    myhour=addZero(mydate.getHours());
    mymin=addZero(mydate.getMinutes());
    mysec=addZero(mydate.getSeconds());
    mytime= mymonth+"-"+myday+" "+myhour+":"+mymin+":"+mysec;
    return mytime;
}
function initShareModal() {
    var divs = $("#show_share_modal .modal-dialog .modal-body div");
    divs.find("span").html("");
    divs.hide();
}
function initDealModal() {
    var divs = $("#deal_share_modal .modal-dialog .modal-body div");
    divs.find("span").html("");
}
function showErrorModal(content) {
    var errorModal = $("#error_modal");
    errorModal.find("#error_content .error-mgs").html(content);
    if (errorModal.is(":hidden") && canShowErrorModal) {
        errorModal.modal('show');
    }
}
function hideErrorModal() {
    var errorModal = $("#error_modal");
    errorModal.find("#error_content .error-mgs").html("");
    errorModal.modal('hide');
}

function showMsgModal(content) {
    var errorModal = $("#msg_modal");
    errorModal.find("#msg_modal .msg-mgs").html(content);
    if (errorModal.is(":hidden")) {
        errorModal.modal('show');
    }
    setTimeout("hideMsgModal()", 2000);
}
function hideMsgModal() {
    var errorModal = $("#msg_modal");
    errorModal.find("#msg_modal .msg-mgs").html("");
    errorModal.modal('hide');
}

// 设置share弹窗的属性，会自动显示该行
function setShareModal(rule, val) {
    var div = $("#show_share_modal .modal-dialog .modal-body").find(rule);
    if (isNotNull(div)) {
        div.show();
        div.find("span").html(val);
    }
}
// 判空
function isNotNull (obj) {
    return typeof(obj) != "undefined" && obj != "null" && obj!= "";
}
// 判空
function isNotNullForJava (obj) {
    return isNotNull(obj) && obj != null;
}
// 判断股票代码格式
function isShareCode(str)
{
    var patrn=/^[0-9]{6}$/;
    if (!patrn.exec(str)) {
        return false;
    } else {
        return true ;
    }
}
function setColor(div, isUp) {
    if (isUp) {
        $(div).addClass("shares_up");
        $(div).removeClass("shares_down");
    } else {
        $(div).addClass("shares_down");
        $(div).removeClass("shares_up");
    }
}
function updateInfo() {
    $.ajax({
        type: "GET",
        url: thisInformationUrl + "?date=" + new Date(),
        dataType: "json",
        success: function(data){
        	if (!data.success) {
        		$("#sys_status").html("停止运行");
        		$("#sys_start_btn").show();
        		$("#sys_stop_btn").hide();
        		initInfo();
        	} else {
        		data = data.result;
        		if (data.ruining) {
        			$("#sys_status").html("正在运行");
        			$("#sys_start_btn").hide();
        			$("#sys_stop_btn").show();
        			serviceData = data;
        			$("#sart_date").html(getTimeStrFormJava(data.startTime));
        			$("#now_date").html(getTimeStrFormJava(data.nowTime));
        			$("#end_date").html(getTimeStrFormJava(data.endTime));
        			
        			$("#total_data_num").html(data.totalPrimaryDataNum);
        			$("#handle_data_num").html(data.handlePrimaryDataNum);
        			var handlePer = data.handlePrimaryDataNum / data.totalPrimaryDataNum * 100;
        			setProgress("handle_progress", handlePer.toFixed(2));
        			
        			$("#used_time").html(getLeftTimeStr(data.usedTime));
        			$("#remain_time").html(getLeftTimeStr(data.remainTime));
        			$("#predict_end_time").html(getTimeStrFormJava(data.predictEndTime));
        			
        			if (isNotNullForJava(data.totalThreadNum)) {
        				$("#total_thread_num").html(data.totalThreadNum);
        			}
        			if (isNotNullForJava(data.runingThreadNum)) {
        				$("#runing_thread_num").html(data.runingThreadNum);
        			}
        			
        			var systemInfor = data.systemInfor;
        			// CPU使用率
        			setProgress("cup_progress", (systemInfor.cpuRatio*100).toFixed(2), true);
        			// 内存使用率
        			var memoryPer = (systemInfor.totalMemory - systemInfor.actFreeMemory) / systemInfor.totalMemory * 100;
        			setProgress("memory_progress", memoryPer.toFixed(2), true);
        			var nowFixedMoney = 0;
        			// 购买的股票
        			var totalBuys = data.buys;
        			if (isNotNullForJava(totalBuys)) {
                        var totalBuysStr = "";
                        for (var i = 0; i < totalBuys.length && i < 10; i++) {
                            totalBuysStr += '<div class="height-40';
                            if (totalBuys[i].buy.profit.toFixed(2) > 0) {
                                totalBuysStr += ' shares_up';
                            } else {
                                totalBuysStr += ' shares_down';
                            }
                            totalBuysStr += ' share_item" shareIndex="' + i + '" id="total_buy_' + i + '">';
                            totalBuysStr += '<div class="col-xs-2 col-sm-2" title="' + totalBuys[i].buy.shareName + '">' + totalBuys[i].buy.shareCode + '</div>';
                            totalBuysStr += '<div class="col-xs-8 col-sm-8">' + getShortTimeStrFormJava(totalBuys[i].buy.buyTime);
                            if (isNotNullForJava(totalBuys[i].todayData)) {
                            	totalBuysStr += ' <span class="yellow">' + totalBuys[i].buy.buyPrice.toFixed(2) + '(' + totalBuys[i].todayData.todayEnd.toFixed(2) + 'x' + totalBuys[i].buy.buyNum + ')</span>';
                            } else {
                            	totalBuysStr += ' <span class="yellow">' +totalBuys[i].buy.buyPrice.toFixed(2) + '(' + totalBuys[i].buy.buyNum + ')</span>';
                            }
                            totalBuysStr += totalBuys[i].buy.profit.toFixed(2) + '</div>';
                            if (totalBuys[i].preSellPrice < (totalBuys[i].buy.buyPrice * 1.01)) {
                                totalBuysStr += '<div class="col-xs-1 col-sm-1 blueBreathe" title="预警：预售价格低于购买价格"></div>';
                            } else {
                                totalBuysStr += '<div class="col-xs-1 col-sm-1"></div>';
                            }
                            if (isNotNullForJava(totalBuys[i].todayData) && isNotNullForJava(totalBuys[i].buyDayData) && totalBuys[i].todayData.todayStart < totalBuys[i].buyDayData.minPrice) {
                                totalBuysStr += '<div class="col-xs-1 col-sm-1 redBreathe" title="预警：今日开盘价低于购买日最低价"></div></div>';
                            } else {
                                totalBuysStr += '<div class="col-xs-1 col-sm-1"></div></div>';
                            }
                            if (isNotNullForJava(totalBuys[i].todayData)) {
                                nowFixedMoney += (totalBuys[i].todayData.todayEnd * totalBuys[i].buy.buyNum);
                            }
                            
                        }
                        $("#buys").html(totalBuysStr);
                    } else {
                        $("#buys").html(nullDivStr);
                    }
        			// 卖出的股票
        			var totalSells = data.totalSells;
        			if (isNotNullForJava(totalSells)) {
                        var totalSellStr = "";
                        for (var i = 0; i < totalSells.length; i++) {
                        	totalSellStr += '<div class="height-40';
                        	if (totalSells[i].profit.toFixed(2) > 0) {
                        		totalSellStr += ' shares_up';
                            } else {
                            	totalSellStr += ' shares_down';
                            }
                        	totalSellStr += ' shares_up share_item" shareIndex="' + i + '" id="total_sells_' + i + '">';
                        	totalSellStr += '<div class="col-xs-2 col-sm-2" title="' + totalSells[i].shareName + '">' + totalSells[i].shareCode + '</div>';
                        	totalSellStr += '<div class="col-xs-10 col-sm-10">' + getShortTimeStrFormJava(totalSells[i].buyTime);
                        	totalSellStr += ' <span class="yellow">' +totalSells[i].buyPrice.toFixed(2) + '(' + totalSells[i].buyNum + ')</span>';
                        	totalSellStr += '&#9;' + getShortTimeStrFormJava(totalSells[i].sellTime);
                        	totalSellStr += ' <span class="yellow">' + totalSells[i].sellPrice.toFixed(2) +'</span>';
                        	totalSellStr += '&#9;' + totalSells[i].profit.toFixed(2);
                        	totalSellStr += '</div>';
                            if (isNotNullForJava(totalSells[i].todayData)) {
                                nowFixedMoney += (totalSells[i].todayData.todayEnd * totalSells[i].buyNum);
                            }
                        }
                        $("#totalSells").html(totalSellStr);
                    } else {
                        $("#totalSells").html(nullDivStr);
                    }
        			// 资金情况
        			if (isNotNullForJava(data.maxRate)) {
        				$("#max_rate span").html(data.maxRate.toFixed(2));
        			} else {
        				$("#max_rate span").html("0.0")
        			}
        			if (isNotNullForJava(data.minRate)) {
        				$("#min_rate span").html(data.minRate.toFixed(2));
        			} else {
        				$("#min_rate span").html("0.0")
        			}
        			if (isNotNullForJava(data.avgRate)) {
        				$("#avg_rate span").html(data.avgRate.toFixed(2));
        			} else {
        				$("#avg_rate span").html("0.0")
        			}
        			if (isNotNullForJava(data.activeRate)) {
        				$("#active_rate span").html(data.activeRate.toFixed(2));
        			} else {
        				$("#active_rate span").html("0.0")
        			}
        		} else {
        			$("#sys_status").html("停止运行");
        			initInfo();
        		}
        	}
        }
    });
}

function addZero(str) {
    str = str.toString();
    if (str.length == 1) {
        str = '0' + str;
    }
    return str;
}

function setProgress(nodeId, per, changeColor) {
    var thisNode = $("#" + nodeId);
    thisNode.attr("aria-valuenow", per);
    thisNode.width(per + "%");
    $("#" + nodeId + " > span").html(per);
    if (changeColor) {
        if (per < 60) {
            thisNode.removeClass("progress-bar-warning progress-bar-danger");
            thisNode.addClass("progress-bar-success");
        } else if (per < 90) {
            thisNode.removeClass("progress-bar-success progress-bar-danger");
            thisNode.addClass("progress-bar-warning");
        } else {
            thisNode.removeClass("progress-bar-warning progress-bar-success");
            thisNode.addClass("progress-bar-danger");
        }
    }
}
function breakWord(str) {
    if  (typeof str == "string") {
        var length = str.length;
        if (length > 28) {
            str = "..." + str.substr(-25);
        }
    } else {
        str = "";
    }
    return str;
}

function setInitStatus(pre) {
    $("#init_status").width(pre + "%");
    $("#init_status").attr("data-transitiongoal-backup", pre);
    $("#init_status").attr("data-transitiongoal", pre);
    $("#init_status").attr("aria-valuenow", pre);
    $("#init_status span").html(pre);
}

Number.prototype.toFixed = function (exponent) {
    var roundNum = 0.5;
    if (this < 0) {
        roundNum = -0.5;
    }
    var returnValue =  parseInt(this * Math.pow(10, exponent) + roundNum) / Math.pow(10, exponent) + "";
    if (exponent > 0) {
        var dotIndex = returnValue.indexOf(".");
        if (dotIndex == -1) {
            returnValue = returnValue + ".";
            dotIndex = returnValue.length - 1;
        }
        var diff = returnValue.length - 1 - dotIndex;
        if (diff < exponent) {
            for (; diff < exponent; diff++) {
                returnValue = returnValue + "0";
            }
        }
    }
    return returnValue;
}

function getLeftTimeStr(time) {
	var ts = time;
	var returnValue = "";
    var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数  
    var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数  
    var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数  
    var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数  
    dd = addZero(dd);  
    hh = addZero(hh);  
    mm = addZero(mm);  
    ss = addZero(ss);
    returnValue = ss + "秒" + returnValue;
    if (mm != "00") {
    	returnValue = mm + "分" + returnValue;
    }
    if (hh != "00") {
    	returnValue = hh + "时" + returnValue;
    }
    if (dd != "00") {
    	returnValue = dd + "天" + returnValue;
    }
    return returnValue; 
}

function initInfo() {
	setProgress("handle_progress", 0.0);
	$("#remain_time").html("");
	$("#predict_end_time").html("");
	$("#sys_start_btn").show();
	$("#sys_stop_btn").hide();
}
