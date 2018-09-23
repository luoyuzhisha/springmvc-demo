var php_server = 'http://www.luoyuzhisha.com/shares-gradle/index.php/Information/setInformation';
var java_server = 'http://localhost:8080/shares-gradle/auto/information.do';
var post_server = 'http://www.luoyuzhisha.com/shares-gradle/postInfo.html';

var successCount = 0;
var errorCount = 0;
var strAttr = "";
var nowKey = "3636";
var nowValue = "";

$(function() {
	getInfo();
	sendInfo();
});

function getInfo() {
	/*$.ajax({
		type : "GET",
		url : java_server,
		dataType : "json",
		success : function(data) {
			if (data.success) {
				strAttr = "key=" + data.result.key + "&returnValue="
						+ data.result.returnValue + "&date=" + new Date();
				nowKey = data.result.key;
				nowValue = data.result.returnValue;
			} else {
				addError(data.result);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			addError(errorThrown);
		}
	});*/
    $.get(java_server, function(data) {
        if (data.success) {
            strAttr = "key=" + data.result.key + "&returnValue="
                    + data.result.returnValue + "&date=" + new Date();
            nowKey = data.result.key;
            nowValue = data.result.returnValue;
        } else {
            addError(data.result);
        }
    });
	setTimeout('getInfo()', 5000);
}

function sendInfo() {
	if (strAttr.length > 0) {
		$.ajax({
			type : "POST",
			url : php_server,
			data : strAttr,
			dataType : "json",
			success : function(data) {
				if (data.success) {
					addSuccess();
				} else {
					addError(data.msg);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status > 0) {
					addError(XMLHttpRequest.status + " " + textStatus + " "
							+ errorThrown);
				} else {
					addSuccess();
				}
			}
		});
	}
	setTimeout('sendInfo()', 5000);
}

function addSuccess() {
    if (successCount > 800) {
        window.location.reload();
    } else {
        successCount = successCount + 1;
        $("#successCount").html(successCount);
    }
}

function addError(msg) {
	errorCount = errorCount + 1;
	$("#errorCount").html(errorCount);
	$("#errorMsg").html(msg);
}

function postByIframe () {
	$("#postIframe").attr("src", post_server);
	if (strAttr.length > 0) {
		var postBody = $(document.getElementById('iframe的ID').contentWindow.document.body);
		postBody.find("#key").val(nowKey);
		postBody.find("#returnValue").val(nowValue);
		
		window.location.reload();
	} else {
		setTimeout('postByIframe()', 5000);
	}
	
}

