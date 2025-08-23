export const tripJoinBody = (username, tripTitle, destination) => {
  const body = {
    TITLE_JOIN: "New Join Request 🚀",
    BODY_JOIN: `${username} has requested to join your trip "${tripTitle}" to ${destination}.`,
  };
  return body;
};
