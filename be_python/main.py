import os
import cv2
import numpy as np
from ultralytics import YOLO
import argparse
import json
import time
from tool import generate_output, get_parameter_number_anwser, remove_elements_answer
from tool import get_class, get_coordinates, get_coordinates_info, remove_elements_info, get_remainder
from tool import warning_color, green_color, blue_color, threshold_warning



# ============================================ GET ANWSER =======================================
def calculate_new_coordinates(marker_coordinates, rect, param1, param2):
    matching_indices = np.where((marker_coordinates[:, :2] == rect).all(axis=1))
    c = marker_coordinates[matching_indices]
    c = c.flatten()
    new_array = np.array([(c[0] + c[2]) / 2 + param1, (c[1] + c[3]) / 2 + param2])
    return new_array



def orient_image_by_angle(pts, marker_coordinates):
    rect = np.zeros((4, 2), dtype="float32")
    marker_coordinates_true = []
    param = 40
    pts = np.array(pts)
    marker_coordinates = np.array(marker_coordinates)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)] # top-left
    marker_coordinates_true.append(calculate_new_coordinates(marker_coordinates, rect[0], -param, -param))
    rect[2] = pts[np.argmax(s)] # bottom-right
    marker_coordinates_true.append(calculate_new_coordinates(marker_coordinates, rect[2], param, param))
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)] # top-right
    marker_coordinates_true.append(calculate_new_coordinates(marker_coordinates, rect[1], param, -param))
    rect[3] = pts[np.argmax(diff)] # bottom-left
    marker_coordinates_true.append(calculate_new_coordinates(marker_coordinates, rect[3], -param, param))
    marker_coordinates_true = np.array([marker_coordinates_true]).reshape(-1, 1, 2)
    return rect.astype("int").tolist(), marker_coordinates_true



