/*
 * @file ConfigUtil.java 文件介绍. ：
 * 
 * @author 李维隆 2014-4-27
 * 
 * @copyright 李维隆
 * 
 * @version 2014-4-27 李维隆(设计者） 初版.
 */
package com.scott.shares.util;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import com.scott.shares.to.ConfigBean;

/**
 * @author 李维隆
 *
 */
public class ConfigUtil {

    private static long CONFIG_UPDATE_TIME = 1000 * 60;
    private static String configFile = "/data/program/shares/config/config.properties";
    private static Properties pro;
    private static Map<String, ConfigBean> configCatch = new HashMap<String, ConfigBean>();
    private static long updateTime = 0L;

    public static String getStringValue(String key) {
        return getStringValue(key, null);
    }

    public static String getStringValue(String key, String defaultValue) {
        String returnValue = defaultValue;
        ConfigBean configBean = readValue(key);
        if (configBean != null) {
            returnValue = configBean.getValue();
        }
        configBean = null;
        defaultValue = null;
        return returnValue;
    }

    public static Integer getIntValue(String key) {
        return getIntValue(key, null);
    }

    public static Integer getIntValue(String key, Integer defaultValue) {
        Integer returnValue = defaultValue;
        ConfigBean configBean = readValue(key);
        if (configBean != null) {
            if (configBean.getActValue() != null) {
                returnValue = (Integer)configBean.getActValue();
            } else {
                returnValue = Integer.parseInt(configBean.getValue());
                configBean.setActValue(returnValue);
            }
        }
        configBean = null;
        defaultValue = null;
        return returnValue;
    }

    public static Double getDoubleValue(String key) {
        return getDoubleValue(key, null);
    }

    public static Double getDoubleValue(String key, Double defaultValue) {
        Double returnValue = defaultValue;
        ConfigBean configBean = readValue(key);
        if (configBean != null) {
            if (configBean.getActValue() != null) {
                returnValue = (Double)configBean.getActValue();
            } else {
                returnValue = Double.parseDouble(configBean.getValue());
                configBean.setActValue(returnValue);
            }
        }
        configBean = null;
        defaultValue = null;
        return returnValue;
    }

    public static boolean getBooleanValue(String key) {
        return getBooleanValue(key, true);
    }

    public static boolean getBooleanValue(String key, Boolean defaultValue) {
        boolean returnValue = defaultValue;
        ConfigBean configBean = readValue(key);
        if (configBean != null) {
            if ("true".equals(configBean.getValue()) || "1".equals(configBean.getValue())) {
                returnValue = true;
            } else {
                returnValue = false;
            }
        }
        configBean = null;
        defaultValue = null;
        return returnValue;
    }

    private synchronized static ConfigBean readValue(String key) {
        long nowTime = System.currentTimeMillis();
        ConfigBean configBean = configCatch.get(key);
        if (pro == null || nowTime - updateTime > CONFIG_UPDATE_TIME) {
            pro = new Properties();
            try {
                pro.load(new FileInputStream(configFile));
                updateTime = System.currentTimeMillis();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (pro != null
                && (configBean == null || nowTime - configBean.getUpdateTime() > CONFIG_UPDATE_TIME)) {
            configBean = new ConfigBean();
            configBean.setUpdateTime(nowTime);
            configBean.setValue(pro.getProperty(key));
            configCatch.put(key, configBean);
        }
        return configBean;
    }
    
    public static void main(String[] args) {
        System.out.println(getBooleanValue("savePrimaryData"));
    }
}
