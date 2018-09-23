package com.scott.shares.action;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/analyse")
public class AnalyseAction extends BaseAction {

    @RequestMapping(value = "/getDatDataCumb.do")
    @ResponseBody
    public void getDayDataCumb(String shareCode, String callback, HttpServletResponse response) {
       /* DayDataCumb result = PrimaryDataDaemonThread.getDataCumb(shareCode);
        if (result != null) {
            responseJson(response, getJson(result), callback, true);
        } else {
            String returnValue = "股票不存在";
            responseJson(response, returnValue, callback, false);
        }*/
    }

}
