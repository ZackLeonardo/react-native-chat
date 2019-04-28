import PubSub from "pubsub-js";

// export const pubsubs = schema_name => {
//   PubSub.publish(schema_name, "changed");
// };

export const pubsubs = (schema_name, pubkeys) => {
  if (schema_name === "subscriptions") {
    if (!pubkeys.get("archived") && pubkeys.get("open")) {
      if (pubkeys.get("unread") > 0 || pubkeys.get("alert")) {
        PubSub.publish(schema_name, "unread");
      }
      if (pubkeys.get("f") === 1) {
        PubSub.publish(schema_name, "favorites");
      }
      if (pubkeys.get("t") === "c") {
        PubSub.publish(schema_name, "channels");
      }
      if (pubkeys.get("t") === "p") {
        PubSub.publish(schema_name, "privateGroup");
      }
      if (pubkeys.get("t") === "d") {
        PubSub.publish(schema_name, "direct");
      }
      if (pubkeys.get("t") === "l") {
        PubSub.publish(schema_name, "livechat");
      }
      if (pubkeys.get("unread") === 0 && !pubkeys.get("alert")) {
        PubSub.publish(schema_name, "chatsUnread");
      }
      if (pubkeys.get("f") === 1) {
        PubSub.publish(schema_name, "favorites");
      }
      if (pubkeys.get("f") === 1) {
        PubSub.publish(schema_name, "favorites");
      }
      PubSub.publish(schema_name, "chatsDefault");
    }
  } else {
    PubSub.publish(schema_name, pubkeys);
  }
};
