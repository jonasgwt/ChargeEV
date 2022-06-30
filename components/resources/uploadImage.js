import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

// Upload Image
export const uploadImage = async (image) => {
  console.log("uploading image")
  if (image == null) return null;
  const uploadUri = image;
  let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  const extension = filename.split(".").pop();
  const name = filename.split(".").slice(0, -1).join(".");
  filename = name + Date.now() + "." + extension;
  const storage = getStorage();
  const storageRef = ref(storage, `photos/${filename}`);
  let uri = image;
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  const task = uploadBytesResumable(storageRef, blob);
  try {
    await task;
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (e) {
    console.log(e);
    return null;
  }
};
