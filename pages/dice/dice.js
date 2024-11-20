Page({
  data: {
    diceNumber: 1,
    rolling: false,
    totalRolls: 0
  },

  onLoad() {
    try {
      const totalRolls = tt.getStorageSync('totalRolls') || 0
      this.setData({ totalRolls })
    } catch (e) {
      console.error('获取总次数失败:', e)
    }
  },

  rollDice() {
    if (this.data.rolling) return;
    
    this.setData({ rolling: true });
    
    let count = 0;
    const maxCount = 10;
    
    const roll = () => {
      if (count < maxCount) {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        this.setData({ diceNumber: randomNumber });
        count++;
        setTimeout(roll, 100);
      } else {
        const finalNumber = Math.floor(Math.random() * 6) + 1;
        this.setData({
          diceNumber: finalNumber,
          rolling: false,
        });
        this.saveResult(finalNumber);
      }
    };

    roll();
  },

  saveResult(number) {
    let statistics = tt.getStorageSync('diceStatistics') || {};
    
    // 确保每个点数都有初始值
    for (let i = 1; i <= 6; i++) {
        if (!statistics[i]) {
            statistics[i] = 0;
        }
    }
    
    // 更新对应点数的统计
    statistics[number]++;
    
    // 更新统计数据
    tt.setStorageSync('diceStatistics', statistics);
    
    // 更新 totalRolls
    const newTotalRolls = this.data.totalRolls + 1; // 每次摇骰子总次数加1
    tt.setStorageSync('totalRolls', newTotalRolls);
    this.setData({ totalRolls: newTotalRolls });
    
    // 计算每个点数的概率并存储
    const probabilities = tt.getStorageSync('diceProbabilities') || []; // 从存储中读取概率数据
    
    // 确保 probabilities 是一个有效的数组
    if (!Array.isArray(probabilities)) {
        probabilities.length = 0; // 初始化为空数组
    }
    
    // 计算当前概率并推送到数组中
    for (let i = 1; i <= 6; i++) {
        const count = statistics[i] || 0;
        const probability = newTotalRolls > 0 ? ((count / newTotalRolls * 100).toFixed(2) + '%') : '0.00%';     
        if (!probabilities[i - 1]) {
            probabilities[i - 1] = [];
        }
        
        probabilities[i - 1].push(probability); // 更新当前概率
    }
    
    // 存储概率数据
    tt.setStorageSync('diceProbabilities', probabilities);
  }
}) 