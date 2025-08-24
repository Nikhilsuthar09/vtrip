export const sendPushNotification = async (expoPushToken, data) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: data.TITLE,
    body: data.BODY,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
