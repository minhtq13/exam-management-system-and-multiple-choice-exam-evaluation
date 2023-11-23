import { useState } from "react";
import "./TestEdit.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const TestEdit = ({ questions, testDetail, testNo }) => {
  const test = [
    {
      id: "Q1",
      name: "Trong phân tích thiết kế hướng đối tượng, đối tượng (object) là gì?",
      items: [
        {
          id: "A11",
          name: "Một thực thể trong cơ sở dữ liệu",
          isCorrect: false,
        },
        {
          id: "A12",
          name: "Một instance của một lớp, chứa dữ liệu và phương thức",
          isCorrect: true,
        },
        {
          id: "A13",
          name: "Một biến có thể thay đổi giá trị",
          isCorrect: false,
        },
        {
          id: "A14",
          name: "Một dòng mã nguồn thực hiện một chức năng cụ thể",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q2",
      name: "Encapsulation trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A21",
          name: "Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
        {
          id: "A22",
          name: "Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
          isCorrect: true,
        },
        {
          id: "A23",
          name: "Quá trình kết nối các đối tượng với nhau",
          isCorrect: false,
        },
        {
          id: "A24",
          name: "Quá trình tạo ra các instance của một lớp",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q3",
      name: "Inheritance (kế thừa) trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A31",
          name: "Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
        {
          id: "A32",
          name: "Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
          isCorrect: false,
        },
        {
          id: "A33",
          name: "Quá trình kết nối các đối tượng với nhau",
          isCorrect: false,
        },
        {
          id: "A34",
          name: "Quá trình lấy các thuộc tính và phương thức từ một lớp cha",
          isCorrect: true,
        },
      ],
    },
    {
      id: "Q4",
      name: "Polymorphism (đa hình) trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A41",
          name: "Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
        {
          id: "A42",
          name: "Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
          isCorrect: false,
        },
        {
          id: "A43",
          name: "Quá trình kết nối các đối tượng với nhau",
          isCorrect: false,
        },
        {
          id: "A44",
          name: "Khả năng một phương thức hoạt động theo nhiều cách khác nhau tùy thuộc vào ngữ cảnh",
          isCorrect: true,
        },
      ],
    },
    {
      id: "Q5",
      name: "Abstraction (trừu tượng hóa) trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A51",
          name: "Quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
        {
          id: "A52",
          name: "Quá trình bao gồm dữ liệu và phương thức vào một đối tượng",
          isCorrect: false,
        },
        {
          id: "A53",
          name: "Quá trình tạo ra các instance của một lớp",
          isCorrect: false,
        },
        {
          id: "A54",
          name: "Làm cho một đối tượng chỉ chứa những thông tin và phương thức cần thiết để thực hiện một nhiệm vụ cụ thể",
          isCorrect: true,
        },
      ],
    },
    {
      id: "Q6",
      name: "Interface trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A61",
          name: "Một thực thể trong cơ sở dữ liệu",
          isCorrect: false,
        },
        {
          id: "A62",
          name: "Một instance của một lớp, chứa dữ liệu và phương thức",
          isCorrect: false,
        },
        {
          id: "A63",
          name: "Một bản thiết kế của một lớp, xác định các phương thức mà lớp đó cần triển khai",
          isCorrect: true,
        },
        {
          id: "A64",
          name: "Một dòng mã nguồn thực hiện một chức năng cụ thể",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q7",
      name: "Constructor trong lập trình hướng đối tượng là gì?",
      items: [
        {
          id: "A71",
          name: "Một phương thức có sẵn trong mọi lớp",
          isCorrect: false,
        },
        {
          id: "A72",
          name: "Một phương thức dùng để tạo mới một instance của một lớp",
          isCorrect: true,
        },
        {
          id: "A73",
          name: "Một phương thức để kết nối các đối tượng",
          isCorrect: false,
        },
        {
          id: "A74",
          name: "Một phương thức để xóa một instance của lớp",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q8",
      name: "Đối tượng là gì trong ngữ cảnh của lập trình hướng đối tượng?",
      items: [
        {
          id: "A81",
          name: "Một biến có thể thay đổi giá trị",
          isCorrect: false,
        },
        {
          id: "A82",
          name: "Một instance của một lớp, chứa dữ liệu và phương thức",
          isCorrect: true,
        },
        {
          id: "A83",
          name: "Một thực thể trong cơ sở dữ liệu",
          isCorrect: false,
        },
        {
          id: "A84",
          name: "Một đoạn mã thực hiện một chức năng cụ thể",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q9",
      name: "Encapsulation và abstraction khác nhau như thế nào?",
      items: [
        {
          id: "A91",
          name: "Encapsulation là quá trình che giấu chi tiết bên trong của một đối tượng, trong khi abstraction là quá trình tạo ra một đối tượng trừu tượng chỉ chứa những thông tin và phương thức cần thiết",
          isCorrect: true,
        },
        {
          id: "A92",
          name: "Encapsulation là quá trình kế thừa thuộc tính từ một lớp cha, trong khi abstraction là quá trình đóng gói dữ liệu và phương thức vào một đối tượng",
          isCorrect: false,
        },
        {
          id: "A93",
          name: "Encapsulation là quá trình tạo ra một đối tượng mới từ một lớp hiện có, trong khi abstraction là quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
        {
          id: "A94",
          name: "Encapsulation là quá trình kết nối các đối tượng với nhau, trong khi abstraction là quá trình chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q10",
      name: "Khi nào bạn nên sử dụng kế thừa trong lập trình hướng đối tượng?",
      items: [
        {
          id: "A101",
          name: "Luôn luôn, vì kế thừa là một nguyên tắc quan trọng trong lập trình hướng đối tượng",
          isCorrect: false,
        },
        {
          id: "A102",
          name: "Chỉ khi bạn muốn tái sử dụng mã nguồn từ một lớp khác",
          isCorrect: true,
        },
        {
          id: "A103",
          name: "Chỉ khi bạn muốn tạo ra một đối tượng mới từ một lớp hiện có",
          isCorrect: false,
        },
        {
          id: "A104",
          name: "Khi bạn muốn chia nhỏ một đối tượng thành các phần nhỏ hơn",
          isCorrect: false,
        },
      ],
    },
  ];
  const [stores, setStores] = useState(test);

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

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

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
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {stores.map((store, index) => (
                <Draggable draggableId={store.id} index={index} key={store.id}>
                  {(provided) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <StoreList {...store} index={index} />
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
function StoreList({ name, items, id, index }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="store-container">
            <h3>{`Câu ${index + 1}: ${name}`}</h3>
          </div>
          <div className="items-container">
            {items.map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <div
                    className="item-container"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <h3>{`${String.fromCharCode(65 + index)}. ${item.name}`}</h3>
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
