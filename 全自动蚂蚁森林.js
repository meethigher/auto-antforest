/**
* 该脚本的思路
* 运行之后，给定权限跟自启动和电源无限制。
* 每天到了下面指定的时间，自动运行。
* 我是android10。偶尔好使，偶尔不好使。
* 可能是android出于安全考虑，限制了息屏后app的运行（有时候时间会运行很慢，或者不走。我尝试将其安装成系统应用，但是还是不好使）
* 不过可以用来每隔10分钟执行一次，这样还是可以的，时间一久，就gg了
*/



//检查是否开启无障碍服务，若未开启则等待开启
auto.waitFor();

//测试机分辨率为1080*2340
//不同像分辨率的机型会按比例缩放
setScreenMetrics(1080, 2340); //不要修改该行代码

var g_help_friend = true;
//六球坐标值
var g_energy_postion = [
    [250, 750],
    [350, 700],
    [450, 650],
    [600, 650],
    [750, 700],
    [850, 750]
];
var hour = 7;
var min = 10;
var sec = 0;


//debug标志 用于测试
const DEBUG = false;

//主程序入口
main();

function addSteps() {
    launchApp("小米步数管理");
    sleep(500);
    id("edtAddSteps").findOne().setText(20000);
    sleep(100);
    id("btnAddSteps").findOne().click();
    console.log("增加步数");
}

/**
 * 解锁屏幕
 */
function unlock() {
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
        console.log("自动解锁屏幕");
    }
}
/**
 *锁定屏幕
 */
function lock() {
    KeyCode(26);
    console.log("锁屏");
}

/**
 * 请求截图权限
 */
function getScreenCapturePermission() { //建议永久开启截图权限，在"取消"按键的上方，部分设备看不见，但是是存在的可以点击
    if (!requestScreenCapture()) {
        toast("获取截图权限失败，脚本退出");
        console.error("获取截图权限失败，脚本退出");
        exit();
    }
    toastLog("获取截图权限成功，等待支付宝启动");
    sleep(500);
}

/**
 * 注册退出事件
 */
function registerExitEvent() {
    var thread = threads.start(function() {
        events.observeKey();
        events.onKeyDown("volume_down", function(event) {
            toast("音量下键被按下，脚本退出");
            console.warn("音量下键被按下，脚本退出");
            exit();
        });
    });
    return thread;
}

/**
 * 寻找支付宝首页
 */
function findHomePage() {
    let i = 0;
    //尝试5次找到支付宝首页
    while (i++ < 5) {
        if (text("首页").exists() && text("我的").exists()) break;
        back();
        sleep(500);
    }
    if (i < 5)
        return true;
    else
        return false;
}

/**
 * 打开支付宝
 */
function openAlipay() { //请确保打开了"Auto.js"的后台弹出界面权限
    launchApp("支付宝");
    sleep(1000);
    //寻找支付宝首页
    if (!findHomePage()) { //未找到，退出脚本
        toast("寻找支付宝首页失败，脚本退出");
        console.error("寻找支付宝首页失败，脚本退出");
        exit();
    } else { //找到则点击
        let item = text("首页").findOnce();
        if (!item.selected()) {
            let pos = item.bounds();
            if (!click(pos.centerX(), pos.centerY())) {
                console.error("打开支付宝首页失败，脚本退出");
                exit();
            }
        }
        console.log("成功找到支付宝首页");
    }
}

/**
 * 进入蚂蚁森林
 */
