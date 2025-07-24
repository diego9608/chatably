// Apache ECharts Dynamic Loader and Chart Initialization
let echarts = null;

export async function initializeCharts() {
  try {
    // Dynamically import Apache ECharts
    const echartsModule = await import('https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.esm.js');
    echarts = echartsModule.default || echartsModule;
    
    // Initialize all charts
    initDailyTrendChart();
    initMRRChart();
    initRevenuePredictionChart();
    initMultiChannelChart();
    
    // Listen for theme changes
    window.addEventListener('localeChanged', updateChartsTheme);
    document.documentElement.addEventListener('themeChanged', updateChartsTheme);
    
  } catch (error) {
    console.error('Failed to load ECharts:', error);
  }
}

function getChartTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: isDark ? '#e5e5e5' : '#404040'
    },
    line: {
      itemStyle: {
        borderWidth: 1
      },
      lineStyle: {
        width: 2
      },
      symbolSize: 4,
      symbol: 'emptyCircle',
      smooth: true
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: isDark ? '#525252' : '#d4d4d4'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: isDark ? '#a3a3a3' : '#737373'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#404040' : '#e5e5e5'
        }
      }
    },
    valueAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: isDark ? '#a3a3a3' : '#737373'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#404040' : '#e5e5e5',
          type: 'dashed'
        }
      }
    },
    tooltip: {
      backgroundColor: isDark ? '#262626' : '#ffffff',
      borderColor: isDark ? '#404040' : '#e5e5e5',
      textStyle: {
        color: isDark ? '#e5e5e5' : '#404040'
      }
    },
    legend: {
      textStyle: {
        color: isDark ? '#e5e5e5' : '#404040'
      }
    },
    color: ['#2979FF', '#00B6FF', '#FF8A30', '#27AE60', '#E74C3C', '#F39C12']
  };
}

function initDailyTrendChart() {
  const chartDom = document.getElementById('daily-trend');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom, null, { renderer: 'svg' });
  
  const option = {
    ...getChartTheme(),
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5
    },
    xAxis: {
      type: 'category',
      data: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [1200, 1400, 1000, 1600, 2000, 2400, 2200],
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#27AE60',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(39, 174, 96, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(39, 174, 96, 0)'
          }]
        }
      }
    }]
  };
  
  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
}

function initMRRChart() {
  const chartDom = document.getElementById('mrr-chart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom, null, { renderer: 'svg' });
  
  const option = {
    ...getChartTheme(),
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5
    },
    xAxis: {
      type: 'category',
      data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [45000, 52000, 48000, 61000, 75000, 89000],
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#2979FF'
          }, {
            offset: 1,
            color: '#00B6FF'
          }]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }]
  };
  
  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
}

function initRevenuePredictionChart() {
  const chartDom = document.getElementById('revenue-prediction');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom, null, { renderer: 'svg' });
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const actualData = [45, 52, 48, 61, 75, 89, null, null, null, null, null, null];
  const predictedData = [null, null, null, null, null, 89, 98, 112, 125, 138, 145, 156];
  
  const option = {
    ...getChartTheme(),
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const month = params[0].name;
        let result = `<strong>${month}</strong><br/>`;
        params.forEach(param => {
          if (param.value !== null) {
            result += `${param.marker} ${param.seriesName}: $${param.value}k<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: ['Real', 'Proyección'],
      top: 0,
      right: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}k'
      }
    },
    series: [
      {
        name: 'Real',
        type: 'line',
        data: actualData,
        smooth: true,
        lineStyle: {
          color: '#2979FF',
          width: 3
        },
        itemStyle: {
          color: '#2979FF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(41, 121, 255, 0.2)'
            }, {
              offset: 1,
              color: 'rgba(41, 121, 255, 0)'
            }]
          }
        }
      },
      {
        name: 'Proyección',
        type: 'line',
        data: predictedData,
        smooth: true,
        lineStyle: {
          color: '#00B6FF',
          width: 3,
          type: 'dashed'
        },
        itemStyle: {
          color: '#00B6FF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(0, 182, 255, 0.1)'
            }, {
              offset: 1,
              color: 'rgba(0, 182, 255, 0)'
            }]
          }
        }
      }
    ]
  };
  
  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
}

function initMultiChannelChart() {
  const chartDom = document.getElementById('multi-channel-chart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom, null, { renderer: 'svg' });
  
  const option = {
    ...getChartTheme(),
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: ['W', 'T', 'M'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [650, 400, 195],
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        color: (params) => {
          const colors = ['#2979FF', '#FF8A30', '#00B6FF'];
          return colors[params.dataIndex];
        },
        borderRadius: [4, 4, 0, 0]
      }
    }]
  };
  
  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());
}

function updateChartsTheme() {
  // Re-initialize all charts with new theme
  initDailyTrendChart();
  initMRRChart();
  initRevenuePredictionChart();
  initMultiChannelChart();
}