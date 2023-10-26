export const formatDate = (str) => {
  const date = new Date(str);
  let day, month, year;
  day = date.getDate();
  month = date.getMonth() + 1;
  year = date.getFullYear();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  let formatDate = `${year}-${month}-${day}`;
  return formatDate;
};

export function generateRandomSixDigitNumber() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const sixDigitNumber = randomNumber.toString().padStart(6, "0");
  return sixDigitNumber;
}
export const wordLimit = (message, wordCount) => {
  if (typeof message === "string" && typeof wordCount === "number") {
    if (message?.length <= wordCount) {
      return message;
    } else {
      return `${message?.substring(0, wordCount)}...`;
    }
  }
  return;
};