function entranceAntForest() {
    //滑动页面找到蚂蚁森林
    var item = null,
        i = 0;
    while (i++ < 5) {
        // 使用className和text双重定位
        item = className("android.widget.TextView").text("蚂蚁森林").findOnce();
        if (item != null) break;
        swipe(520, 500, 520, 1500, 500);
        sleep(500);
    }
    if (item == null) {
        toast("首页上没有蚂蚁森林，退出脚本");
        console.error("首页上没有蚂蚁森林，退出脚本");
        exit();
    } else {
        let pos = item.bounds();
        click(pos.centerX(), pos.centerY());
    }
    //确保进入蚂蚁森林主页
    i = 0;
    while (i++ < 10) {
        if (text("背包").exists() && text("任务").exists()) break;
        sleep(1000); //进入蚂蚁森林主页的时间较长，因此循环检测的时间间隔设置为1000ms(default 500ms)
    }
    if (i >= 10) {
        toast("进入蚂蚁森林主页失败，退出脚本");
        exit();
    } else {
        if (DEBUG)
            console.log("成功进入蚂蚁森林主页", "用时" + i * 1.0 + "秒");
        else
            console.log("成功进入蚂蚁森林主页");
    }
    //收集自己的能量
    collectionEnergyByPosition(400); //100ms delay

    //确保"查看更多好友"控件出现在屏幕中
    item = null;
    i = 0;
    while (i++ < 10) {
        item = text("查看更多好友").findOnce();
        if (item != null && item.bounds().height() > 100) break;
        swipe(520, 1800, 520, 300, 500);
        sleep(500);
    }
    if (item == null) {
        toast("没有找到查看更多好友，退出脚本");
        exit();
    } else {
        let pos = item.bounds();
        if (!click(pos.centerX(), pos.centerY())) {
            toast("进入好友排行榜失败，退出脚本");
            exit();
        } else {
            //进入好友排行榜
            if (DEBUG)
                console.log("成功进入好友排行榜", "用时" + i * 0.5 + "秒");
            else
                console.log("成功进入好友排行榜");
            //预留足够的反应时间(default 2000ms)等待进入排行榜页面
            //否则会出现排行榜前几个好友检测不到的bug
            sleep(2000);

            //进入好友排行榜页面收集好友能量
            entranceFriendsRank();
        }
    }
}

/**
 * 根据名称查找并点击控件 返回null表示查找失败 返回false表示点击失败 返回true表示成功
 * @param {*} click_name 控件名称
 * @param {*} match_pos 前缀、后缀还是完全匹配
 * @param {*} text_or_desc text还是desc属性
 * @param {*} timeout 查找的超时时间
 */
function searchAndClickByName(serach_name, match_pos, text_or_desc, timeout) {
    var result = null;
    if (match_pos == "prefix") {
        if (text_or_desc == "text")
            result = textStartsWith(serach_name).findOne(timeout);
        else
            result = descStartsWith(serach_name).findOne(timeout);
    } else {
        if (text_or_desc == "text")
            result = textEndsWith(serach_name).findOne(timeout);
        else
            result = descEndsWith(serach_name).findOne(timeout);
    }
    if (!result) {
        let pos = result.bounds();
        if (pos.centerX() < 0 || pos.centerY() < 0)
            return false;
        else
            return click(pos.centerX(), pos.centerY());
    }
    return null;
}

/**
 * 通过六球坐标收取(帮收)能量
 * @param {*} delay
 */
function collectionEnergyByPosition(delay) {
    if (typeof(delay) == "undefined") delay = 0;
    for (let i = 0; i < g_energy_postion.length; ++i) {
        click(g_energy_postion[i][0], g_energy_postion[i][1]);
        sleep(200);
    }
}

/**
 * 获取截图
 */
function getCaptureImg() {
    var img = captureScreen();
    sleep(100);
    if (img == null || typeof(img) == "undefined") {
        toast("截图失败，脚本退出");
        console.error("截图失败，脚本退出");
        exit();
    } else {
        return img;
    }
}

/**
 * 获取有能量成熟的好友
 */
function getHasEnergyFriends() {
    var img = getCaptureImg();
    var hand = null,
        heart = null;

    //查找可收取能量的小手 "#1da06d"为深绿色 "#ffffff"为白色
    hand = images.findMultiColors(img, "#1da06d", [
        [0, -7, "#ffffff"],
        [0, 10, "#ffffff"]
    ], {
        region: [1010, 400, 1, 1800],
        threshold: 4
    });
    if (hand != null) {
        console.info("找到**可收取**好友");
        return [hand, "hand"];
    }

    if (g_help_friend == true) {
        //查找可帮收能量的爱心 "##f99236"为橙色
        heart = images.findColor(img, "#f99236", { region: [1000, 400, 10, 1800], threshold: 4 });
        if (heart != null) {
            console.info("找到**可帮收**好友");
            return [heart, "heart"];
        }
    }
    return null;
}

