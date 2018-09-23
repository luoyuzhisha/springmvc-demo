// JavaScript Document
var serviceData = null;
var thisInformationUrl = "/shares-gradle/auto/informationForSelf.do";
var buyShareUrl = "/shares-gradle/auto/buy.do";
var sellShareUrl = "/shares-gradle/auto/sell.do";
var flashUrl = 'http://finance.sina.com.cn/flash/cn.swf?';
var autoStartUrl = "/shares-gradle/auto/getPrimaryData.do";
var autoStopUrl = "/shares-gradle/auto/stop.do";
var initSharesUrl = "/shares-gradle/init/initShares.do";
var getInitStatusUrl = "/shares-gradle/init/getInitSharesStatus.do";
var rebackShellUrl = '/shares-gradle/auto/rebackSell.do';
var rebackBuyUrl = '/shares-gradle/auto/rebackBuy.do';
var initMoneyUrl = '/shares-gradle/init/initMoney.do';
var addMoneyUrl = '/shares-gradle/init/modifyMoney.do';
var initTimer = null;
var oldExceptionNum = 0;
var excetionErrorNum = 0;
var canShowErrorModal = true;
var hadSet = false;
var nullDivStr = '<div class="height-40">无</div>';
var orgBuyNum = 0;/* 每次刷新前，当日购买的股票数量 */
var canInit = false;

