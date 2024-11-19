App({
  globalData: {
    // 全局数据
    userInfo: null
  },

  onLaunch() {
    // 小程序启动时执行
    // 检查并初始化统计数据
    const statistics = tt.getStorageSync('diceStatistics')
    if (!statistics) {
      tt.setStorageSync('diceStatistics', {})
    }

    const totalRolls = tt.getStorageSync('totalRolls')
    if (!totalRolls) {
      tt.setStorageSync('totalRolls', 0)
    }
  },

  onShow() {
    // 小程序从后台进入前台时执行
  },

  onHide() {
    // 小程序从前台进入后台时执行
  },

  onError(err) {
    // 小程序发生脚本错误或 API 调用报错时触发
    console.error('应用错误：', err)
  }
}) 