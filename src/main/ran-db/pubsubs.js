import PubSub from "pubsub-js";

export const pubsubs = schema_name => {
  PubSub.publish(schema_name, "changed");
};
