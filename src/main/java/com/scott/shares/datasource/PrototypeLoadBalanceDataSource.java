package com.scott.shares.datasource;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.util.Assert;

import com.scott.shares.util.ConfigUtil;

public class PrototypeLoadBalanceDataSource extends AbstractRoutingDataSource{

    private Logger logger = Logger.getLogger(this.getClass());
    
    @Override
    protected Object determineCurrentLookupKey() {
        String returnValue = null;
        Integer index = 0;
        // DataSource的key为dataSource_*，从0开始，必须连续
        // 获取分片机制,默认为单一数据源
        String percentsStr = ConfigUtil.getStringValue("datasourcePer", "100");
        String[] percentStrs = percentsStr.split(",");
        int[] percents = new int[percentStrs.length];
        for (int i = 0; i < percentStrs.length; i++) {
            percents[i] = Integer.valueOf(percentStrs[i]);
        }
        // 获取一个随机数
        int rad = (int)Math.round((Math.random() * 100));
        int currentValue = 0;
        for (int i = 0; i < percents.length; i++) {
            if (rad >= currentValue && rad < currentValue + percents[i]) {
                index = i;
                break;
            } else {
                currentValue += percents[i];
            }
        }
        returnValue = "dataSource_" + index;
        return returnValue;
    }
    
}
