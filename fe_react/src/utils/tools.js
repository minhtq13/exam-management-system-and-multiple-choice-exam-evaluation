import TestFooter from "../components/TestPreview/TestFooter";
import TestHeader from "../components/TestPreview/TestHeader";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";

const minDate = new Date();
const nextDay = new Date(minDate);
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

export const formatDateParam = (str) => {
	const date = new Date(str);
	let day, month, year;
	day = date.getDate();
	month = date.getMonth() + 1;
	year = date.getFullYear();
	month = month < 10 ? "0" + month : month;
	day = day < 10 ? "0" + day : day;
	let formatDate = `${day}/${month}/${year}`;
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

export function wordLimitImg(fileName, maxLength) {
	var fileNameWithoutExtension = fileName.split(".")[0];
	var fileExtension = fileName.split(".").pop();
	if (fileNameWithoutExtension.length > maxLength) {
		fileNameWithoutExtension = fileNameWithoutExtension.substring(
			0,
			maxLength
		);
		if (fileNameWithoutExtension.length > 0) {
			fileNameWithoutExtension += "...";
		}
	}
	var truncatedFileName = fileNameWithoutExtension + "." + fileExtension;
	return truncatedFileName;
}
export function convertGender(gender) {
	return gender === "MALE" ? "NAM" : "NỮ";
}
export function capitalizeFirstLetter(str) {
	if (!str) {
		return "";
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const downloadTestPdf = (questions, testDetail, testNo) => {
	const testHeader = <TestHeader testDetail={testDetail} testNo={testNo} />;
	const testFooter = <TestFooter />;
	let combinedString = "";
	questions.length > 0 &&
		questions.forEach((question, index) => {
			// Nối chuỗi câu hỏi
			combinedString += `<div style="display: flex; gap: 5px; margin-top: 8px;"><p style="flex-shrink:0; font-family: 'Times New Roman', Times, serif;">Câu ${
				index + 1
			}: </p><div style="display: flex; flex-direction: column">${
				question.content
			}</div></div>`;
			// Nối chuỗi câu trả lời
			question.answers.forEach((answer) => {
				combinedString += `<div style="display: flex; gap: 5px;"><p style="font-family: 'Times New Roman', Times, serif;">${answer.answerNoMask}. </p> <p style="font-family: 'Times New Roman', Times, serif;">${answer.content}</p></div>`;
			});
		});
	const htmlContent = `
  <style>
    p {
      font-family: 'Times New Roman', Times, serif;
      font-size: 16px;
      color: #000;
    }
	img {
		  max-width: 500px;
		  object-fit: contain;
		  display: block;
	}
	span {
		display: block;
	}
  </style>
  <div>
  ${ReactDOMServer.renderToStaticMarkup(testHeader)}
  ${combinedString}
  ${ReactDOMServer.renderToStaticMarkup(testFooter)}
  </div>
`;
	if (htmlContent) {
		const pdfInstance = html2pdf(htmlContent, {
			margin: 10,
			filename: `${testDetail.subjectCode}-${testDetail.testSetCode}-${testDetail.semester}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
			pagebreak: { mode: "avoid-all" }, //
		});

		pdfInstance.from().then(() => {
			pdfInstance.save();
		});
	}
};

export const customPaginationText = {
	items_per_page: "/ trang",
	jump_to: "Đến trang",
	page: "",
	prev_page: "Trang trước",
	next_page: "Trang sau",
	prev_5: "5 trang trước",
	next_5: "5 trang sau",
	prev_3: "3 trang trước",
	next_3: "3 trang sau",
};

export const disabledDate = (current) => {
	return current && current < minDate;
};

export const nextday = nextDay.setDate(minDate.getDate() + 1);
