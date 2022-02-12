module.exports.getMailBody = function (message) {
  let encodedBody = "";

  if (typeof message.parts === "undefined") {
    encodedBody = message.body.data;
  } else {
    encodedBody = getHTMLPart(message.parts);
  }

  encodedBody = encodedBody
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/\s/g, "");

  const buff = Buffer.from(encodedBody, "base64").toString("utf8");

  return buff;
};

function getHTMLPart(arr) {
  for (let i = 0; i <= arr.length; i++) {
    if (typeof arr[i].parts === "undefined") {
      if (arr[i].mimeType === "text/html") {
        return arr[i].body.data;
      }
    } else {
      return getHTMLPart(arr[i].parts);
    }
  }

  return "";
}
