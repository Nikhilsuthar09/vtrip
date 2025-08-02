// function to format last edited timestamp
const formatLastEdited = (timestamp) => {
  if (!timestamp) return "Never";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

// function to get last edited timestamp
const getLastEditedTimestamp = (items) => {
  if (!items || items.length === 0) return null;

  const timestamps = items
    .map((item) => {
      const updatedAt = item.updatedAt?.toDate?.() || item.updatedAt;
      return updatedAt ? new Date(updatedAt) : null;
    })
    .filter(Boolean);

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps.map((t) => t.getTime())));
};

// Format time for display
const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

// Function to calculate days between two dates
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
  return daysDifference;
};

// Function to add days to a date
const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

// Generate journey days based on trip data
const generateJourneyDays = (tripData) => {
  if (!tripData || !tripData.startDate || !tripData.endDate) {
    return [];
  }

  const totalDays = calculateDaysBetween(tripData.startDate, tripData.endDate);
  const journeyDays = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(tripData.startDate, i);
    const formattedDate = formatDate(currentDate);

    let dayTitle;
    if (i === totalDays - 1) {
      dayTitle = `Good Bye ${tripData.destination}`;
    } else {
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      dayTitle = `${tripData.destination} ${getOrdinal(i + 1)} day`;
    }

    journeyDays.push({
      id: `day-${i + 1}`,
      title: dayTitle,
      date: formattedDate,
      dayNumber: i + 1,
      rawDate: currentDate,
    });
  }

  return journeyDays;
};

export {
  formatLastEdited,
  getLastEditedTimestamp,
  formatTime,
  calculateDaysBetween,
  generateJourneyDays,
};
