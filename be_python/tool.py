
import numpy as np
import cv2


# ============================================ CONSTANT =======================================

warning_color = (78, 173, 240)
blue_color = (255, 0, 0)
red_color = (0, 0, 255)
green_color = (0, 255, 0)
threshold_warning = 0.7

# ============================================ FUNCTION =======================================

def order_points(pts):
    rect = np.zeros((4, 2), dtype="float32")
    pts = np.array(pts)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect.astype("int").tolist()


def find_dest(pts):
    (tl, tr, br, bl) = pts
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    destination_corners = [[0, 0], [maxWidth, 0], [maxWidth, maxHeight], [0, maxHeight]]
    return order_points(destination_corners)


def generate_output(image: np.array, corners: list, scale: tuple = None, resize_shape: int = 640):
    corners = order_points(corners)
    if scale is not None:
        print(np.array(corners).shape, scale)
        corners = np.multiply(corners, scale)

    destination_corners = find_dest(corners)
    M = cv2.getPerspectiveTransform(np.float32(corners), np.float32(destination_corners))
    out = cv2.warpPerspective(image, M, (destination_corners[2][0], destination_corners[2][1]), flags=cv2.INTER_LANCZOS4)
    out = np.clip(out, a_min=0, a_max=255)
    out = out.astype(np.uint8)
    return out



# Get string class from number class
def get_class(argument):
    if argument == 0:
        return ""
    elif argument == 1:
        return "A"
    elif argument == 2:
        return "B"
    elif argument == 3:
        return "C"
    elif argument == 4:
        return "D"
    elif argument == 5:
        return "AB"
    elif argument == 6:
        return "AC"
    elif argument == 7:
        return "AD"
    elif argument == 8:
        return "BC"
    elif argument == 9:
        return "BD"
    elif argument == 10:
        return "CD"
    elif argument == 11:
        return "ABC"
    elif argument == 12:
        return "ABD"
    elif argument == 13:
        return "ACD"
    elif argument == 14:
        return "BCD"
    elif argument == 15:
        return "ACBD"
    elif argument == 16:
        return "0"
    elif argument == 17:
        return "1"
    elif argument == 18:
        return "2"
    elif argument == 19:
        return "3"
    elif argument == 20:
        return "4"
    elif argument == 21:
        return "5"
    elif argument == 22:
        return "6"
    elif argument == 23:
        return "7"
    elif argument == 24:
        return "8"
    elif argument == 25:
        return "9"
    elif argument == 26:
        return "x"
    elif argument == 27:
        return "marker1"  
    elif argument == 28:
        return "marker2"  
    else:
        return ""


# Remove label duplicate
def remove_elements_info(arr):
    result = []
    i = 0
    while i < len(arr):
        item = arr[i]
        result.append(item)
        j = i + 1
        while j < len(arr) and abs(item[0] - arr[j][0]) <= 5:
            if arr[j][5] > item[5]:
                result.pop()  # Loại bỏ phần tử đã thêm trước đó
                break
            j += 1
        i = j
    return result


def remove_elements_answer(arr):
    result = []
    i = 0
    while i < len(arr):
        item = arr[i]
        result.append(item)
        j = i + 1
        while j < len(arr) and abs(item[1] - arr[j][1]) <= 5:
            if arr[j][5] > item[5]:
                result.pop()  # Loại bỏ phần tử đã thêm trước đó
                break
            j += 1
        i = j
    return result


#  Handles drawing rectangles over circled answers
def get_coordinates(x1, y1, x2, y2, class1):
    point1 = x1
    point2 = y1
    point3 = y1
    point4 = y2
    if class1 == "":
        point1 = x1
        point2 = y1
        point3 = x1
        point4 = y1
    elif class1 == "A":
        point1 = x1 - 5
        point2 = y1 - 3
        point3 = x1 + int((x2 - x1) / 4) - 13
        point4 = y1 + int((y2 - y1))
    elif class1 == "B":
        point1 = x1 + 37
        point2 = y1
        point3 = x1 + int((x2 - x1) / 4) + 25
        point4 = y1 + int((y2 - y1))
    elif class1 == "C":
        point1 = x1 + 80
        point2 = y1
        point3 = x1 + int((x2 - x1) / 4) + 68
        point4 = y1 + int((y2 - y1))
    elif class1 == "D":
        point1 = x1 + 123
        point2 = y1
        point3 = x1 + int((x2 - x1) / 4) + 113
        point4 = y1 + int((y2 - y1))
    return point1, point2, point3, point4


