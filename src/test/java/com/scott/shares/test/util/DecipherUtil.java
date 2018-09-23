package com.scott.shares.test.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class DecipherUtil {

    public static String FILE_FROM = "E:\\临时\\temp1.txt";

    public static String FILE_TO = "E:\\临时\\temp2.txt";

    public static void decipherFile(String filePath) {
        File file = new File(filePath);
        BufferedReader reader = null;
        try {
            System.out.println("以行为单位读取文件内容，一次读一整行：");
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            StringBuffer strBuffer = new StringBuffer();
            // 一次读入一行，直到读入null为文件结束
            while ((tempString = reader.readLine()) != null) {
                strBuffer.append(decipherString(tempString));
            }
            writeFile(FILE_TO, strBuffer.toString());
            reader.close();

            System.out.println("Complete.");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }
    }

    private static String decipherString(String str) {
        StringBuffer strBuffer = new StringBuffer();
        int count = str.length();
        char tempChar;
        for (int i = 0; i < count; i++) {
            tempChar = str.charAt(i);
            if (tempChar >= '!' && tempChar < '~') {
                tempChar = (char) (158 - tempChar);
            }
            strBuffer.append(tempChar);
        }
        return strBuffer.toString();
    }

    private static void writeFile(String filePath, String content) {
        try {
            // 打开一个写文件器，构造函数中的第二个参数true表示以追加形式写文件
            FileWriter writer = new FileWriter(filePath, false);
            writer.write(content);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        decipherFile(FILE_FROM);
    }

}
