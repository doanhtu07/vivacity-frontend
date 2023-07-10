import * as util from "util";

export const ErrorWrap = (err: any): Error => {
  let formatError: Error = err;

  if (formatError instanceof Error === false) {
    if (typeof err === "object") {
      // https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format
      // I avoid JSON.stringify because err can be cyclic JSON.
      formatError = new Error(util.inspect(err, { compact: false, depth: 5 }));
    } else {
      formatError = new Error(String(err));
    }
  }

  return formatError;
};
