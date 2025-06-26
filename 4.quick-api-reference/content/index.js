(async () => {
  // 向服务工作线程发送消息并接收提示作为响应
  // Sends a message to the service worker and receives a tip in response
  const { tip } = await chrome.runtime.sendMessage({ greeting: "tip" });

  const nav = document.querySelector(".upper-tabs > nav"); // 获取页面上方的导航栏

  const tipWidget = createDomElement(`
    <button type="button" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0 12px; height: 36px;">
      <span style="display: block; font: var(--devsite-link-font,500 14px/20px var(--devsite-primary-font-family));">Tip</span>
    </button>
  `); // 创建一个提示按钮

  const popover = createDomElement(
    `<div id='tip-popover' popover style="margin: auto;">${tip}</div>`
  ); // 创建一个包含提示内容的弹出框

  document.body.append(popover); // 将弹出框添加到页面body中
  nav.append(tipWidget); // 将提示按钮添加到导航栏中
})();

function createDomElement(html) {
  // 将HTML字符串转换为DOM元素
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild; // 返回DOM元素的第一个子元素
}
