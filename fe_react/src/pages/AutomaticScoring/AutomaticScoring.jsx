import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload, message } from "antd";
import { useState } from "react";
import useAI from "../../hooks/useAI";
import "./AutomaticScoring.scss";
import HeaderSelect from "./HeaderSelect";
import TableResult from "./TableResult";
import { BASE_URL } from "../../config/apiPath";

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
};
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

const AutomaticScoring = () => {
	const [urlImg, setUrlImg] = useState();
	const { getModelAI, resultAI, loading } = useAI();

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const handleCancel = () => setPreviewOpen(false);
	const examClassIdTest = '247103';
	const uploadButton = (
		<div>
			<Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
		</div>
	);
	const props = {
		name: "files",
		listType: "picture",
		multiple: true,
		action: `${BASE_URL}/test-set/handled-answers/upload/${examClassIdTest}`,
		beforeUpload: (file) => {
			const isPNG =
				file.type === "image/png" ||
				file.type === "image/jpg" ||
				file.type === "image/jpeg";
			if (!isPNG) {
				message.error(`${file.name} không phải file ảnh!`);
			}
			return isPNG || Upload.LIST_IGNORE;
		},
		onChange(info) {
			if (info.file.status !== "uploading") {
				setUrlImg(info.file.name);
			}
			if (info.file.status === "done") {
				message.success(`${info.file.name} tải lên thành công`);
			} else if (info.file.status === "error") {
				message.error(
					`${info.file.name} file đã tồn tại hoặc kết nối bị gián đoạn`
				);
			}
		},
	};
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
	};
	const handleSubmit = () => {
		getModelAI(examClassIdTest);
	}


	const onFinish = (values) => {
		if (urlImg) {
			getModelAI(examClassIdTest);
		}
	};

	const uploadBlock = (
		<div>
			<Upload {...props} onPreview={handlePreview}>
				{uploadButton}
			</Upload>
			<Modal
				open={previewOpen}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<img
					alt="example"
					style={{
						width: "100%",
					}}
					src={previewImage}
				/>
			</Modal>
		</div>
	);

	return (
		<div className="exam-list-wrapper">
			<div className="header-exam-list">
				<h2>Chấm điểm tự động</h2>
			</div>
			<HeaderSelect />
			<div className="content-exam-list">
				<Form
					name="validate_other"
					{...formItemLayout}
					onFinish={onFinish}
				>
					<div className="upload">
						<Form.Item name="pathImg">
							<div>{uploadBlock}</div>
						</Form.Item>
					</div>
					<div className="block-1">
						<div className="number-answer">
							<Form.Item
								name="numberAnswer"
								label="Số lượng câu hỏi"
								rules={[{required: false}]}
							>
								<Input type="number" />
							</Form.Item>
						</div>
						<div className="exam-class-code">
							<Form.Item
								name="examClassCode"
								label="Mã lớp thi"
								rules={[{ required: false }]}
							>
								<Input type="text" />
							</Form.Item>
						</div>
					</div>

					<div className="result-ai">
						<TableResult resultAI={resultAI} />
						{resultAI && (
							<div className="total-record">
								Đã tìm thấy {resultAI.length} kết quả
							</div>
						)}
					</div>
					<div className="button-footer">
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							className="button-submit-ai"
						>
							Chấm điểm
						</Button>
						<Button
							type="primary"
							onClick={handleSubmit}
							loading={loading}
							className="button-submit-ai"
						>
							Submit
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default AutomaticScoring;
