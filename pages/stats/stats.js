Page({
  data: {
    currentDistribution: {},
    totalRolls: 0,
    probabilities: [[], [], [], [], [], []] // 用于存储每个点数的概率
  },

  onShow() {
    this.loadStatistics();
  },
  onLoad() {
    this.loadStatistics();
  },
  loadStatistics() {
    try {
      const statistics = tt.getStorageSync('diceStatistics') || {};
      const totalRolls = tt.getStorageSync('totalRolls') || 0;

      const currentDistribution = {};
      const probabilities = tt.getStorageSync('diceProbabilities') || []; // 从存储中读取概率数据
      console.log('读取的概率数据:', probabilities); // 调试信息

      // 确保 probabilities 是一个有效的数组
      if (!Array.isArray(probabilities)) {
        console.error('概率数据不是数组:', probabilities);
        return;
      }

      for (let i = 1; i <= 6; i++) {
        const count = statistics[i] || 0;
        const percentage = totalRolls > 0 
          ? ((count / totalRolls * 100).toFixed(2) + '%')
          : '0.00%';

        currentDistribution[i] = {
          count: count,
          percentage: percentage
        };
      }

      this.setData({
        currentDistribution,
        totalRolls,
        probabilities // 存储概率数据
      });

      this.drawLineChart(); // 绘制折线图
    } catch (e) {
      console.error('获取统计数据失败:', e);
    }
  },

  drawLineChart() {
    console.log("绘制折线图:" + this.data.probabilities)
    const ctx = tt.createCanvasContext('lineChart', this);
    const chartWidth = 300; // 图表宽度
    const chartHeight = 200; // 图表高度
    const padding = 20; // 边距

    // 清空画布
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // 定义颜色数组
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFDA33', '#33FFF5'];
    
    // 绘制折线
    for (let i = 0; i < this.data.probabilities.length; i++) {
      ctx.setStrokeStyle(colors[i]);
      ctx.setLineWidth(2);
      ctx.beginPath();
      var countNumber = this.data.probabilities[i].length
      this.data.probabilities[i].forEach((probability, index) => {
        const x = padding + index * (chartWidth  / countNumber);
        const y = chartHeight - padding - ((probability.replace('%', '')/100) * (chartHeight - padding * 2));
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // 绘制点
    // this.data.probabilities.forEach((probabilities, i) => {
    //   probabilities.forEach((probability, index) => {
    //     const x = padding + index * (chartWidth  / countNumber);
    //     const y = chartHeight - padding - ((probability.replace('%', '')/100) * (chartHeight - padding * 2));
    //     ctx.beginPath();
    //     ctx.arc(x, y, 4, 0, 2 * Math.PI);
    //     ctx.fillStyle = colors[i];
    //     ctx.fill();
    //   });
    // });

    ctx.draw();
  }
}); 