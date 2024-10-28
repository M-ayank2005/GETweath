// timeService.js - Improved
export const fetchTimeData = async (location) => {
  const url = `https://api.timeapi.io/v1/timezone?location=${location}`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Time data not available");

      const data = await response.json();
      const hour = new Date(data.datetime).getHours();
      return { 
          isDaytime: hour >= 6 && hour < 18, 
          localTime: data.datetime 
      };
  } catch (error) {
      console.error("Error fetching time data:", error);
      return null;
  }
};