//node函数定义
$(function(){
    // 今日最好的股票点击事件
    $("#today_best").delegate(".share_item", "click", function(){
        var thisItem = $(this);
        var index = thisItem.attr("shareIndex")
        if (isNotNull(index)) {
            var data = serviceData.bestShares[index];
            if (isNotNull(data)) {
                // 置空所有显示
                initShareModal();
                setShareModal("#show_share_mode_share_code", data.dayData.shareCode);
                setShareModal("#show_share_mode_share_name", data.shareName);
                setShareModal("#show_share_mode_now_price", data.dayData.todayEnd.toFixed(2));
                setShareModal("#show_share_mode_trend", data.dayData.trend.toFixed(2));
                setShareModal("#show_share_mode_flash", buildFlashObject(data.dayData.shareCode));
                if (data.dayData.trend > 0) {
                    setColor($("#show_share_modal"), true);
                } else {
                    setColor($("#show_share_modal"), false);
                }
            }
        }
        $('#show_share_modal').modal('show');
    });
    // 今日购买点击事件
    $("#today_buy").delegate(".share_item", "click", function(){
        var thisItem = $(this);
        var index = thisItem.attr("shareIndex")
        if (isNotNull(index)) {
            var data = serviceData.todayBuy[index];
            if (isNotNull(data)) {
                // 置空所有显示
                initShareModal();
                setShareModal("#show_share_mode_share_code", data.shareCode);
                setShareModal("#show_share_mode_share_name", data.shareName);
                setShareModal("#show_share_mode_buy_time", getTimeStrFormJava(data.buyTime));
                setShareModal("#show_share_mode_buy_price", data.buyPrice.toFixed(2));
                setShareModal("#show_share_mode_buy_cout", data.buyNum);
                setShareModal("#show_share_mode_buy_cost", (Number(data.buyNum) * Number(data.buyPrice)).toFixed(2));
                setShareModal("#show_share_mode_trend", data.profit.toFixed(2));
                setShareModal("#show_share_mode_flash", buildFlashObject(data.shareCode));
                if (data.profit > 0) {
                    setColor($("#show_share_modal"), true);
                } else {
                    setColor($("#show_share_modal"), false);
                }
            }
        }
        $('#show_share_modal').modal('show');
    });
    // 今日卖出点击事件
    $("#today_sell").delegate(".share_item", "click", function(){
        var thisItem = $(this);
        var index = thisItem.attr("shareIndex")
        if (isNotNull(index)) {
            var data = serviceData.todaySell[index];
            if (isNotNull(data)) {
                // 置空所有显示
                initShareModal();
                setShareModal("#show_share_mode_share_code", data.shareCode);
                setShareModal("#show_share_mode_share_name", data.shareName);
                setShareModal("#show_share_mode_buy_time", getTimeStrFormJava(data.buyTime));
                setShareModal("#show_share_mode_buy_price", data.buyPrice.toFixed(2));
                setShareModal("#show_share_mode_buy_cout", data.buyNum);
                setShareModal("#show_share_mode_buy_cost", (Number(data.buyNum) * Number(data.buyPrice)).toFixed(2));
                setShareModal("#show_share_mode_sell_time", getTimeStrFormJava(data.sellTime));
                setShareModal("#show_share_mode_sell_price", data.sellPrice.toFixed(2));
                setShareModal("#show_share_mode_trend", ((Number(data.sellPrice) - Number(data.buyPrice)) / Number(data.buyPrice) * 100).toFixed(2));
                setShareModal("#show_share_mode_profix", data.profit.toFixed(2));
                setShareModal("#show_share_mode_flash", buildFlashObject(data.shareCode));
                if (data.profit > 0) {
                    setColor($("#show_share_modal"), true);
                } else {
                    setColor($("#show_share_modal"), false);
                }
            }
        }
        $('#show_share_modal').modal('show');
    });
    // 昨日购买点击事件
    $("#yesterday_buy").delegate(".share_item", "click", function(){
        var thisItem = $(this);
        var index = thisItem.attr("shareIndex")
        if (isNotNull(index)) {
            var data = serviceData.yesterdayBuy[index];
            if (isNotNull(data)) {
                // 置空所有显示
                initShareModal();
                setShareModal("#show_share_mode_share_code", data.shareCode);
                setShareModal("#show_share_mode_share_name", data.shareName);
                setShareModal("#show_share_mode_buy_time", getTimeStrFormJava(data.buyTime));
                setShareModal("#show_share_mode_buy_price", data.buyPrice.toFixed(2));
                setShareModal("#show_share_mode_buy_cout", data.buyNum);
                setShareModal("#show_share_mode_buy_cost", (Number(data.buyNum) * Number(data.buyPrice)).toFixed(2));
                setShareModal("#show_share_mode_trend", data.profit.toFixed(2));
                setShareModal("#show_share_mode_flash", buildFlashObject(data.shareCode));
                if (data.profit > 0) {
                    setColor($("#show_share_modal"), true);
                } else {
                    setColor($("#show_share_modal"), false);
                }
            }
        }
        $('#show_share_modal').modal('show');
    });
    // 所有持仓点击事件
    $("#total_buy").delegate(".share_item", "click", function(){
        var thisItem = $(this);
        var index = thisItem.attr("shareIndex")
        if (isNotNull(index)) {
            var data = serviceData.totalBuy[index];
            if (isNotNull(data)) {
                // 置空所有显示
                initShareModal();
                setShareModal("#show_share_mode_share_code", data.buy.shareCode);
                setShareModal("#show_share_mode_share_name", data.buy.shareName);
                setShareModal("#show_share_mode_buy_time", getTimeStrFormJava(data.buy.buyTime));
                setShareModal("#show_share_mode_buy_price", data.buy.buyPrice.toFixed(2));
                setShareModal("#show_share_mode_buy_cout", data.buy.buyNum);
                setShareModal("#show_share_mode_buy_cost", (Number(data.buy.buyNum) * Number(data.buy.buyPrice)).toFixed(2));
                setShareModal("#show_share_mode_trend", data.buy.profit.toFixed(2));
                setShareModal("#show_share_mode_pre_sell_price", data.preSellPrice.toFixed(2));
                var preGrowing = ((Number(data.preSellPrice / data.buy.buyPrice) - 1) * 100).toFixed(2);
                setShareModal("#show_share_mode_pre_trend", preGrowing);
                setShareModal("#show_share_mode_flash", buildFlashObject(data.buy.shareCode));
                if (data.profit > 0) {
                    setColor($("#show_share_modal"), true);
                } else {
                    setColor($("#show_share_modal"), false);
                }
            }
        }
        $('#show_share_modal').modal('show');
    });
    // 购买股票
    $("#sys_buy_share_button").click(function(){
        var shareCode = $("#sys_buy_share_code").val();
        var buyPrice = $("#sys_buy_price").val();
        var buyNum = $("#sys_buy_num");
        initDealModal();
        if (isShareCode(shareCode)) {
            $.getJSON(buyShareUrl + "?shareCode=" + shareCode + '&price=' + buyPrice + "&num=" + buyNum + "&callback=?", function(data) {
                data = data[0];
                setColor($("#deal_share_modal"), !data.success);
                $("#deal_share_mode_share_code").find("span").html(shareCode);
                $("#deal_share_mode_order").find("span").html('购买');
                $("#deal_share_mode_result").find("span").html(data.result);
                $("#sys_buy_share_code").val("");
                $("#sys_buy_price").val("");
                $("#order_result").html(data.result);
            });
        } else {
            setColor($("#deal_share_modal"), true);
            $("#deal_share_mode_share_code").find("span").html(shareCode);
            $("#deal_share_mode_order").find("span").html('购买');
            $("#deal_share_mode_result").find("span").html('股票代码错误');
        }
        $('#deal_share_modal').modal('show');
    });
    // 卖出购票
    $("#sys_sell_share_button").click(function(){
        var shareCode = $("#sys_sell_share_code").val();
        var sellPrice = $("#sys_sell_price").val();
        initDealModal();
        if (isShareCode(shareCode)) {
            $.getJSON(sellShareUrl + "?shareCode=" + shareCode + '&price=' + sellPrice + "&callback=?", function(data) {
                data = data[0];
                setColor($("#deal_share_modal"), !data.success);
                $("#deal_share_mode_share_code").find("span").html(shareCode);
                $("#deal_share_mode_order").find("span").html('卖出');
                $("#deal_share_mode_result").find("span").html(data.result);
                $("#sys_sell_share_code").val("");
                $("#sys_sell_price").val("");
                $("#order_result").html(data.result);
            });
        } else {
            setColor($("#deal_share_modal"), true);
            $("#deal_share_mode_share_code").find("span").html(shareCode);
            $("#deal_share_mode_order").find("span").html('卖出');
            $("#deal_share_mode_result").find("span").html('股票代码错误');
        }
        $('#deal_share_modal').modal('show');
    });

    $("#update_time_str").click(function() {
        mySet("");
    });

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
    
    $("#sys_init_btn").click(function() {
        $("#sys_init_btn").hide();
        $.ajax({
            type : "GET",
            url : initSharesUrl + "?date=" + new Date(),
            dataType : "json",
            success : function(data) {
                if (data.success) {
                    $("#init_status_div").show();
                    initTimer = setInterval("getInitStatus()", 1000);
                } else {
                    showErrorModal("初始化错误:" + data.result);
                }
            }
        });
    });
    
    // 回退购买
    $("#sys_reback_buy_share_button").click(function() {
    	var shareCode= $("#sys_reback_buy_share_code").val();
    	if (isNotNull(shareCode)) {
    		$.getJSON(rebackBuyUrl + "?shareCode=" + shareCode + "&callback=?", function(data) {
                data = data[0];
                showMsgModal(data.result)
            });
    	}
    });
    // 回退卖出
    $("#sys_reback_sell_share_button").click(function() {
    	var shareCode= $("#sys_reback_sell_share_code").val();
    	if (isNotNull(shareCode)) {
    		$.getJSON(rebackShellUrl + "?shareCode=" + shareCode + "&callback=?", function(data) {
                data = data[0];
                showMsgModal(data.result)
            });
    	}
    });
    // 重置金钱
    $("#sys_init_money_button").click(function() {
    	var initMoney= $("#sys_init_money").val();
    	if (isNotNull(initMoney)) {
    		$.getJSON(initMoneyUrl + "?initMoney=" + initMoney + "&callback=?", function(data) {
                data = data[0];
                showMsgModal(data.result)
            });
    	}
    });
    // 充值金钱
    $("#sys_add_money_button").click(function() {
    	var addMoney= $("#sys_add_money").val();
    	if (isNotNull(addMoney)) {
    		$.getJSON(addMoneyUrl + "?addMoney=" + addMoney + "&callback=?", function(data) {
                data = data[0];
                showMsgModal(data.result)
            });
    	}
    });
    
    $("#sys_stop_btn").hide();
    $("#init_status_div").hide();
    
});