def get_marker(image, model, filename):
    try:
        results = model.predict(image)
        data = results[0].boxes.data
        list_marker = []
        marker_coordinates = []
        for i, data in enumerate(data):
            x1 = int(data[0])
            y1 = int(data[1])
            x2 = int(data[2])
            y2 = int(data[3])
            class_marker = int(data[5])
            conf = round(float(data[4]), 3)
            if (conf < threshold_warning - 0.1):
                continue
            if (class_marker == 28):
                marker2 = [x1, y1]
            list_marker.append([x1, y1])
            marker_coordinates.append([x1, y1, x2, y2])
            cv2.rectangle(image, (x1, y1), (x2, y2), green_color if conf > threshold_warning else warning_color,
                1 if conf > threshold_warning else 2)
            cv2.putText(image, str(get_class(class_marker)) if conf > threshold_warning else str(f"{get_class(class_marker)}-{conf}"),
                (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.4 if conf > threshold_warning else 0.5,
                blue_color if conf > threshold_warning else warning_color, 1,cv2.LINE_AA)
        # Handle errors
        if marker2 == [] or len(list_marker) != 4:
            raise Exception(f"Xem lại ảnh đầu vào {filename} có thể bị thiếu góc")
        oriented, marker_coordinates_true = orient_image_by_angle(list_marker, marker_coordinates)
        oritentation = ''
        # Ảnh bị xoay 90 độ về bên phải => marker 2 ở bottom-left
        if (marker2 == oriented[3]):
            oritentation = 'bl'
        # Ảnh không bị xoay => marker 2 ở bottom-right    
        if (marker2 == oriented[2]):  
            oritentation = 'br'
        # Ảnh bị xoay 90 độ về bên trái => marker 2 ở top-right    
        if (marker2 == oriented[1]):  
            oritentation = 'tr'
        # Ảnh bị xoay 180 => marker 2 ở top-left    
        if (marker2 == oriented[0]):
            oritentation = 'tl'
        corners = sorted(np.concatenate(marker_coordinates_true).tolist())
        output = generate_output(image, corners)
        return output, oritentation
    except Exception as e:
        print(e)
        return None, None

def crop_image(img, numberAnswer):
    ans_blocks = []
    arrayX = [30, 350, 660]
    for i in range(3):
        y = 480
        width = 350
        height = 896
        cropped_image = img[y: y + height, arrayX[i]: arrayX[i] + width]
        ans_blocks.append(cropped_image)
    sorted_ans_blocks = ans_blocks
    if numberAnswer == 20 or numberAnswer == 40 or numberAnswer == 60:
        numbers_question_pictures = get_parameter_number_anwser(numberAnswer)
    else:
        numbers_question_pictures = get_parameter_number_anwser(numberAnswer) + 1
    sorted_ans_blocks = sorted_ans_blocks[:numbers_question_pictures]
    sorted_ans_blocks_resize = []
    coord_array = []
    size_array = []
    for i, sorted_ans_block in enumerate(sorted_ans_blocks):
        img2 = sorted_ans_block[0]
        width, height = img2.shape
        size_array.append((350, 896))
        img_resize = cv2.resize(sorted_ans_block, (250, 640), interpolation=cv2.INTER_AREA)
        # cv2.imshow("answersheet", img_resize)
        # cv2.waitKey(0)
        sorted_ans_blocks_resize.append(img_resize)
        coord_array.append((arrayX[i], 480))

    return sorted_ans_blocks_resize, size_array, coord_array


def predictAns(img, model, index, numberAnswer):
    results = model.predict(img)
    data = results[0].boxes.data
    list_label = []
    for i, data in enumerate(data):
        x1 = int(data[0])
        y1 = int(data[1])
        x2 = int(data[2])
        y2 = int(data[3])
        class_answer = int(data[5])
        conf = round(float(data[4]), 3)
        list_label.append((x1, y1, x2, y2, class_answer, conf))
    list_label = sorted(list_label, key=lambda x: x[1])
    list_label = remove_elements_answer(list_label)
    array_answer = []
    maybe_wrong_answer = []
    for i, answer in enumerate(list_label):
        if index == get_parameter_number_anwser(numberAnswer) and i == get_remainder(numberAnswer):
            break
        class_answer = get_class(answer[4])
        array_answer.append(class_answer)
        x1 = answer[0]
        y1 = answer[1]
        x2 = answer[2]
        y2 = answer[3]
        class_answer = answer[4]
        conf = answer[5]
        if conf < threshold_warning:
            maybe_wrong_answer.append(f'Kiểm tra lại nhãn "{get_class(class_answer)}" tại câu {i+1} ảnh {filename}, có xác suất: {conf}')
        for char in str(get_class(class_answer)):
            point1, point2, point3, point4 = get_coordinates(x1, y1, x2, y2, char)
            cv2.rectangle(img, (point1, point2), (point3, point4), green_color if conf > threshold_warning else warning_color,
                1 if conf > threshold_warning else 2)
            cv2.putText(img, str(char) if conf > threshold_warning else str(f"{get_class(class_answer)}-{conf}"),
                (point1, point2), cv2.FONT_HERSHEY_SIMPLEX, 0.4 if conf > threshold_warning else 0.5,
                blue_color if conf > threshold_warning else warning_color, 1,cv2.LINE_AA)
        img_graft = cv2.resize(img, (350, 896), interpolation=cv2.INTER_AREA)

    return array_answer, img_graft, maybe_wrong_answer


# ============================================ GET INFO =======================================

def crop_image_info(img):
    left = 550
    top = 0
    right = 1056
    bottom = 500
    cropped_image = img[top:bottom, left:right]
    cropped_image = cv2.convertScaleAbs(cropped_image * 255)
    img_resize = cv2.resize(cropped_image, (640, 640), interpolation=cv2.INTER_AREA)
    return img_resize

def predictInfo(img, model, filename):
    results = model.predict(img)
    data = results[0].boxes.data
    numberClassRecognition = len(data)
    list_label = []
    for i, data in enumerate(data):
        x1 = int(data[0])
        y1 = int(data[1])
        x2 = int(data[2])
        y2 = int(data[3])
        class_info = int(data[5])
        conf = round(float(data[4]), 3)
        list_label.append((x1, y1, x2, y2, class_info, conf))
    list_label = sorted(list_label, key=lambda x: x[0])
    list_label = remove_elements_info(list_label)
    dict_info = {}
    maybe_wrong_info = []
    for i, info in enumerate(list_label):
        class_info = get_class(info[4])
        dict_info[f"{i+1}"] = class_info
        x1 = info[0]
        y1 = info[1]
        x2 = info[2]
        y2 = info[3]
        class_info = info[4]
        conf = info[5]
        if conf < threshold_warning:
            maybe_wrong_info.append(f'Kiểm tra lại nhãn thứ {i} từ trái sang phải: "{get_class(class_info)}", có xác suất: {conf}, tại ảnh {filename}')

        point1, point2, point3, point4 = get_coordinates_info(x1, y1, x2, y2, get_class(class_info))
        cv2.rectangle(img, (point1, point2), (point3, point4), 
            green_color if conf > threshold_warning else warning_color, 1 if conf > threshold_warning else 2)
        cv2.putText(img, str(get_class(class_info)) if conf > threshold_warning else str(f"{get_class(class_info)}-{conf}"), 
            (point1, point2),cv2.FONT_HERSHEY_SIMPLEX,
            0.4 if conf > threshold_warning else 0.5, blue_color if conf > threshold_warning else warning_color, 1 ,cv2.LINE_AA,)
    if numberClassRecognition > 5:
        class_code = "".join([dict_info[str(i)] if str(i) not in dict_info or dict_info[str(i)] != "unchoice" else "x" for i in range(1, 7)])
        student_code = "".join(list(dict_info.values())[6:-3])
        exam_code = "".join(list(dict_info.values())[-3:])
        result_info = { "class_code": class_code, "student_code": student_code, "exam_code": exam_code}
        imgResize = cv2.resize(img, (506, 500), interpolation=cv2.INTER_AREA)
    elif numberClassRecognition <= 5:
        result_info = { "class_code": "", "student_code": "", "exam_code": ""}
        imgResize = cv2.resize(img, (506, 500), interpolation=cv2.INTER_AREA)

    return result_info, imgResize, numberClassRecognition, maybe_wrong_info

def mergeImages(filename, coord_array, array_img_graft, background_image, imgInfo):
    filename_cut = filename.split(".")[0]
    height, width, _ = imgInfo.shape
    background_image[0: 0 + height, 550: 550 + width] = imgInfo / 255
    
    for i in range(len(coord_array)):
        x_coord = coord_array[i][0]
        y_coord = coord_array[i][1]
        height, width, _ = array_img_graft[i].shape
        background_image[y_coord: y_coord + height, x_coord: x_coord + width] = array_img_graft[i] / 255
    cv2.imwrite(f"./images/answer_sheets/handle-{args.input}/handle-{filename_cut}.jpg", background_image * 255)


if __name__ == "__main__":
    # ========================== Đo thời gian ====================================
    # start_time = time.time()
    # ===================== Khai báo và load model ==============================
    pWeight = "./Model/best2810.pt"
    model = YOLO(pWeight)
    # ======================= Khai báo tham số truyền vào cmd  ===============================
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument("input", help="input")
    args = parser.parse_args()

    # ================= Tạo folder ảnh gốc và ảnh đã qua xử lý===============================
    folder_path = f"./images/answer_sheets/{args.input}"
    folder_path_handle = f"./images/answer_sheets/handle-{args.input}"
    if not os.path.exists(folder_path):
        try:
            os.makedirs(folder_path)
        except OSError:
            print(f"Lỗi: Không thể tạo thư mục {folder_path}.")
    if not os.path.exists(folder_path_handle):
        try:
            os.makedirs(folder_path_handle)
        except OSError:
            print(f"Lỗi: Không thể tạo thư mục {folder_path}.")

    # ================================= Chương trình chính=================================
    file_names = os.listdir(folder_path)
    file_names.sort()
    for filename in file_names:
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join(folder_path, filename)
            image = cv2.imread(image_path)
            document, oritentation = get_marker(image, model, filename)
            if (document is None):
                continue
            if oritentation == 'bl':
                document = cv2.rotate(document, cv2.ROTATE_90_COUNTERCLOCKWISE)
                document = cv2.resize(document, (1056, 1500), interpolation=cv2.INTER_AREA)
            elif oritentation == 'br':
                document = cv2.resize(document, (1056, 1500), interpolation=cv2.INTER_AREA)
            elif oritentation == 'tr':
                document = cv2.rotate(document, cv2.ROTATE_90_CLOCKWISE)
                document = cv2.resize(document, (1056, 1500), interpolation=cv2.INTER_AREA)
            elif oritentation == 'tl':
                document = cv2.rotate(document, cv2.ROTATE_180)
                document = cv2.resize(document, (1056, 1500), interpolation=cv2.INTER_AREA)
            document = document / 255
            # cv2.imwrite(f"document.jpg", document * 255)
            # ========================== Cắt ảnh sbd và mdt ===============================
            img_resize = crop_image_info(document)
            result_info, imgResize, numberClassRecognition, maybe_wrong_info = predictInfo(img=img_resize, model=model, filename=filename)
            numberAnswer = 60
            # =================================== Lấy đáp án ==============================
            result_answer, size_array, coord_array = crop_image(cv2.convertScaleAbs(document * 255), numberAnswer)
            list_answer = []
            array_img_graft = []
            maybe_wrong_answer_array = []
            for i, answer in enumerate(result_answer):
                selected_answer, img_graft, maybe_wrong_answer = predictAns(img=answer, model=model, index=i, numberAnswer=numberAnswer)
                list_answer = list_answer + selected_answer
                array_img_graft.append(img_graft)
                maybe_wrong_answer_array += maybe_wrong_answer

            # ================================= Format file json =============================
            array_result = []
            for key, value in enumerate(list_answer):
                item = {"questionNo": int(key) + 1, "isSelected": value}
                array_result.append(item)
                if key == (numberAnswer - 1):
                    break
            if len(result_info) == 3:
                result = {
                    "classCode": result_info["class_code"],
                    "studentCode": result_info["student_code"],
                    "testNo": result_info["exam_code"],
                    "answers": array_result,
                }
            # =============================== Ghi file json ==========================

            # file_path = f"json/{filename}/data.json"
            # dir_path = os.path.dirname(file_path)

            # if not os.path.exists(dir_path):
            #     os.makedirs(dir_path)
            # # Ghi dữ liệu từ điển vào tệp tin JSON
            # with open(file_path, "w") as file:
            #     json.dump(result, file)

            # =============================== Ghi file cảnh báo có thể sai ==========================
            if len(maybe_wrong_info) > 0 or len(maybe_wrong_answer_array) > 0:
                with open(f"./MayBeWrong/result-{filename}.txt", "w", encoding="utf-8") as f:
                    if len(maybe_wrong_info) > 0:
                        for string in maybe_wrong_info:
                            f.write(string + "\n")
                    if len(maybe_wrong_answer_array) > 0:
                        for string in maybe_wrong_answer_array:
                            f.write(string + "\n")

            # ============================= Ghép ảnh =====================================
            mergeImages(filename, coord_array, array_img_graft, background_image=document, imgInfo=imgResize)

        # ========================================= Đo thời gian ==========================
        # print("Thời gian thực thi: ", time.time() - start_time, " giây")
