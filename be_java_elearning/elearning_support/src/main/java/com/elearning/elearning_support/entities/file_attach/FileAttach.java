package com.elearning.elearning_support.entities.file_attach;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.Type;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "file_attach", schema = "elearning_support_dev")
public class FileAttach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String name;

    @NotNull
    @Column(name = "type", nullable = false)
    private Integer type;

    @Size(max = 10)
    @NotNull
    @Column(name = "file_ext", nullable = false, length = 10)
    private String fileExt;

    @Column(name = "size")
    private Integer size;

    @NotNull
    @Column(name = "stored_type", nullable = false)
    private Integer storedType;

    @NotNull
    @Column(name = "location", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String location;

    @NotNull
    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

}