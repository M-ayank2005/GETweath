// utils/uiService.js
export const getBackgroundStyle = (weatherCode, isDaytime) => {
    if (isDaytime) {
      if (weatherCode < 1000) return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
      else if (weatherCode < 1200) return "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)";
      else return "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)";
    } else {
      if (weatherCode < 1000) return "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)";
      else return "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)";
    }
  };
  