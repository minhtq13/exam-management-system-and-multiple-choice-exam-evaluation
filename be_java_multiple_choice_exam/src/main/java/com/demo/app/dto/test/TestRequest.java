package com.demo.app.dto.test;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestRequest {

    @NotBlank(message = "Please enter subject's code !")
    private String subjectCode;

    @JsonProperty("chapterOrders")
    private List<Integer> chapterIds;

    @Min(value = 1, message = "Question quantity must be greater than 1 !")
    @Max(value = 60, message = "Question quantity must be fewer than 60 !")
    private int questionQuantity;

    @NotBlank(message = "Please enter test day !")
    private String testDay;

    @NotBlank(message = "Please enter test time !")
    private String testTime;

    @Min(value = 1,message = "Total point must be greater than 0")
    @Max(value = 100, message = "Total point must be less than 100")
    private Integer totalPoint;

    @Min(value = 1, message = "Duration quantity must be greater than 1 !")
    private int duration;

}
