package com.scott.shares.util;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

public class CommonUtil {

    public static String getKey() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        StringBuffer strB = new StringBuffer();
        strB.append("liweilong8").append(sdf.format(new Date()));
        return MD5Util.MD5(strB.toString().toLowerCase());
    }

    public static String getJson(Object object) {
        String returnValue = "";
        if (object != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                returnValue = objectMapper.writeValueAsString(object);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return returnValue;
    }
    
    public static <T> T fromJson(String jsonAsString, Class<T> pojoClass)
            throws JsonMappingException, JsonParseException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonAsString, pojoClass);
    }
    
    public static <T> T fromJson(String jsonAsString, TypeReference<T> valueTypeRef)
            throws JsonMappingException, JsonParseException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonAsString, valueTypeRef);
    }
    
    
    /**
     * 比较两个Double金额的大小 空认为是最小
     * 
     * @param d1
     * @param d2
     * @return d1 > d2 --> 1 d1 == d2 --> 1 d1 < d2 --> -1
     */
    public static int compareDouble(Double d1, Double d2) {
        int returnValue = 0;
        if (d1 == null && d2 == null) {
            returnValue = 0;
        } else if (d1 != null && d2 == null) {
            returnValue = 1;
        } else if (d1 == null && d2 != null) {
            returnValue = -1;
        } else {
            BigDecimal b1 = new BigDecimal(d1);
            b1 = b1.setScale(2, BigDecimal.ROUND_HALF_UP);
            BigDecimal b2 = new BigDecimal(d2);
            b2 = b2.setScale(2, BigDecimal.ROUND_HALF_UP);
            returnValue = b1.compareTo(b2);
        }
        return returnValue;
    }

    public static void main(String[] args) {
//        List<Integer> list = new ArrayList<Integer>();
//        for (int i = 0; i < 20; i++) {
//            list.add(i);
//        }
//        System.out.println(list.subList(0, 5));
        String url = "http://service.uat.qa.nt.ctripcorp.com/Cii/Order/Message/Msg_Send.asp?hotelid=52753&asda=&uhiid=";
        System.out.println(getParam(url, "asda"));
        
    }
    
    public static String getParam(String url, String name) {
        String value = "";
        if (url != null && name != null) {
            int startIndex = -1;
            int endIndex = -1;
            int index = url.lastIndexOf("&" + name + "=");
            if (index < 0) {
                index = url.lastIndexOf("?" + name + "=");
            }
            if (index > -1) {
                startIndex = index + name.length() + 2;
                endIndex = url.indexOf("&", startIndex);
            }
            if (startIndex > -1) {
                if (endIndex > startIndex) {
                    value = url.substring(startIndex, endIndex);
                } else if (startIndex != endIndex) {
                    value = url.substring(startIndex);
                }
            }
        }
        return value;
    }
    
    public static Double add(Double orig, Double ...addValue) {
        Double returnValue = 0.0;
        if (addValue != null && addValue.length > 0) {
            if (orig != null) {
                returnValue = orig;
            }
            for (Double bean : addValue) {
                if (bean != null) {
                    returnValue += bean;
                }
            }
        } else if (orig != null) {
            returnValue = orig;
        }
        return returnValue;
    }
}
