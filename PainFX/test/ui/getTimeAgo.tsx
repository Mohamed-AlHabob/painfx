import { formatDistanceToNow, parseISO } from 'date-fns';

const getTimeAgo = (dateString: string) => {
  try {
    const date = parseISO(dateString); // Parse the string to a date object
    return `${formatDistanceToNow(date)} ago`;
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
};

export default getTimeAgo;
