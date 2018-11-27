import { SQLite } from "expo";
import { pubsubs } from "./pubsubs";

const serversSchema =
  "create table if not exists servers (id TEXT primary key not null, name TEXT, iconURL TEXT);";
const serversKeys = ["id", "name", "iconURL"];

const settingsSchema =
  "create table if not exists settings (_id TEXT primary key not null, valueAsString TEXT, valueAsBoolean INTEGER, valueAsNumber TEXT, _updatedAt DATE);";
const settingsKeys = [
  "_id",
  "valueAsString",
  "valueAsBoolean",
  "valueAsNumber",
  "_updatedAt"
];

const permissionsRolesSchema =
  "create table if not exists permissionsRoles (value TEXT primary key not null);";
const permissionsRolesKeys = ["value"];

const permissionsSchema =
  "create table if not exists permissions (_id TEXT primary key not null, roles TEXT, _updatedAt DATE);";
const permissionsKeys = ["_id", "roles", "_updatedAt"];

const roomsSchema =
  "create table if not exists rooms (_id TEXT primary key not null, broadcast INTEGER);";
const roomsKeys = ["_id", "broadcast"];

const subscriptionRolesSchema =
  "create table if not exists subscriptionRolesSchema (value TEXT primary key not null);";
const subscriptionRolesKeys = ["value"];

const userMutedInRoomSchema =
  "create table if not exists usersMuted (value TEXT primary key not null);";
const userMutedInRoomKeys = ["value"];

//muted BLOB
const subscriptionSchema =
  "create table if not exists subscriptions (_id TEXT primary key not null, f INTEGER, t TEXT, ts TEXT, ls TEXT, name TEXT, fname TEXT, rid TEXT, open INTEGER, alert INTEGER, roles TEXT, unread INTEGER, userMentions INTEGER, roomUpdatedAt TEXT, ro INTEGER, lastOpen TEXT, lastMessage TEXT, description TEXT, announcement TEXT, topic TEXT, blocked INTEGER, blocker INTEGER, reactWhenReadOnly INTEGER, archived INTEGER, joinCodeRequired INTEGER, notifications INTEGER, muted TEXT, broadcast INTEGER);";
const subscriptionKeys = [
  "_id",
  "f",
  "t",
  "ts",
  "ls",
  "name",
  "fname",
  "rid",
  "open",
  "alert",
  "roles",
  "unread",
  "userMentions",
  "roomUpdatedAt",
  "ro",
  "lastOpen",
  "lastMessage",
  "description",
  "announcement",
  "topic",
  "blocked",
  "blocker",
  "reactWhenReadOnly",
  "archived",
  "joinCodeRequired",
  "notifications",
  "muted",
  "broadcast"
];

const usersSchema =
  "create table if not exists users (_id TEXT primary key not null, username TEXT, name TEXT,avatarVersion INTEGER);";
const usersKeys = ["_id", "username", "name", "avatarVersion"];

const attachmentFields =
  "create table if not exists attachmentFields (title TEXT, value TEXT, short INTEGER);";
const attachmentFieldsKeys = ["title", "value", "short"];

//attachments BLOB, fields BLOB
const attachment =
  "create table if not exists attachment (description TEXT, image_size INTEGER, image_type TEXT, image_url TEXT, audio_size INTEGER, audio_type TEXT, audio_url TEXT, video_size INTEGER, video_type TEXT, video_url TEXT, title TEXT, title_link TEXT, type TEXT, author_icon TEXT, author_name TEXT, author_link TEXT, text TEXT, color TEXT, ts TEXT, attachments TEXT, fields TEXT);";
const attachmentKeys = [
  "description",
  "image_size",
  "image_type",
  "image_url",
  "audio_size",
  "audio_type",
  "audio_url",
  "video_size",
  "video_type",
  "video_url",
  "title",
  "title_link",
  "type",
  "author_icon",
  "author_name",
  "author_link",
  "text",
  "color",
  "ts",
  "attachments",
  "fields"
];

const url =
  "create table if not exists url (url TEXT primary key not null, title TEXT, description TEXT,image TEXT);";
const urlKeys = ["url", "title", "description", "image"];

const messagesReactionsUsernamesSchema =
  "create table if not exists messagesReactionsUsernames (value TEXT primary key not null);";
