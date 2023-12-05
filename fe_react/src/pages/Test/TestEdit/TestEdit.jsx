import { useState } from "react";
import "./TestEdit.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const TestEdit = ({ questions, testDetail, testNo }) => {
	const lstQuestion = [
		{
			id: "Q1",
			content:
				"Trong phân tích thiết kế hướng đối tượng, đối tượng (object) là gì?",
			answers: [
				{
					id: "A11",
					content: "Một thực thể trong cơ sở dữ liệu",
					isCorrect: false,
				},
				{
					id: "A12",
					content:
						"Một instance của một lớp, chứa dữ liệu và phương thức",
					isCorrect: true,
				},
				{
					id: "A13",
					content: "Một biến có thể thay đổi giá trị",
					isCorrect: false,
				},
				{
					id: "A14",
					content: "Một dòng mã nguồn thực hiện một chức năng cụ thể",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q2",
			content: "Encapsulation trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A21",
					content:
						"Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
				{
					id: "A22",
					content:
						"Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
					isCorrect: true,
				},
				{
					id: "A23",
					content: "Quá trình kết nối các đối tượng với nhau",
					isCorrect: false,
				},
				{
					id: "A24",
					content: "Quá trình tạo ra các instance của một lớp",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q3",
			content:
				"Inheritance (kế thừa) trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A31",
					content:
						"Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
				{
					id: "A32",
					content:
						"Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
					isCorrect: false,
				},
				{
					id: "A33",
					content: "Quá trình kết nối các đối tượng với nhau",
					isCorrect: false,
				},
				{
					id: "A34",
					content:
						"Quá trình lấy các thuộc tính và phương thức từ một lớp cha",
					isCorrect: true,
				},
			],
		},
		{
			id: "Q4",
			content:
				"Polymorphism (đa hình) trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A41",
					content:
						"Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
				{
					id: "A42",
					content:
						"Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
					isCorrect: false,
				},
				{
					id: "A43",
					content: "Quá trình kết nối các đối tượng với nhau",
					isCorrect: false,
				},
				{
					id: "A44",
					content:
						"Khả năng một phương thức hoạt động theo nhiều cách khác nhau tùy thuộc vào ngữ cảnh",
					isCorrect: true,
				},
			],
		},
		{
			id: "Q5",
			content:
				"Abstraction (trừu tượng hóa) trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A51",
					content:
						"Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
				{
					id: "A52",
					content:
						"Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
					isCorrect: false,
				},
				{
					id: "A53",
					content: "Quá trình tạo ra các instance của một lớp",
					isCorrect: false,
				},
				{
					id: "A54",
					content:
						"Làm cho một đối tượng chỉ chứa những thông tin và phương thức cần thiết để thực hiện một nhiệm vụ cụ thể",
					isCorrect: true,
				},
			],
		},
		{
			id: "Q6",
			content: "Interface trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A61",
					content: "Một thực thể trong cơ sở dữ liệu",
					isCorrect: false,
				},
				{
					id: "A62",
					content:
						"Một instance của một lớp, chứa dữ liệu và phương thức",
					isCorrect: false,
				},
				{
					id: "A63",
					content:
						"Một bản thiết kế của một lớp, xác định các phương thức mà lớp đó cần triển khai",
					isCorrect: true,
				},
				{
					id: "A64",
					content: "Một dòng mã nguồn thực hiện một chức năng cụ thể",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q7",
			content: "Constructor trong lập trình hướng đối tượng là gì?",
			answers: [
				{
					id: "A71",
					content: "Một phương thức có sẵn trong mọi lớp",
					isCorrect: false,
				},
				{
					id: "A72",
					content:
						"Một phương thức dùng để tạo mới một instance của một lớp",
					isCorrect: true,
				},
				{
					id: "A73",
					content: "Một phương thức để kết nối các đối tượng",
					isCorrect: false,
				},
				{
					id: "A74",
					content: "Một phương thức để xóa một instance của lớp",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q8",
			content:
				"Đối tượng là gì trong ngữ cảnh của lập trình hướng đối tượng?",
			answers: [
				{
					id: "A81",
					content: "Một biến có thể thay đổi giá trị",
					isCorrect: false,
				},
				{
					id: "A82",
					content:
						"Một instance của một lớp, chứa dữ liệu và phương thức",
					isCorrect: true,
				},
				{
					id: "A83",
					content: "Một thực thể trong cơ sở dữ liệu",
					isCorrect: false,
				},
				{
					id: "A84",
					content: "Một đoạn mã thực hiện một chức năng cụ thể",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q9",
			content: "Encapsulation và abstraction khác nhau như thế nào?",
			answers: [
				{
					id: "A91",
					content:
						"Encapsulation là quá trình che giấu chi tiết bên trong của một đối tượng, trong khi abstraction là quá trình tạo ra một đối tượng trừu tượng chỉ chứa những thông tin và phương thức cần thiết",
					isCorrect: true,
				},
				{
					id: "A92",
					content:
						"Encapsulation là quá trình kế thừa thuộc tính từ một lớp cha, trong khi abstraction là quá trình đóng gói dữ liệu và phương thức vào một đối tượng",
					isCorrect: false,
				},
				{
					id: "A93",
					content:
						"Encapsulation là quá trình tạo ra một đối tượng mới từ một lớp hiện có, trong khi abstraction là quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
				{
					id: "A94",
					content:
						"Encapsulation là quá trình kết nối các đối tượng với nhau, trong khi abstraction là quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
			],
		},
		{
			id: "Q10",
			content:
				"Khi nào bạn nên sử dụng kế thừa trong lập trình hướng đối tượng?",
			answers: [
				{
					id: "A101",
					content:
						"Luôn luôn, vì kế thừa là một nguyên tắc quan trọng trong lập trình hướng đối tượng",
					isCorrect: false,
				},
				{
					id: "A102",
					content:
						"Chỉ khi bạn muốn tái sử dụng mã nguồn từ một lớp khác",
					isCorrect: true,
				},
				{
					id: "A103",
					content:
						"Chỉ khi bạn muốn tạo ra một đối tượng mới từ một lớp hiện có",
					isCorrect: false,
				},
				{
					id: "A104",
					content:
						"Khi bạn muốn chia nhỏ một đối tượng thành các phần nhỏ hơn",
					isCorrect: false,
				},
			],
		},
	];
	const [stores, setStores] = useState(lstQuestion);

	const handleDragAndDrop = (results) => {
		const { source, destination, type } = results;

		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		)
			return;

		if (type === "group") {
			const reorderedStores = [...stores];

			const storeSourceIndex = source.index;
			const storeDestinatonIndex = destination.index;

			const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
			reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

			return setStores(reorderedStores);
		}
		const itemSourceIndex = source.index;
		const itemDestinationIndex = destination.index;

		const storeSourceIndex = stores.findIndex(
			(store) => store.id === source.droppableId
		);
		const storeDestinationIndex = stores.findIndex(
			(store) => store.id === destination.droppableId
		);

		const newSourceItems = [...stores[storeSourceIndex].answers];
		const newDestinationItems =
			source.droppableId !== destination.droppableId
				? [...stores[storeDestinationIndex].answers]
				: newSourceItems;

		const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
		newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

		const newStores = [...stores];

		newStores[storeSourceIndex] = {
			...stores[storeSourceIndex],
			answers: newSourceItems,
		};
		newStores[storeDestinationIndex] = {
			...stores[storeDestinationIndex],
			answers: newDestinationItems,
		};

		setStores(newStores);
	};
	let sentParam = stores.map((item, index) => {
		return {
			questionId: item.id,
			questionNo: index + 1,
			answers: item.answers.map((ans, ansNo) => {
				return {
					answersId: ans.id,
					answersNo: ansNo + 1,
				};
			}),
		};
	});
	console.log(sentParam);

	return (
		<div className="test-preview">
			<div className="test-top">
				<div className="test-bgd">
					<p>BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
					<p className="text-bold">ĐẠI HỌC BÁCH KHOA HÀ NỘI</p>
				</div>
				<div className="test-semester">
					<p className="text-bold">ĐỀ THI CUỐI KỲ</p>
					<p className="text-bold">{`HỌC KỲ:`} </p>
				</div>
			</div>
			<div className="test-header-content">
				<div className="test-header-content-left">
					<p>Hình thức tổ chức thi: Trắc nghiệm</p>
					<p>{`Mã học phần: `}</p>
					<p>{`Tên học phần: `}</p>
					<p>{`Lớp thi: `}</p>
				</div>
				<div className="test-header-content-right">
					<p className="text-bold">{`Thời gian làm bài:  phút`}</p>
					<p className="non-ref">(Không sử dụng tài liệu)</p>
					<p className="text-bold">{`Mã đề:`}</p>
				</div>
			</div>
			<DragDropContext onDragEnd={handleDragAndDrop}>
				<Droppable droppableId="ROOT" type="group">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{stores.map((store, index) => (
								<Draggable
									draggableId={store.id}
									index={index}
									key={store.id}
								>
									{(provided) => (
										<div
											{...provided.dragHandleProps}
											{...provided.draggableProps}
											ref={provided.innerRef}
										>
											<StoreList
												{...store}
												index={index}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<div className="test-footer">
				<div className="test-end">
					<p>(Cán bộ coi thi không giải thích gì thêm)</p>
					<p className="text-bold">HẾT</p>
				</div>
				<div className="test-sig">
					<div className="sig-left">
						<p className="text-bold">DUYỆT CỦA KHOA/BỘ MÔN</p>
						<p>(Ký tên, ghi rõ họ tên)</p>
					</div>
					<div className="sig-right">
						<p>Hà Nội, ngày...tháng...năm...</p>
						<p className="text-bold">GIẢNG VIÊN RA ĐỀ</p>
						<p>(Ký tên, ghi rõ họ tên)</p>
					</div>
				</div>
				<div className="test-note">
					<p className="text-bold text-note">Lưu ý:</p>
					<p>{`-	Sử dụng khổ giấy A4;`}</p>
					<p>{`-	Phiếu trả lời trắc nghiệm theo mẫu của TTKT;`}</p>
					<p>{`-	Phải thể hiện số thứ tự trang nếu số trang lớn hơn 1;`}</p>
					<p>{`-	Thí sinh không được sử dụng tài liệu, mọi thắc mắc về đề thi vui lòng hỏi giám thị coi thi.`}</p>
				</div>
			</div>
		</div>
	);
};
function StoreList({ content, answers, id, index }) {
	return (
		<Droppable droppableId={id}>
			{(provided) => (
				<div {...provided.droppableProps} ref={provided.innerRef}>
					<div className="store-container">
						<h3>{`Câu ${index + 1}: ${content}`}</h3>
					</div>
					<div className="answers-container">
						{answers.map((item, index) => (
							<Draggable
								draggableId={item.id}
								index={index}
								key={item.id}
							>
								{(provided) => (
									<div
										className="item-container"
										{...provided.dragHandleProps}
										{...provided.draggableProps}
										ref={provided.innerRef}
									>
										<h3>{`${String.fromCharCode(
											65 + index
										)}. ${item.content}`}</h3>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}
export default TestEdit;
