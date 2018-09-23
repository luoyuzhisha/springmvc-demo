package com.scott.shares.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class CloneUtils {

    /**
     * 对象深度克隆
     * 
     * @author yang_qiao
     * 
     * @date 2013-12-18
     */
    @Deprecated
    public static Object deepClone(final Object value) throws IOException,
            ClassNotFoundException {
        // 字节数组输出流，暂存到内存中
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        // 序列化
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(value);
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
        ObjectInputStream ois = new ObjectInputStream(bis);
        // 反序列化
        return ois.readObject();
    }
    
    public static Integer clone(Integer orgBean) {
        return orgBean == null ? 0 : orgBean.intValue();
    }
    
    public static Long clone(Long orgBean) {
        return orgBean == null ? 0 : orgBean.longValue();
    }
    
    public static Double clone(Double orgBean) {
        return orgBean == null ? 0 : orgBean.doubleValue();
    }
}
