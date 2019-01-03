import { ImageManipulator, FileSystem } from "expo";
import { Dimensions } from "react-native";

export function loadAndCompress(uri, destPath, name, compressRate, cb) {
  FileSystem.copyAsync({ from: uri, to: destPath }).then(() => {
    var myPromise = new Promise(function(resolve, reject) {
      var x = ImageManipulator.manipulate(
        destPath,
        [{ resize: { width: Dimensions.get("window").width } }],
        { compress: compressRate }
      );
      resolve(x);
    });

    myPromise
      .then(function(x) {
        console.log(JSON.stringify("ImageManipulator:" + x));
        cb(null, x);
      })
      .catch(error => {
        console.log("ImageManipulator error: " + error);
        cb(error);
      });
  });
}
