console.log("sw-omnibox.js");

// 监听插件安装事件
chrome.runtime.onInstalled.addListener(({ reason }) => {
  console.log(reason, "rea");
  // if (reason === "install") {
  //   chrome.storage.local.set({
  //     apiSuggestions: ["tabs", "storage", "scripting"],
  //   });
  // }

  // 在安装或更新时更新 API 建议列表
  chrome.storage.local.set({
    apiSuggestions: ["tabs", "storage", "scripting"],
  });
});

const URL_CHROME_EXTENSIONS_DOC =
  "https://developer.chrome.com/docs/extensions/reference/"; // Chrome 扩展文档的 URL
const NUMBER_OF_PREVIOUS_SEARCHES = 4; // 要保存的先前搜索的数量

// 用户开始输入时显示建议
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: "输入一个 Chrome 扩展 API 名称 然后回车进行搜索",
  }); // 设置默认建议

  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions"); // 获取存储的 API 建议

  const suggestions = apiSuggestions.map((api) => {
    return { content: api, description: `打开 chrome.${api} API` };
  }); // 格式化建议列表
  suggest(suggestions); // 显示建议
});

// 输入框回车后触发
chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input }); // 在新标签页中打开搜索结果
  // 保存搜索历史
  updateHistory(input); // 更新搜索历史
});

async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions"); // 获取当前的 API 建议
  apiSuggestions.unshift(input); // 将新输入添加到建议列表的开头
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES); // 截断建议列表，只保留指定数量的条目
  return chrome.storage.local.set({ apiSuggestions }); // 将更新后的建议列表保存到本地存储
}
