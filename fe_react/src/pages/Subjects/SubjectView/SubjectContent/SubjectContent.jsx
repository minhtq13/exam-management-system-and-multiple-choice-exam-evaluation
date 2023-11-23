import { Form, Input, Button, Skeleton } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./SubjectContent.scss";
import { useState } from "react";
import useNotify from "../../../../hooks/useNotify";
import { addChapterService } from "../../../../services/subjectsService";
import useSubjects from "../../../../hooks/useSubjects";

const SubjectContent = ({ contentLoading, editItems, code }) => {
	const notify = useNotify();

	const [btnLoading, setBtnLoading] = useState(false);
	const { getSubjectByCode } = useSubjects();
	const onFinish = (values) => {
		console.log(values);
		if (values.chaptersAdd.length > 0) {
			setBtnLoading(true);
			addChapterService(
				code,
				values.chaptersAdd.map((item) => {
					return { orders: item.orderAdd, title: item.titleAdd };
				}),
				(res) => {
					getSubjectByCode({}, code);
					setBtnLoading(false);
					notify.success("Thêm chap mới thành công!");
				},
				(error) => {
					setBtnLoading(false);
					notify.error(error.response.data.message);
				}
			);
		}
	};
	return (
		<div className="subject-content-tab">
			<div className="chapter-title">Nội dung</div>
			<Form
				name="subject-content-form"
				onFinish={onFinish}
				className="subject-content-form"
			>
				<Skeleton active loading={contentLoading}>
					<Form.List name="chaptersEdit" initialValue={editItems}>
						{(fields, { add, remove }) => {
							return (
								<>
									{fields.map((field, index) => (
										<div
											className="form-space"
											key={`editChapter${index}`}
										>
											<div className="chapter-view-orders">
												<span>Order:</span>
												<Form.Item
													{...field}
													name={[field.name, `orders`]}
													key={`orders${index}`}
													style={{ width: "20%" }}
													noStyle
													label="Order"
												>
													<Input
														aria-label="Order"
														placeholder="Enter the orders"
														style={{
															width: "100%",
														}}
														disabled={true}
													/>
												</Form.Item>
											</div>
											<div className="chapter-view-title">
												<span>Title:</span>
												<Form.Item
													{...field}
													name={[field.name, `title`]}
													key={`title${index}`}
													noStyle
													style={{ width: "50%" }}
												>
													<Input
														placeholder="Enter the title"
														style={{
															width: "100%",
														}}
														disabled={true}
													/>
												</Form.Item>
											</div>
										</div>
									))}
								</>
							);
						}}
					</Form.List>
				</Skeleton>
				<Form.List name="chaptersAdd">
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.map((field, index) => (
									<div
										className="item-space"
										key={`addchapter${index}`}
									>
										<div className="form-space">
											<div className="chapter-view-orders">
												<span>Order: </span>
												<Form.Item
													{...field}
													name={[
														field.name,
														`orderAdd`,
													]}
													style={{ width: "20%" }}
													noStyle
													key={`orders-add${index}`}
													rules={[
														{
															required: true,
															message:
																"Chưa điền đầy đủ thông tin",
														},
													]}
												>
													<Input
														type="number"
														aria-label="Order"
														placeholder="Nhập thứ tự chương"
														style={{
															width: "100%",
														}}
													/>
												</Form.Item>
											</div>
											<div className="chapter-view-title">
												<span>Title:</span>
												<Form.Item
													{...field}
													name={[
														field.name,
														`titleAdd`,
													]}
													noStyle
													style={{ width: "70%" }}
													key={`title-add${index}`}
													rules={[
														{
															required: true,
															message:
																"Chưa điền đầy đủ thông tin",
														},
													]}
												>
													<Input
														placeholder="Nhập tên chương"
														style={{
															width: "100%",
														}}
													/>
												</Form.Item>
											</div>
										</div>
										<div className="btn-space">
											<Button
												onClick={() => remove(index)}
												icon={<DeleteOutlined />}
											></Button>
										</div>
									</div>
								))}
								<Form.Item className="btn" key={`btnAdd`}>
									<Button
										type="dashed"
										onClick={() => {
											add();
										}}
										block
										icon={<PlusOutlined />}
										style={{ width: 300, marginTop: 20 }}
									>
										Add chapter
									</Button>
								</Form.Item>
							</>
						);
					}}
				</Form.List>
				<Form.Item className="btn btn-submit">
					<Button
						type="primary"
						htmlType="submit"
						style={{ width: 150, height: 50 }}
						loading={btnLoading}
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SubjectContent;
