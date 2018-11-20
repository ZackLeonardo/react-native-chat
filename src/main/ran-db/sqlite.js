import { SQLite } from "expo";
import { pubsubs } from "./pubsubs";

const serversSchema =
  "create table if not exists servers (id TEXT primary key not null, name TEXT, iconURL TEXT);";

const settingsSchema =
  "create table if not exists settings (_id TEXT primary key not null, valueAsString TEXT, valueAsBoolean INTEGER, valueAsNumber TEXT, _updatedAt DATE);";

const permissionsRolesSchema =
  "create table if not exists permissionsRoles (value TEXT primary key not null);";

const permissionsSchema =
  "create table if not exists permissions (_id TEXT primary key not null, roles TEXT, _updatedAt DATE);";

const roomsSchema =
  "create table if not exists rooms (_id TEXT primary key not null, broadcast INTEGER);";

const subscriptionRolesSchema =
  "create table if not exists subscriptionRolesSchema (value TEXT primary key not null);";

const userMutedInRoomSchema =
  "create table if not exists usersMuted (value TEXT primary key not null);";

//muted BLOB
const subscriptionSchema =
  "create table if not exists subscriptions (_id TEXT primary key not null, f INTEGER, t TEXT, ts TEXT, ls TEXT, name TEXT, fname TEXT, rid TEXT, open INTEGER, alert INTEGER, roles TEXT, unread INTEGER, userMentions INTEGER, roomUpdatedAt TEXT, ro INTEGER, lastOpen TEXT, lastMessage TEXT, description TEXT, announcement TEXT, topic TEXT, blocked INTEGER, blocker INTEGER, reactWhenReadOnly INTEGER, archived INTEGER, joinCodeRequired INTEGER, notifications INTEGER, muted TEXT, broadcast INTEGER);";

const usersSchema =
  "create table if not exists users (_id TEXT primary key not null, username TEXT, name TEXT,avatarVersion INTEGER);";

const attachmentFields =
  "create table if not exists attachmentFields (title TEXT, value TEXT, short INTEGER);";

//attachments BLOB, fields BLOB
const attachment =
  "create table if not exists attachment (description TEXT, image_size INTEGER, image_type TEXT, image_url TEXT, audio_size INTEGER, audio_type TEXT, audio_url TEXT, video_size INTEGER, video_type TEXT, video_url TEXT, title TEXT, title_link TEXT, type TEXT, author_icon TEXT, author_name TEXT, author_link TEXT, text TEXT, color TEXT, ts TEXT, attachments TEXT, fields TEXT);";

const url =
  "create table if not exists url (url TEXT primary key not null, title TEXT, description TEXT,image TEXT);";

const messagesReactionsUsernamesSchema =
  "create table if not exists messagesReactionsUsernames (value TEXT primary key not null);";

//usernames BLOB
const messagesReactionsSchema =
  "create table if not exists messagesReactions (emoji TEXT primary key not null, usernames TEXT);";

const messagesEditedBySchema =
  "create table if not exists messagesEditedBy (_id TEXT primary key not null, username TEXT);";

//u BLOB , attachments BLOB, urls BLOB,editedBy BLOB, reactions BLOB
const messagesSchema =
  "create table if not exists messages (_id TEXT primary key not null, msg TEXT, t TEXT, rid TEXT, ts TEXT, u TEXT, alias TEXT, parseUrls INTEGER, groupable INTEGER, avatar TEXT, attachments TEXT, urls TEXT, _updatedAt DATE, status INTEGER, pinned INTEGER, starred INTEGER, editedBy TEXT, reactions TEXT, role TEXT);";

const frequentlyUsedEmojiSchema =
  "create table if not exists frequentlyUsedEmoji (content TEXT primary key, extension TEXT, isCustom INTEGER,count INTEGER);";

const customEmojiAliasesSchema =
  "create table if not exists customEmojiAliases (value TEXT primary key);";

//aliases BLOB
const customEmojisSchema =
  "create table if not exists customEmojis (_id TEXT primary key, name TEXT, aliases TEXT, extension TEXT, _updatedAt DATE);";

const rolesSchema =
  "create table if not exists roles (_id TEXT primary key, description TEXT);";

const uploadsSchema =
  "create table if not exists uploads (path TEXT primary key, rid TEXT, name TEXT, description TEXT, size INTEGER, type TEXT, store TEXT, progress INTEGER, error INTEGER);";

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

    this.delete();

    // this.database.transaction(
    //   tx => {
    //     tx.executeSql(
    //       "SELECT * FROM subscriptions WHERE (archived = 0 OR archived is null) and open = 1 and (unread > 0 OR alert = 1) order by roomUpdatedAt desc , name desc",
    //       [],
    //       (_, { rows }) => console.log("objectstest" + JSON.stringify(rows))
    //     );
    //   },
    //   null,
    //   () => {
    //     console.log("objectstest done");
    //   }
    // );
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
      if (key !== "u" && key != "_updatedAt" && schema_object[key]) {
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

  delete() {
    this.database.transaction(
      tx => {
        tx.executeSql(
          `DELETE FROM subscriptions WHERE _id = "LRaFP8bfaJSLsS8vi"`
        );
      },
      null,
      pubsubs("subscriptions")
    );
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
