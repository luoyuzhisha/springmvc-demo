package com.scott.shares.test.util;

import java.util.HashMap;
import java.util.Map;

public class TestThread extends Thread {

    private static Map<String, String> map = new HashMap<String, String>();

    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            map.put(i + "", i + "");
        }
        ActThread thread = new ActThread();
        thread.start();
        for (String key : map.keySet()) {
            System.out.println("key=" + key + ", val=" + map.get(key));
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public class ActThread extends Thread {
        @Override
        public void run() {
            try {
                Thread.sleep(2000);
                for (int i = 0; i < 20; i++) {
                    map.put(i + "", i + "-new");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
