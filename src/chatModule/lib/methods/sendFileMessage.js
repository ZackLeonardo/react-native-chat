import { Base64 } from "js-base64";

import { store as reduxStore } from "../../../src";
import database from "../../../main/ran-db/sqlite";
import Expo, { FileSystem } from "expo";

const promises = {};

function _ufsCreate(fileInfo) {
  return this.ddp.call("ufsCreate", fileInfo);
}

function _ufsComplete(fileId, store, token) {
  return this.ddp.call("ufsComplete", fileId, store, token);
}

function _sendFileMessage(rid, data, msg = {}) {
  return this.ddp.call("sendFileMessage", rid, null, data, msg);
}

export function isUploadActive(path) {
  return !!promises[path];
}

export async function cancelUpload(path) {
  if (promises[path]) {
    await promises[path].cancel();
  }
}

export async function sendFileMessage(rid, fileInfo) {
  try {
    if (!fileInfo.size) {
      const fileStat = await FileSystem.getInfoAsync(fileInfo.path, {
        md5: false,
        size: true
      });
      fileInfo.size = fileStat.size;
    }
    if (!fileInfo.name) {
      fileInfo.name = fileInfo.path.split("/").pop(); //.split(".")[0]
    }

    const { FileUpload_MaxFileSize } = reduxStore.getState().settings;

    // -1 maxFileSize means there is no limit
    if (FileUpload_MaxFileSize > -1 && fileInfo.size > FileUpload_MaxFileSize) {
      return Promise.reject({ error: "error-file-too-large" }); // eslint-disable-line
    }

    fileInfo.rid = rid;

    await database.create("uploads", fileInfo, true);

    const result = await _ufsCreate.call(this, fileInfo);

    const imageData = await fetch(fileInfo.path);
    const blob = await imageData._bodyText; //.blob();

    let formData = new FormData();
    formData.append("file", {
      uri: fileInfo.path,
      name: fileInfo.name,
      type: "image/jpeg" //fileInfo.type
    });
    // formData.append("file", {
    //   uri: fileInfo.path,
    //   name: fileInfo.name,
    //   type: "image" //fileInfo.type
    // });

    let options = {
      method: "POST",
      body: blob,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    const request = new XMLHttpRequest();
    request.open("POST", result.url);
    request.responseType = "json";

    await request.send(formData);

    // await fetch(result.url, options);
    // console.log(uploadResponse.json());

    fileInfo.progress = 100;
    await database.create("uploads", fileInfo, true);

    const completeResult = await _ufsComplete.call(
      this,
      result.fileId,
      fileInfo.store,
      result.token
    );

    await _sendFileMessage.call(this, completeResult.rid, {
      _id: completeResult._id,
      type: completeResult.type,
      size: completeResult.size,
      name: completeResult.name,
      description: completeResult.description,
      url: completeResult.path
    });

    const upload = await database.objects(
      "uploads",
      `WHERE path = ${fileInfo.path}`
    );
    database.delete(upload);
  } catch (e) {
    console.log(e);
    fileInfo.error = true;
    database.create("uploads", fileInfo, true);
  }
}
