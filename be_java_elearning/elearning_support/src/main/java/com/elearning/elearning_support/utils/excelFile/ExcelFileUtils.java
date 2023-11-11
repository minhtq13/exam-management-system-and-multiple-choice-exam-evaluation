package com.elearning.elearning_support.utils.excelFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import javax.sql.DataSource;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.postgresql.PGConnection;
import org.postgresql.copy.CopyManager;
import org.postgresql.core.BaseConnection;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import com.elearning.elearning_support.utils.DateUtils;
import com.elearning.elearning_support.utils.springCustom.SpringContextUtils;

@Component
public class ExcelFileUtils {

    /**
     * Get Response Stream CSV from InputStreamResource
     */
    public static ResponseEntity<InputStreamResource> getResponseCSVStream(InputStreamResource inputStreamResource){
        String fileName = String.format("Export_surgery_%s.csv", new SimpleDateFormat(DateUtils.FORMAT_DATE_YYYY_MMDD_HHMMSS).format(new Date()));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachments; filename=" + fileName)
            .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
            .body(inputStreamResource);
    }


    /**
     * createCSVFile from sql query
     */
    public static InputStreamResource createCSVFile(String headerQuery, String contentQuery) throws SQLException {
        DataSource dataSource = SpringContextUtils.getBean(DataSource.class);
        Connection connection = null;
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            connection = dataSource.getConnection();
            CopyManager copyManager = new CopyManager((BaseConnection) connection.unwrap(PGConnection.class));
            outputStream.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF}); // Add UTF-8 BOM marker bytes
            copyManager.copyOut("COPY ((" + headerQuery + ") UNION ALL (" + contentQuery + ")) TO STDOUT WITH (FORMAT CSV, ENCODING UTF8)", outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (Objects.nonNull(connection)) {
                connection.close();
            }
        }
        return new InputStreamResource(new ByteArrayInputStream(outputStream.toByteArray()));
    }

    /********************************************************************************************************************************************
     * Hỗ trợ import file excel từ database
     *******************************************************************************************************************************************/

    public static String getStringCellValue(Cell cell){
        if (Objects.isNull(cell))
            return "";
        switch (cell.getCellType()){
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue()).trim();
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()).trim();
            case FORMULA:
                return cell.getCellFormula().trim();
            default:
                return "";
        }
    }

    /**
     * Tạo cell với cellStyle và cellType
     */
    public static void createCellWithCellStyle(XSSFRow row, Integer cellIdx, CellStyle cellStyle, String cellValue) {
        XSSFCell newCell = row.createCell(cellIdx, CellType.STRING);
        newCell.setCellStyle(cellStyle);
        newCell.setCellValue(cellValue);
    }

    /**
     * Set border cell
     */
    public static void createBorderCellStyle(CellStyle cellStyle, BorderStyle borderStyle) {
        cellStyle.setBorderBottom(borderStyle);
        cellStyle.setBorderTop(borderStyle);
        cellStyle.setBorderLeft(borderStyle);
        cellStyle.setBorderRight(borderStyle);
    }



    /**
     * Format error excel file name
     */
    public static String getErrorFileName(String originalFileName, String errorFileName) {
        return String.format("%s_%s_%s.xlsx", originalFileName, errorFileName,
            new SimpleDateFormat(DateUtils.FORMAT_DATE_FILE_DD_MM_YYYY_HH_MM_SS).format(new Date()));
    }

}
