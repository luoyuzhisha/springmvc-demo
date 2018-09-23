package com.scott.shares.test.util;

public class MyTest {

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new TestThread();
        thread.start();
        System.out.println("主线程结束");
    }

}
