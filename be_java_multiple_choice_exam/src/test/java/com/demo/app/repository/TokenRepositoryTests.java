package com.demo.app.repository;

import com.demo.app.ProjectDesignIApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@DataJpaTest
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = ProjectDesignIApplication.class)
@AutoConfigureTestDatabase(replace= AutoConfigureTestDatabase.Replace.NONE)
public class TokenRepositoryTests {

    @Autowired
    private TokenRepository tokenRepository;

    private static final int USER_ID = 1;

    @Test
    public void TestFindAllValidTokenByUser(){
        var expectToken = tokenRepository.findAllValidTokenByUser(USER_ID);

    }

}
