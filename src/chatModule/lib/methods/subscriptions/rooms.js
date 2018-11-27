import Random from "react-native-meteor/lib/Random";
import database from "../../../../main/ran-db/sqlite";
import { merge } from "../helpers/mergeSubscriptionsRooms";
import protectedFunction from "../helpers/protectedFunction";
import messagesStatus from "../../../constants/messagesStatus";
import log from "../../../utils/log";

export default async function subscribeRooms(id) {
  const promises = Promise.all([
    this.ddp.subscribe(
      "stream-notify-user",
      `${id}/subscriptions-changed`,
      false
    ),
    this.ddp.subscribe("stream-notify-user", `${id}/rooms-changed`, false),
    this.ddp.subscribe("stream-notify-user", `${id}/message`, false)
  ]);

  let timer = null;
  let subs = null;

  const loop = (time = new Date()) => {
    if (timer) {
      return;
    }
    timer = setTimeout(async () => {
      try {
        await this.getRooms(time);
        timer = false;
        loop();
      } catch (e) {
        loop(time);
      }
    }, 5000);
  };

  if (!this.ddp && this._login) {
    loop();
  } else {
    this.ddp.on("logged", () => {
      clearTimeout(timer);
      timer = false;
    });

    this.ddp.on("logout", () => {
      clearTimeout(timer);
      timer = true;
    });

    this.ddp.on("disconnected", () => {
      if (this._login) {
        loop();
      }
    });

    this.ddp.on(
      "stream-notify-user",
      protectedFunction(async ddpMessage => {
        const [type, data] = ddpMessage.fields.args;
        const [, ev] = ddpMessage.fields.eventName.split("/");
        if (/subscriptions/.test(ev)) {
          if (type === "removed") {
            let messages = [];
            const [subscription] = await database.objects(
              "subscriptions",
              `WHERE _id == "${data._id}"`
            );

            if (subscription) {
              messages = await database.objects(
                "messages",
                `WHERE rid == "${subscription.rid}"`
              );
            }
            database.delete(messages);
            database.delete(subscription);
          } else {
            const rooms = await database.objects(
              "rooms",
              `WHERE _id == "${data.rid}"`
            );
            subs = merge(data, rooms[0]);
            // database.create("subscriptions", tpm, true);
            database.delete(rooms);
          }
        }
        if (/rooms/.test(ev)) {
          if (type === "updated") {
            // const [sub] = await database.objects(
            //   "subscriptions",
            //   `WHERE rid == "${data._id}"`
            // );
            const tmp = merge(subs, data);
            database.create("subscriptions", tmp, true);
          } else if (type === "inserted") {
            database.create("rooms", data, true);
          }
        }
        if (/message/.test(ev)) {
          const [args] = ddpMessage.fields.args;
          const _id = Random.id();
          const message = {
            _id,
            rid: args.rid,
            msg: args.msg,
            ts: new Date(),
            _updatedAt: new Date(),
            status: messagesStatus.SENT,
            u: {
              _id,
              username: "rocket.cat"
            }
          };
          requestAnimationFrame(() =>
            database.create("messages", message, true)
          );
        }
      })
    );
  }

  try {
    await promises;
  } catch (e) {
    log("subscribeRooms", e);
  }
}