const messagesReactionsUsernamesKeys = ["value"];

//usernames BLOB
const messagesReactionsSchema =
  "create table if not exists messagesReactions (emoji TEXT primary key not null, usernames TEXT);";
const messagesReactionsKeys = ["emoji", "usernames"];

const messagesEditedBySchema =
  "create table if not exists messagesEditedBy (_id TEXT primary key not null, username TEXT);";
const messagesEditedByKeys = ["_id", "username"];

//u BLOB , attachments BLOB, urls BLOB,editedBy BLOB, reactions BLOB
const messagesSchema =
  "create table if not exists messages (_id TEXT primary key not null, msg TEXT, t TEXT, rid TEXT, ts TEXT, u TEXT, alias TEXT, parseUrls INTEGER, groupable INTEGER, avatar TEXT, attachments TEXT, urls TEXT, _updatedAt DATE, status INTEGER, pinned INTEGER, starred INTEGER, editedBy TEXT, reactions TEXT, role TEXT);";
const messagesKeys = [
  "_id",
  "msg",
  "t",
  "rid",
  "ts",
  "u",
  "alias",
  "parseUrls",
  "groupable",
  "avatar",
  "attachments",
  "urls",
  "_updatedAt",
  "status",
  "pinned",
  "starred",
  "editedBy",
  "reactions",
  "role"
];

const frequentlyUsedEmojiSchema =
  "create table if not exists frequentlyUsedEmoji (content TEXT primary key, extension TEXT, isCustom INTEGER,count INTEGER);";
const frequentlyUsedEmojiKeys = ["content", "extension", "isCustom", "count"];

const customEmojiAliasesSchema =
  "create table if not exists customEmojiAliases (value TEXT primary key);";
const customEmojiAliasesKeys = ["value"];

//aliases BLOB
const customEmojisSchema =
  "create table if not exists customEmojis (_id TEXT primary key, name TEXT, aliases TEXT, extension TEXT, _updatedAt DATE);";
const customEmojisKeys = ["_id", "name", "aliases", "extension", "_updatedAt"];

const rolesSchema =
  "create table if not exists roles (_id TEXT primary key, description TEXT);";
const rolesKeys = ["_id", "description"];

const uploadsSchema =
  "create table if not exists uploads (path TEXT primary key, rid TEXT, name TEXT, description TEXT, size INTEGER, type TEXT, store TEXT, progress INTEGER, error INTEGER);";
const uploadsKeys = [
  "path",
  "rid",
  "name",
  "description",
  "size",
  "type",
  "store",
  "progress",
  "error"
];

const schemas = [
  serversSchema,
  settingsSchema,
  subscriptionSchema,
  subscriptionRolesSchema,
  messagesSchema,
  usersSchema,
  roomsSchema,
  attachment,
  attachmentFields,
  messagesEditedBySchema,
  permissionsSchema,
  permissionsRolesSchema,
  url,
  frequentlyUsedEmojiSchema,
  customEmojiAliasesSchema,
  customEmojisSchema,
  messagesReactionsSchema,
  messagesReactionsUsernamesSchema,
  rolesSchema,
  userMutedInRoomSchema,
  uploadsSchema
];

const keys = {
  servers: serversKeys,
  settings: settingsKeys,
  permissionsRoles: permissionsRolesKeys,
  permissions: permissionsKeys,
  rooms: roomsKeys,
  subscriptionRolesSchema: subscriptionRolesKeys,
  usersMuted: userMutedInRoomKeys,
  subscriptions: subscriptionKeys,
  users: usersKeys,
  attachmentFields: attachmentFieldsKeys,
  attachment: attachmentKeys,
  url: urlKeys,
  messagesReactionsUsernames: messagesReactionsUsernamesKeys,
  messagesReactions: messagesReactionsKeys,
  messagesEditedBy: messagesEditedByKeys,
  messages: messagesKeys,
  frequentlyUsedEmoji: frequentlyUsedEmojiKeys,
  customEmojiAliases: customEmojiAliasesKeys,
  customEmojis: customEmojisKeys,
  roles: rolesKeys,
  uploads: uploadsKeys
};

class DB {
  constructor() {
    this.database = SQLite.openDatabase("default.chat");

    schemas.map(schema =>
      this.database.transaction(tx => {
        // console.log(`schema is : ${schema}`);
        tx.executeSql(schema);
      })
    );
  }

