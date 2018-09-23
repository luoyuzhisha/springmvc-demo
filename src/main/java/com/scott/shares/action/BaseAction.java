package com.scott.shares.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;

import com.scott.shares.util.CommonUtil;


public class BaseAction {

    @Deprecated
    public void responseRightJson(HttpServletResponse response, Object object) {
        responseRightJson(response, object, "");
    }

    @Deprecated
    public void responseRightJson(HttpServletResponse response, Object object, String callback) {
        responseJson(response, object, callback, true);
    }

    @Deprecated
    public void responseErrorJson(HttpServletResponse response, Object object) {
        responseErrorJson(response, object, null);
    }

    @Deprecated
    public void responseErrorJson(HttpServletResponse response, Object object, String callback) {
        responseJson(response, object, callback, false);
    }

    public void responseJson(HttpServletResponse response, Object object, boolean right) {
        responseJson(response, object, null, right);
    }

    public void responseJson(HttpServletResponse response, Object object, String callback,
            boolean right) {
        StringBuffer jsonBuffer = new StringBuffer();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            if (callback == null) {
                callback = "";
                Map<String, Object> returnValueMap = new HashMap<String, Object>();
                returnValueMap.put("success", right);
                returnValueMap.put("result", object);
                jsonBuffer.append(getJson(returnValueMap));
            } else {
                // 生成json
                if (right) {
                    jsonBuffer.append(callback).append("([")
                            .append("{\"success\":true,\"result\":");
                } else {
                    jsonBuffer.append(callback).append("([")
                            .append("{\"success\":false,\"result\":");
                }
                jsonBuffer.append(objectMapper.writeValueAsString(object));
                jsonBuffer.append("}])");
            }

            // 输出
            response.setCharacterEncoding("UTF_8");
            response.setHeader("Content-type", "application/json;charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.print(jsonBuffer);
            writer.flush();
            writer.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        jsonBuffer = null;
        objectMapper = null;
        object = null;
    }

    public String getJson(Object object) {
        return CommonUtil.getJson(object);
    }
}