// 函数调用
$(function(){
    settime();
    updateInfo();
    setInterval("settime()", 1000);
    setInterval("updateInfo()", 500);
    getInitStatusOnPageInit();
});
// 更新当前时间
function settime (){
    $("#title_time").html(getTimeStr(new Date()));
//    setTimeout('settime()',1000);
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
//获取java时间戳代表的时间
function getShortTimeStrFormJava(javaTime) {
    if (!isNotNull(javaTime)) {
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
function mySet(str) {
    if (hadSet) {
        console.info("已经配对过。");
        return;
    }
    var timeStr = getTimeStr(new Date());
    var dateStr = timeStr.substring(0, 10);
    var value = $.md5('liweilong8' + dateStr);
    $.get('/shares-gradle/index.php/Information/setKey?key=' + value + "&value=" + str, function(data) {
         console.info(data);
    });
    hadSet = true;
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
                data = data.result;
                if (data.runStatus == "Stop") {
            		$("#sys_runType").html("停止运行");
            		$("#sys_start_btn").show();
                    $("#sys_stop_btn").hide();
                    $("#sys_init_btn").show();
                    $("#init_status_div").hide();
            	} else if (data.runStatus == "Initting") {
            		$("#sys_runType").html("初始化中");
            		$("#sys_start_btn").hide();
                    $("#sys_stop_btn").hide();
                    $("#sys_init_btn").hide();
                    $("#init_status_div").show();
                    if (!isNotNullForJava(initTimer)) {
                        getInitStatusOnPageInit();
                    }
            	} else if (data.runStatus == "Runing") {
            		$("#sys_runType").html("运行中");
            		$("#sys_start_btn").hide();
                    $("#sys_stop_btn").show();
                    $("#sys_init_btn").hide();
                    $("#init_status_div").hide();
            	}
                var hideError = true;
                if  (!isNotNullForJava(data)) {
                    hideError = false;
                } else {
                    // 判断当前网络状态
                    if (data.excetionNum - oldExceptionNum > 20) {
                        excetionErrorNum++;
                        if (excetionErrorNum > 3) {
                            showErrorModal("服务器网络故障");
                            oldExceptionNum = data.excetionNum;
                            hideError = hideError && false;
                        }
                    } else {
                        excetionErrorNum = 0;
                    }
                    oldExceptionNum = data.excetionNum;
                }
                if (hideError) {
                    hideErrorModal();
                    serviceData = data;
                    var systemInfor = data.systemInfor;
                    // 系统类型
                    $("#sys_type").html(systemInfor.osName);
                    // 系统版本
                    $("#sys_version").html(systemInfor.version);
                    // CPU使用率
                    setProgress("cup_progress", (systemInfor.cpuRatio*100).toFixed(2));
                    // 内存使用率
                    var memoryPer = (systemInfor.totalMemory - systemInfor.actFreeMemory) / systemInfor.totalMemory * 100;
                    setProgress("memory_progress", memoryPer.toFixed(2));
                    // 剩余硬盘大小
                    if (isNotNullForJava(systemInfor.freeDiskSize)) {
                    	$("#freeDisk").html(systemInfor.freeDiskSize);
                    }
                    // 当前项目线程数
                    $("#thread_count").html(data.threadNum);
                    $("#save_primary_data_count").html(data.waitSavePrimaryDataNum);
                    // 运行模式
                    if (isNotNullForJava(data.runningType)) {
                        $("#running_type").html(data.runningType);
                    }
                    // 运行模式
                    if (isNotNullForJava(data.buyTrend)) {
                        $("#buy_trend").html(data.buyTrend);
                    }
                    // 最新异常
                    var newExceptions = data.newExceptions;
                    if (isNotNullForJava(newExceptions)) {
                        var newExceptionsStr = "";
                        for (var i = 0; i < newExceptions.length; i++) {
                            newExceptionsStr += '<div><span class="long-break">' + breakWord(newExceptions[i].type) + "</span><span>" + getTimeStrFormJava(newExceptions[i].addTime) + "</span></div>";
                        }
                        $("#new_exceptions").html(newExceptionsStr);
                    } else {
                        $("#new_exceptions").html("无");
                    }
                    // 最多异常
                    var mostExcetions = data.mostExcetions;
                    if (mostExcetions != null && mostExcetions != "") {
                        var mostExcetionsStr = "";
                        for (var i = 0; i < mostExcetions.length; i++) {
                            mostExcetionsStr += '<div class="long-break">' +  breakWord(mostExcetions[i].type) + "</div>";
                        }
                        $("#most_exceptions").html(mostExcetionsStr);
                    } else {
                        $("#most_exceptions").html("无");
                    }
                    // 最多异常线程
                    var exceptionThread = data.exceptionThread;
                    if (isNotNullForJava(exceptionThread)) {
                        var exceptionThreadStr = "";
                        for (var i = 0; i < exceptionThread.length; i++) {
                            exceptionThreadStr += '<div class="long-break">' + (exceptionThread[i].type) + " " + exceptionThread[i].count + "</br >";
                        }
                        $("#exception_thread").html(exceptionThreadStr);
                    } else {
                        $("#exception_thread").html("无");
                    }
                    // 异常数量
                    var excetionNum = data.excetionNum;
                    $("#exception_count").html(excetionNum);
                    
                    // 值得购买的股票
                    var bestShares = data.bestShares;
                    if (isNotNullForJava(bestShares)) {
                        var bestSharesStr = "";
                        for (var i = 0; i < bestShares.length; i++) {
                            bestSharesStr += '<div class="height-40 shares_up share_item" shareIndex="' + i + '" id="best_share_"' + i + '><div class="col-xs-2 col-sm-2" title="' + bestShares[i].dayData.shareName + '">' + bestShares[i].dayData.shareCode;
                            bestSharesStr += '</div><div class="col-xs-10 col-sm-10">' + bestShares[i].dayData.todayEnd.toFixed(2) + ' <span class="yellow">' +bestShares[i].dayData.trend.toFixed(2);
                            bestSharesStr += '</span></div></div>'
                        }
                        $("#today_best").html(bestSharesStr);
                        $("#best_shares_hold_time").html(getLeftTimeStr(data.bestSharesHoldTime));
                    } else {
                        $("#today_best").html(nullDivStr);
                    }
                    var nowFixedMoney = 0;
                    // 今日购买股票
                    var todayBuys = data.todayBuy;
                    if (isNotNullForJava(todayBuys)) {
                        var todayBuysStr = "";
                        for (var i = 0; i < todayBuys.length && i < 10; i++) {
                            todayBuysStr += '<div class="height-40';
                            if (!isNotNullForJava(todayBuys[i].profit)) {
                            	todayBuys[i].profit = 0;
                            }
                            if (todayBuys[i].profit.toFixed(2) > 0) {
                                todayBuysStr += ' shares_up';
                            } else {
                                todayBuysStr += ' shares_down';
                            }
                            todayBuysStr += ' share_item" shareIndex="' + i + '" id="today_buy_' + i + '"><div class="col-xs-2 col-sm-2" title="' + todayBuys[i].shareName + '">' + todayBuys[i].shareCode;
                            todayBuysStr += '</div><div class="col-xs-8 col-sm-8">' + getTimeStrFormJava(todayBuys[i].buyTime) + ' <span class="yellow">' +todayBuys[i].buyPrice.toFixed(2) + '(' + todayBuys[i].buyNum + ')</span>  ' +todayBuys[i].profit.toFixed(2);
                            todayBuysStr += '</div><div class="col-xs-1 col-sm-1"></div><div class="col-xs-1 col-sm-1"></div></div>';
                            nowFixedMoney += (todayBuys[i].buyPrice * todayBuys[i].buyNum * (1 + todayBuys[i].profit / 100));
                        }
                        $("#today_buy").html(todayBuysStr);
                    } else {
                        $("#today_buy").html(nullDivStr);
                    }
                    // 今日卖出
                    var todaySells = data.todaySell;
                    if (isNotNullForJava(todaySells)) {
                        var todaySellsStr = "";
                        for (var i = 0; i < todaySells.length && i < 10; i++) {
                            todaySellsStr += '<div class="height-40';
                            if (todaySells[i].profit.toFixed(2) > 0) {
                                todaySellsStr += ' shares_up';
                            } else {
                                todaySellsStr += ' shares_down';
                            }
                            todaySellsStr += ' share_item" shareIndex="' + i + '" id="today_sell_' + i + '"><div class="col-xs-2 col-sm-2" title="' + todaySells[i].shareName + '">' + todaySells[i].shareCode;
                            todaySellsStr += '</div><div class="col-xs-10 col-sm-10">' + getTimeStrFormJava(todaySells[i].sellTime) + ' <span class="yellow">' +todaySells[i].sellPrice.toFixed(2) + '(' + todaySells[i].buyNum + ')</span>  ' +todaySells[i].profit.toFixed(2);
                            todaySellsStr += '</div></div>';
                        }
                        $("#today_sell").html(todaySellsStr);
                    } else {
                        $("#today_sell").html(nullDivStr);
                    }
                    // 昨日购买

                    // 所持股票
                    var totalBuys = data.totalBuy;
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
                        $("#total_buy").html(totalBuysStr);
                    } else {
                        $("#total_buy").html(nullDivStr);
                    }
                    // 资金情况 总收益
                    var allProfit = data.allProfit;
                    if (isNotNullForJava(allProfit)) {
                        $("#start_money").html(allProfit.initMoney.value.toFixed(2));
                        var allMoney = Number(allProfit.fixedMoney.value) + Number(allProfit.freeMoney.value);
                        var nowAllMoney = Number(allProfit.freeMoney.value) + nowFixedMoney;
                        $("#all_money").html(allMoney.toFixed(2) + "(" + nowAllMoney.toFixed(2) + ")");
                        $("#floating_money").html(allProfit.freeMoney.value.toFixed(2));
                        var growing = ((allMoney / Number(allProfit.initMoney.value) - 1) * 100).toFixed(2);
                        var nowGrowing = ((nowAllMoney / Number(allProfit.initMoney.value) - 1) * 100).toFixed(2);
                        $("#all_growing span").html(growing + "%(" + nowGrowing + "%)");
                    } else {
                        $("#start_money").html(0.0);
                        $("#all_money").html(0.0);
                        $("#floating_money").html(0.0);
                        $("#all_growing span").html(0.0);
                    }
                    // 更新时间
                    if (isNotNullForJava(data.updateTime) && data.updateTime > 0) {
                        var updateTimeStr = getTimeStrFormJava(data.updateTime);
                        $("#update_time").html(updateTimeStr);
                    } else {
                        $("#update_time").html("无");
                    }

                    // 判断是否有新购买的股票
                    if (isNotNullForJava(todayBuys)) {
                        if (todayBuys.length > orgBuyNum) {
                            var lastIndex = todayBuys.length;
                            autoClickAndClose("#today_buy_" + lastIndex);
                        }
                        orgBuyNum = todayBuys.length;
                    } else {
                        orgBuyNum = 0;
                    }
                }
                    
                    // 打印控制台
                    //console.info("updateTimeErrorNum:" + updateTimeErrorNum + ", excetionErrorNum:" + excetionErrorNum);
                    
                 }
    });
