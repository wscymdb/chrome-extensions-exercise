console.log("sw-tips.js");
// 获取提示并保存到存储中
// Fetch tip & save in storage
const updateTip = async () => {
  const response = await fetch("https://chrome.dev/f/extension_tips"); // 从指定 URL 获取提示
  const tips = await response.json(); // 将响应解析为 JSON 格式的提示列表
  const randomIndex = Math.floor(Math.random() * tips.length); // 生成一个随机索引
  return chrome.storage.local.set({ tip: tips[randomIndex] }); // 将随机选择的提示保存到本地存储
};

const ALARM_NAME = "tip"; // 闹钟的名称

// 检查闹钟是否存在以避免重置计时器。
// 浏览器会话重新启动时，闹钟可能会被移除。
// Check if alarm exists to avoid resetting the timer.
// The alarm might be removed when the browser session restarts.
async function createAlarm() {
  const alarm = await chrome.alarms.get(ALARM_NAME); // 获取指定名称的闹钟
  if (typeof alarm === "undefined") {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1, // 首次触发延迟时间（分钟）
      periodInMinutes: 1440, // 每次触发间隔时间（分钟），1440分钟等于24小时，即一天
    });
    updateTip(); // 首次创建闹钟时更新提示
  }
}

createAlarm(); // 创建或检查闹钟

// 每天更新一次提示
// Update tip once a day
chrome.alarms.onAlarm.addListener(updateTip); // 监听闹钟事件，触发时更新提示

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.greeting === "tip") {
    chrome.storage.local.get("tip").then((res) => {
      sendResponse(res);
    }); // 如果收到"tip"消息，则从本地存储中获取提示并响应
    return true; // 表示异步响应
  }
});