def get_coordinates_info(x1, y1, x2, y2, class1):
    point1 = x1
    point2 = y1
    point3 = y1
    point4 = y2
    if class1 == "0":
        point1 = x1
        point2 = y1
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9)
    elif class1 == "1":
        point1 = x1
        point2 = y1 + 38
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38
    elif class1 == "2":
        point1 = x1
        point2 = y1 + 38 * 2
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 2
    elif class1 == "3":
        point1 = x1
        point2 = y1 + 38 * 3
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 3
    elif class1 == "4":
        point1 = x1
        point2 = y1 + 38 * 4
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 4
    elif class1 == "5":
        point1 = x1
        point2 = y1 + 38 * 5
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 5
    elif class1 == "6":
        point1 = x1
        point2 = y1 + 38 * 6
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 6
    elif class1 == "7":
        point1 = x1
        point2 = y1 + 38 * 7
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 7
    elif class1 == "8":
        point1 = x1
        point2 = y1 + 38 * 8
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 8
    elif class1 == "9":
        point1 = x1
        point2 = y1 + 38 * 9
        point3 = x2
        point4 = y1 + int((y2 - y1) / 9) + 38 * 9
    elif class1 == "x":
        point1 = x1
        point2 = y1
        point3 = x2
        point4 = y2
    return point1, point2, point3, point4


#  Handle the number of questions is not fixed
def get_parameter_number_anwser(numberAnswer):
    naturalParts = numberAnswer // 20
    return naturalParts


def get_remainder(numberAnswer):
    remainder = numberAnswer % 20
    return remainder



# Hàm xoay ảnh trong trường hợp không ghép 3 marker thành 1 ảnh và vẽ các hình chữ nhật lên ảnh marker 

# def imageOrientation(img, imgOriented, model):
#     imgOriented = cv2.convertScaleAbs(imgOriented * 255)
#     height, width = imgOriented.shape[:2]
#     top_left = imgOriented[0:100, 0:100]
#     top_right = imgOriented[0:100, width-100:width]
#     bottom_left = imgOriented[height-100:height, 0:100]
#     bottom_right = imgOriented[height-100:height, width-100:width]
#     list_img = [top_left, top_right, bottom_left, bottom_right]
    
#     notMarker = -1
#     list_img_marker = []
#     for i, item in enumerate(list_img):
#         result = model.predict(item)
#         data = result[0].boxes.data
#         if (len(data) == 0):
#             notMarker = i + 1
#         else: 
#             data = result[0].boxes.data.tolist()[0]
#             toado = result[0].boxes.xyxy[0].tolist()
#             x1 = round(toado[0])
#             y1 = round(toado[1])
#             x2 = round(toado[2])
#             y2 = round(toado[3])
#             class_answer = int(data[5])
#             conf = round(float(data[4]), 3)
#             cv2.rectangle(item,(x1, y1), (x2, y2),
#                     green_color if conf > threshold_warning else warning_color, 1 if conf > threshold_warning else 2)
#             cv2.putText(item,
#                     str(tool.getClass(class_answer)) if conf > threshold_warning else str(f"{tool.getClass(class_answer)}-{conf}"), (x1, y1),
#                     cv2.FONT_HERSHEY_SIMPLEX, 0.4 if conf > threshold_warning else 0.5,
#                     blue_color if conf > threshold_warning else warning_color, 1, cv2.LINE_AA)
#             list_img_marker.append(item)
#     # Ảnh không bị xoay
#     if (notMarker == 4):
#         imgRotated = img
#     elif (notMarker == 3): # Ảnh bị xoay 90 độ về bên phải
#         imgRotated = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
#         imgRotated = cv2.resize(imgRotated, (1056, 1500))
#     elif (notMarker == 2): # Ảnh bị xoay 90 độ về bên trái
#         imgRotated = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
#         imgRotated = cv2.resize(imgRotated, (1056, 1500))
#     elif (notMarker == 1):  # Ảnh bị xoay 180 độ
#         imgRotated = cv2.rotate(img, cv2.ROTATE_180)
    
#     return imgRotated, list_img_marker