/**
 * 检测是否到达排行榜底部
 */
function arriveRankBottom() {
    var img = getCaptureImg();
    //分别是白色、浅灰色、深灰色
    var result = null;
    result = images.findMultiColors(img, "#F5F5F5", [
        [0, -40, "#FFFFFF"],
        [0, 20, "#999999"]
    ], {
        region: [600, 2000],
        threshold: 1
    });
    if (result != null)
        return true;
    else
        return false;
}

/**
 * 进入好友排行榜
 */
function entranceFriendsRank() {
    var i = 0;
    sleep(500);
    var epoint = getHasEnergyFriends();

    //确保当前操作是在排行榜界面
    //不断滑动，查找好友
    while (epoint == null) {
        swipe(520, 1800, 520, 800, 500);
        sleep(500);
        epoint = getHasEnergyFriends();
        //如果检测到结尾，同时也没有可收能量的好友，那么结束收取
        if (epoint == null && arriveRankBottom()) {
            toastLog("没有更多好友了");
            return true;
        }
        //如果连续32次都未检测到可收集好友,无论如何停止查找
        if (i++ >= 32) {
            console.error("程序可能出错, 连续" + i + "次未检测到可收集好友");
            return false;
        }
    }
    //找到好友，进入好友森林
    if (click(epoint[0].x, epoint[0].y + 20)) {
        //确认进入了好友森林
        let i = 0;
        while (i++ < 10) {
            if (text("TA收取你").exists() && text("你收取TA").exists()) break;
            sleep(500);
        }
        if (i < 10) {
            if (DEBUG) console.log("成功进入好友森林主页", "用时" + i * 0.5 + "秒");
            collectionEnergyByPosition(400); //100ms delay
        }
        //返回排行榜
        back();
    }
    //递归调用
    entranceFriendsRank();
}

/**
 * 主函数
 */
function main() {
    while (true) {
        let date = new Date();
        let sleepHour, sleepMin, sleepSec;
        if (date.getSeconds() > sec) {
            sleepSec = 60 - date.getSeconds() + sec;
        } else {
            sleepSec = sec - date.getSeconds();
        }
        if (date.getMinutes() > min) {
            sleepMin = 60 - date.getMinutes() + min;
        } else if (date.getMinutes() == min) {
            if (date.getSeconds() < sec) {
                sleepMin = 0;
            } else {
                sleepMin = 60;
            }
        } else {
            sleepMin = min - date.getMinutes();
        }
        if (date.getHours() > hour) {
            sleepHour = 24 - date.getHours() + hour;
        } else if (date.getHours() == hour) {
            if (date.getMinutes() < min) {
                sleepHour = 0;
            } else {
                sleepHour = 24;
            }
        } else {
            sleepHour = hour - date.getHours();
        }
        if (sleepHour > 0) {
            sleepHour--;
        }
        if (sleepMin > 0) {
            sleepMin--;
        }
        let message = "休眠" + sleepHour + "小时" + sleepMin + "分钟" + sleepSec + "秒后运行";
        toast(message);
        console.log(message);

        sleep(sleepHour * 60 * 60 * 1000 + sleepMin * 60 * 1000 + sleepSec * 1000);



        unlock();
        //添加步数
        addSteps();
        //获取截图权限
        getScreenCapturePermission();
        //注册"音量下键按下退出脚本"事件
        //var exit_event = registerExitEvent();
        //等待退出事件子线程执行
        //exit_event.waitFor();
        //打开支付宝
        openAlipay();
        //进入蚂蚁森林
        entranceAntForest();
        lock();
    }
}