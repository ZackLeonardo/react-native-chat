import { SQLite } from "expo";

const serversSchema =
  "create table if not exists serversSchema (id VARCHAR(5) primary key not null, name VARCHAR(255), iconURL VARCHAR(255));";

const settingsSchema =
  "create table if not exists settingsSchema (_id VARCHAR(5) primary key not null, valueAsString VARCHAR(255), valueAsBoolean VARCHAR(255), valueAsNumber VARCHAR(255), _updatedAt VARCHAR(255));";

const permissionsRolesSchema =
  "create table if not exists permissionsRolesSchema (value VARCHAR(255));";

const subscriptionSchema =
  "create table if not exists subscriptions (_id VARCHAR(255) primary key not null, f INT, t VARCHAR(255), ts TEXT, ls TEXT, name VARCHAR(255), fname VARCHAR(255), rid VARCHAR(255), open INT, alert INT, roles TEXT, unread INT, userMentions INT, roomUpdatedAt TEXT, ro INT, lastOpen TEXT, lastMessage TEXT, description TEXT, announcement TEXT, topic TEXT, blocked INT, blocker INT, reactWhenReadOnly INT, archived INT, joinCodeRequired INT, notifications INT, muted BLOB, broadcast INT);";

const schemas = [
  serversSchema,
  settingsSchema,
  permissionsRolesSchema,
  subscriptionSchema
];

class DB {
  constructor() {
    this.database = SQLite.openDatabase("db.chat");

    schemas.map(schema =>
      this.database.transaction(tx => {
        tx.executeSql(schema);
      })
    );
  }

  objects(table) {
    this.table = table;

    filtered = (...args) => {
      console.log("objects:" + args);
    };
  }

  create(schema_name, schema_object, create) {
    let sql = `UPDATE ${schema_name} SET `;
    for (key in schema_object) {
      sql = sql + key + " = " + schema_object[key] + ",";
    }
    sql = sql.slice(0, sql.length - 1);
    // const keys = Object.keys(schema_object);
    // const values =  Object.values(schema_object);
    console.log(sql);
    this.database.transaction(tx => {
      tx.executeSql(sql);
    });
  }
}
export default new DB();
