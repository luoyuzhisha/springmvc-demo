package com.scott.shares.util;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class ApplicationContextUtil {

    private static Logger logger = Logger.getLogger(ApplicationContextUtil.class);
    
    private static ApplicationContext act;

    public static synchronized ApplicationContext getApplicationContext() {
        if (act == null) {
            logger.info("尝试获取ApplicationContext");
            try {
                act = new ClassPathXmlApplicationContext("spring/springmvc-init.xml");
            } catch (Exception e) {
                logger.warn("第一种获取配置文件方式失败", e);
                try {
                    act =
                            new FileSystemXmlApplicationContext(
                                    "/src/main/resources/spring/springmvc-init.xml");
                } catch (Exception e1) {
                    logger.error("第二种获取配置文件方式失败", e);
                }
            }
        }
        return act;
    }

}