  // get database() {
  //   return this.database.activeDB;
  // }
  objectstest = () => {
    console.log("objectstest");
    // WHERE rid="9RfXcpDkbFvbqf3nhNPq7a9ZFS7qWdcTdY"
    this.database.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM subscriptions WHERE (archived = 0 OR archived is null) and open = 1 and (unread > 0 OR alert = 1) order by roomUpdatedAt desc , name desc`,
          [],
          (_, { rows }) => console.log("objectstest" + JSON.stringify(rows))
        );
      },
      null,
      () => {
        console.log("objectstest done");
      }
    );
  };

  objects = (table, requirement) => {
    let sql = requirement
      ? `SELECT * FROM ${table} ${requirement}`
      : `SELECT * FROM ${table}`;
    console.log("objects sql:" + sql);

    var p = new Promise((resolve, reject) => {
      try {
        // let result = await fetchDoubanApi();
        // console.log(result);
        this.database.transaction(tx => {
          tx.executeSql(sql, [], (_, { rows }) => {
            console.log("sql: " + sql + " rows:  " + JSON.stringify(rows));
            resolve(rows._array);
          });
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
    return p;
  };

  create(schema_name, schema_object, update) {
    let sql = `REPLACE INTO ${schema_name} (`;
    let values = [];
    for (key in schema_object) {
      if (keys[schema_name].indexOf(key) > -1 && schema_object[key]) {
        sql = sql + key + ", ";
        // values.push(schema_object[key]);
        if (schema_object[key] instanceof Date) {
          values.push(schema_object[key].toString());
        } else if (typeof schema_object[key] === "object") {
          values.push(JSON.stringify(schema_object[key]).toString());
        } else {
          values.push(schema_object[key]);
        }
      }
    }
    sql = sql.slice(0, sql.length - 2);
    sql = sql + ") VALUES (";

    values.forEach(elem => {
      sql = sql + "?, ";
    });

    sql = sql.slice(0, sql.length - 2);
    sql = sql + ");";

    console.log("create sql:" + sql);
    console.log("create sql values:" + values);

    this.database.transaction(
      tx => {
        tx.executeSql(sql, values);
      },
      null,
      pubsubs(schema_name)
    );
  }

  delete(args) {
    console.log("delete 1126");
    console.log(args);

    // this.database.transaction(
    //   tx => {
    //     tx.executeSql(
    //       `DELETE FROM subscriptions WHERE _id = "LRaFP8bfaJSLsS8vi"`
    //     );
    //   },
    //   null,
    //   pubsubs("subscriptions")
    // );
  }

  setActiveDB(db = "") {
    const path = db.replace(/(^\w+:|^)\/\//, "");
    return (this.database.activeDB = SQLite.openDatabase(`${path}.chat`));
  }
}
export default new DB();

// const database = SQLite.openDatabase("default.chat");

// schemas.map(schema =>
//   database.transaction(tx => {
//     tx.executeSql(schema);
//   })
// );

// const objects = async (table, requirement) => {
//   let sql = requirement
//     ? `SELECT * FROM ${table} WHERE ${requirement}`
//     : `SELECT * FROM ${table}`;
//   console.log("sql:" + sql);

//   try {
//     // let result = await fetchDoubanApi();
//     // console.log(result);
//     await database.transaction(tx => {
//       tx.executeSql(sql, [], (_, { rows }) => {
//         console.log(sql + "   " + JSON.stringify(rows));
//         return rows;
//       });
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

// const create = (schema_name, schema_object, update) => {
//   let sql = `UPDATE ${schema_name} SET `;
//   for (key in schema_object) {
//     sql = sql + key + " = " + schema_object[key] + ",";
//   }
//   sql = sql.slice(0, sql.length - 1);
//   // const keys = Object.keys(schema_object);
//   // const values =  Object.values(schema_object);
//   console.log("sql:" + sql);
//   return database.transaction(tx => {
//     tx.executeSql(sql);
//   });
// };

// const setActiveDB = (db = "") => {
//   const path = db.replace(/(^\w+:|^)\/\//, "");
//   return (database.activeDB = SQLite.openDatabase(`${path}.chat`));
// };

// export { database, objects, create, setActiveDB };
