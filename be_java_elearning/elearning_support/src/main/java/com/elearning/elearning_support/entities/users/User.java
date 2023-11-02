package com.elearning.elearning_support.entities.users;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import com.elearning.elearning_support.entities.BaseEntity;
import com.elearning.elearning_support.entities.role.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity implements Serializable {

    private static final long serialVersionUID = -1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Column(name = "identification_number", nullable = false)
    private String identificationNumber;

    @Column(name = "identity_type", nullable = false)
    private Integer identityType;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "birth_date")
    private Date birthDate;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "avatar_id")
    private String avatarId;

    @Column(name = "status")
    private Integer status;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "activation_key")
    String activationKey;

    @Column(name = "created_source")
    private Integer createdSource;

    @Column(name = "user_uuid")
    private UUID userUUID;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    Set<Role> roles = new HashSet<>();


    /**
     * Get fullname of user
     */
    public String getFullName(){
        String fullName = "";
        if(Objects.nonNull(this.lastName) && !this.lastName.isEmpty())
            fullName += this.lastName + " ";
        if(Objects.nonNull(this.firstName) && !this.lastName.isEmpty())
            fullName += this.firstName;
        return fullName;
    }

}