//    setTimeout("updateInfo()", 5000);
}

function addZero(str) {
    str = str.toString();
    if (str.length == 1) {
        str = '0' + str;
    }
    return str;
}

function setProgress(nodeId, per) {
    var thisNode = $("#" + nodeId);
    thisNode.attr("aria-valuenow", per);
    thisNode.width(per + "%");
    $("#" + nodeId + " > span").html(per);
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

function updateOrderResult() {
    $.ajax({
        type: "GET",
        url: getResultUrl + "?date=" + new Date(),
        dataType: "json",
        success: function(data){
            if (isNotNull(data.result)) {
                $("#order_result").html(data.result);
            } else {
                setTimeout("updateOrderResult()", 5000);
            }
        }
    });
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

function buildFlashObject(shareCode) {
    var flashObjectStr = '<object type="application/x-shockwave-flash" data="' + flashUrl + '" width="560" height="490" id="flash" style="visibility: visible;">';
    flashObjectStr += '<param name="allowFullScreen" value="true">';
    flashObjectStr += '<param name="allowScriptAccess" value="always">';
    flashObjectStr += '<param name="wmode" value="transparent">';
    flashObjectStr += '<param name="flashvars" value="symbol=sh' + shareCode + '">';
    flashObjectStr += '</object>';
    return flashObjectStr;
}

function autoClickAndClose(selecter) {
    if ($('#show_share_modal').is(":visible")) {
        $('#show_share_modal').modal('hide');
    }
    if (isNotNull(selecter)) {
        $(selecter).click();
        setTimeout(function(){
            $('#show_share_modal').modal('hide');
        }, 3000);
    }
}

function getInitStatus() {
    $.ajax({
        type : "GET",
        url : getInitStatusUrl + "?date=" + new Date(),
        dataType : "json",
        success : function(data) {
            if (data.success) {
                if (data.result == 1.0) {
                    clearInterval(initTimer);
                    $("#init_status_div").hide();
                    $("#sys_init_btn").show();
                } else {
                    $("#sys_init_btn").hide();
                    var pre = (data.result * 100).toFixed(2);
                    setInitStatus(pre);
                }
            } else {
                showErrorModal("获取初始化进度出错:" + data.result);
            }
        }
    });
}

function setInitStatus(pre) {
    $("#init_status").width(pre + "%");
    $("#init_status").attr("data-transitiongoal-backup", pre);
    $("#init_status").attr("data-transitiongoal", pre);
    $("#init_status").attr("aria-valuenow", pre);
    $("#init_status span").html(pre);
}

function getInitStatusOnPageInit() {
    $.ajax({
        type : "GET",
        url : getInitStatusUrl + "?date=" + new Date(),
        dataType : "json",
        success : function(data) {
            if (data.success) {
                if (data.result == 0) {
                    canInit = true;
                } else {
                    canInit = false;
                    $("#init_status_div").show();
                    initTimer = setInterval("getInitStatus()", 1000);
                }
            } else {
                showErrorModal("获取初始化进度出错:" + data.result);
            }
        }
    });
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
	var append = false;
	var ts = time;
	var returnValue = "";
	var dd = (ts / 1000 / 60 / 60 / 24).toFixed(0);//计算剩余的天数  
    var hh = (ts / 1000 / 60 / 60 % 24).toFixed(0);//计算剩余的小时数  
    var mm = (ts / 1000 / 60 % 60).toFixed(0);//计算剩余的分钟数  
    var ss = (ts / 1000 % 60).toFixed(0);//计算剩余的秒数
    var ms = (ts % 1000).toFixed(0);//计算剩余的毫秒数
    dd = addZero(dd);  
    hh = addZero(hh);  
    mm = addZero(mm);  
    ss = addZero(ss);
    if (dd != "00") {
    	returnValue = dd + "天";
    }
    if (hh != "00" || append) {
    	returnValue += hh + "时";
    }
    if (mm != "00" || append) {
    	returnValue += mm + "分";
    }
    if (ss != "00" || append) {
    	returnValue += ss + "秒";
    }
    if (ms != 0 || append) {
    	returnValue += ms + "毫秒";
    }
    return returnValue; 
}