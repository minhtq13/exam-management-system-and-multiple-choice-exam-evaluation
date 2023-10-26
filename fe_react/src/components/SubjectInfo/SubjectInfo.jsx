import { Form, Input, Button, Skeleton } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./SubjectInfo.scss";
import React from "react";
import useNotify from "../../hooks/useNotify";
import deletePopUpIcon from "../../assets/images/svg/delete-icon.svg";
import ModalPopup from "../ModalPopup/ModalPopup";
import { deleteChaptersService } from "../../services/subjectsService";
import useSubjects from "../../hooks/useSubjects";
const SubjectInfo = ({
	onFinish,
	initialValues,
	infoHeader,
	btnText,
	loading,
	skeletonLoading,
	chaptersVisible,
	editItems,
	code,
}) => {
	const { getSubjectByCode } = useSubjects();
	const notify = useNotify();
	const errorMessange = "Chưa điền đầy đủ thông tin";
	return (
		<div className="subject-info">
			<p className="info-header">{infoHeader}</p>
			<Skeleton active loading={skeletonLoading}>
				<Form
					name="info-subject-form"
					className="info-subject-form"
					initialValues={initialValues}
					onFinish={onFinish}
				>
					<div className="info-subject-header">
						Thông tin học phần
					</div>
					<Form.Item
						name="code"
						label="Mã học phần"
						colon={true}
						rules={[
							{
								required: true,
								message: errorMessange,
							},
						]}
					>
						<Input placeholder="Nhập mã học phần" />
					</Form.Item>
					<Form.Item
						name="title"
						label="Tên học phần"
						colon={true}
						rules={[
							{
								required: true,
								message: errorMessange,
							},
						]}
					>
						<Input placeholder="Nhập tên học phần" />
					</Form.Item>
					<Form.Item
						name="description"
						label="Mô tả"
						colon={true}
						rules={[
							{
								required: true,
								message: errorMessange,
							},
						]}
					>
						<Input placeholder="Nhập mô tả" />
					</Form.Item>
					<Form.Item
						name="credit"
						label="Số tín chỉ"
						colon={true}
						rules={[
							{
								required: true,
								message: errorMessange,
							},
							{
								pattern: /^[1-9]\d*$/,
								message: "Vui lòng nhập một số",
							},
						]}
					>
						<Input placeholder="Nhập số tín chỉ" />
					</Form.Item>
					{chaptersVisible && (
						<div className="subject-chapters">
							<div className="subject-chapter-header">
								Nội dung
							</div>
							<Form.List name="chapters" initialValue={editItems}>
								{(fields, { add, remove }) => {
									return (
										<>
											{fields.map((field, index) => (
												<div
													className="form-space"
													key={`editChapter${index}`}
												>
													<div className="subject-order-title">
														<span>Order:</span>
														<Form.Item
															{...field}
															name={[
																field.name,
																`order`,
															]}
															key={`order${index}`}
															style={{
																width: "20%",
															}}
															noStyle
															label="Order"
															//initialValue={field.order}
														>
															<Input
																aria-label="Order"
																placeholder="Enter the order"
																style={{
																	width: "100%",
																}}
															/>
														</Form.Item>
													</div>
													<div className="subject-order-title subject-title">
														<span>Title:</span>
														<Form.Item
															{...field}
															name={[
																field.name,
																`title`,
															]}
															key={`title${index}`}
															noStyle
															style={{
																width: "50%",
															}}
															//initialValue={field.title}
														>
															<Input
																placeholder="Enter the title"
																style={{
																	width: "100%",
																}}
															/>
														</Form.Item>
													</div>
													<ModalPopup
														buttonOpenModal={
															<Button
																icon={
																	<DeleteOutlined />
																}
															></Button>
														}
														title="Delete Chapter"
														message="Bạn có chắc chắn muốn xóa học phần này không?"
														ok="OK"
														onAccept={() => {
															deleteChaptersService(
																editItems[index]
																	.id,
																null,
																(res) => {
																	remove(
																		index
																	);
																	notify.success(
																		"Xoá thành công!"
																	);
																	getSubjectByCode(
																		{},
																		code
																	);
																},
																(error) => {
																	notify.error(
																		"Lỗi!"
																	);
																}
															);
														}}
														confirmMessage="Thao tác này không thể hoàn tác"
														icon={deletePopUpIcon}
													/>
												</div>
											))}
										</>
									);
								}}
							</Form.List>
						</div>
					)}
					<Form.Item className="btn-info">
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							style={{ width: 150, height: 50 }}
						>
							{btnText}
						</Button>
					</Form.Item>
				</Form>
			</Skeleton>
		</div>
	);
};
export default SubjectInfo;
