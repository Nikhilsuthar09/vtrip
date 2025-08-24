export const tripJoinReqBody = (username, tripTitle, destination) => {
  const body = {
    TITLE_JOIN: "New Join Request 🚀",
    BODY_JOIN: `${username} has requested to join your trip "${tripTitle}" to ${destination}. Tap to accept or reject.`,
  };
  return body;
};
export const notificationType = {
  JOIN_REQUEST: "join_request",
};
export const status = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  PENDING: "pending",
};
