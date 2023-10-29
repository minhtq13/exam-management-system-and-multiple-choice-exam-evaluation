package com.elearning.elearning_support.entities.mail;

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
@Table(name = "mail", schema = "elearning_support_dev")
public class Mail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 30)
    @NotNull
    @Column(name = "code", nullable = false, length = 30)
    private String code;

    @Column(name = "lst_to_address")
    @Type(type = "org.hibernate.type.TextType")
    private String lstToAddress;

    @NotNull
    @Column(name = "from_address", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String fromAddress;

    @NotNull
    @Column(name = "subject", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String subject;

    @NotNull
    @Column(name = "content", nullable = false)
    @Type(type = "org.hibernate.type.TextType")
    private String content;

    @NotNull
    @Column(name = "status", nullable = false)
    private Integer status;

    @NotNull
    @Column(name = "is_has_attachments", nullable = false)
    private Boolean isHasAttachments = false;

    @NotNull
    @Column(name = "sent_time", nullable = false)
    private Date sentTime;

}