const { Expo } = require("expo-server-sdk");
const expo = new Expo();


exports.handler = (event, context, callback) => {
  console.log("Event:", event);
  handlePushTokens(event.pushTokens, event.title, event.body, event.type);
}

const handlePushTokens = (pushTokens, title, body, type) => {
    let notifications = [];
    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
  
      notifications.push({
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
        data: { type: type }
      });
    }
  
    let chunks = expo.chunkPushNotifications(notifications);
  
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  };