// 扩展程序可以在安装时设置初始状态或完成一些任务。
// 设置拓展按钮的文字内容为‘关’
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: '关',
  })
})

const extensions = 'https://developer.chrome.google.cn/docs/extensions?hl=zh-cn'
const webstore =
  'https://developer.chrome.google.cn/docs/webstore/publish?hl=zh-cn'

// 拓展点击
chrome.action.onClicked.addListener(async (tab) => {
  // 如果是目标链接
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // 获取拓展按钮的文字 看是 开或者关
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id })

    const nextState = prevState === '关' ? '开' : '关'

    // 设置下一个状态
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    })

    if (nextState === '开') {
      // 拓展开的时候添加css文件
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    } else if (nextState === '关') {
      // 拓展关的时候移除css文件
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    }
  }
})
