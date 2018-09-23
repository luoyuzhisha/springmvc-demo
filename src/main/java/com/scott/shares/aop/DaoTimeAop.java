package com.scott.shares.aop;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * 打印Dao的时间AOP
 * @author fantianyin
 *
 */
@Component
@Aspect
public class DaoTimeAop {

    private Logger logger = Logger.getLogger(this.getClass());
    
    @Pointcut("execution(* com.scott.shares.mapper..*.*(..))")  
    public void pointcut() {
        // 定义一个切入点
    }
    
    // 前置通知  
//    @Before("pointcut()")  
    public void beforeAdvice() {// 如果需要知道拦截的方法的信息，也可以需添加JoinPoint参数  
        String logInfoText = "这是前置通知";  
        // 将日志信息写入配置的文件中  
        logger.info(logInfoText);  
    }
    
//    @Around("pointcut()")
    public Object myAroundAdvice(ProceedingJoinPoint jionpoint)  
            throws Throwable {  
        // 获取被调用的方法名  
        String targetMethodName = jionpoint.toShortString();
        long startTime = System.currentTimeMillis();
        Object o = jionpoint.proceed();  
        long endTime = System.currentTimeMillis();
        long costTime = endTime - startTime;
        if (costTime > 1000) {
            logger.info(targetMethodName + "用时" + costTime + "ms.");  
        }
        return o;  
    }
    
//    @After("pointcut()")  
    public void afterAdvice() {// 如果需要知道拦截的方法的信息，也可以需添加JoinPoint参数  
        String logInfoText = "这是后置通知";  
        // 将日志信息写入配置的文件中  
        logger.info(logInfoText);  
    } 
}
