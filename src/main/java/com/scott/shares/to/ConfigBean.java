package com.scott.shares.to;

import java.io.Serializable;

public class ConfigBean implements Serializable {

    private String value;
    private Object actValue = null;
    private long updateTime;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }

    public Object getActValue() {
        return actValue;
    }

    public void setActValue(Object actValue) {
        this.actValue = actValue;
    }

}
