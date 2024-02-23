package com.elearning.elearning_support.entities.studentTest;

import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import com.elearning.elearning_support.entities.BaseEntity;
import com.elearning.elearning_support.entities.file_attach.FileAttach;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_test_set", schema = "elearning_support_dev")
public class StudentTestSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "test_set_id", nullable = false)
    private Long testSetId;

    @Column(name = "is_enabled")
    private Boolean isEnabled = Boolean.TRUE;

    @Column(name = "marker_rate")
    private Double markerRate;

    @Column(name = "marked")
    private Integer marked;

    @Size(max = 255)
    @Column(name = "state")
    private String state;

    @Column(name = "test_date")
    private Date testDate;

    @Column(name = "test_type")
    private Integer testType;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "handled_test_file", referencedColumnName = "id")
    private FileAttach handedTestFile;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "student_test_set_id", referencedColumnName = "id")
    List<StudentTestSetDetail> lstStudentTestSetDetail;

    public StudentTestSet(Long studentId, Long testSetId) {
        this.studentId = studentId;
        this.testSetId = testSetId;
    }
}