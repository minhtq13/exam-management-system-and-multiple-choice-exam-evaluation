package com.elearning.elearning_support.utils.excelFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import javax.sql.DataSource;
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

}
