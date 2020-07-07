auto.waitFor(); // 自动打开无障碍服务
/*判断屏幕锁定，解锁屏幕（数字密码）*/
if (!device.isScreenOn()) { //息屏状态将屏幕唤醒
    device.wakeUp(); //唤醒设备
    sleep(1000); // 等待屏幕亮起
    //miui锁屏滑动不能唤出密码输入 通过下拉通知栏点击时间进入密码解锁
    swipe(500, 30, 500, 1000, 300);
    sleep(400);
    //点击时间
    click(100, 120);
    sleep(500);
    click(555, 1379); //5
    sleep(100);
    click(244, 1381); //4
    sleep(100);
    click(224, 1200); //1
    sleep(100);
    click(541, 1596); //8
    sleep(100);
    click(541, 1596); //8
    sleep(100);
    click(224, 1200); //1
    sleep(100);
    click(244, 1381); //4
    sleep(100);
    click(555, 1379); //5
    sleep(100);
    click(544, 1196); //2
    sleep(1000);
}