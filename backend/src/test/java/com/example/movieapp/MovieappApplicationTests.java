package com.example.movieapp;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class MovieappApplicationTests {

    @MockBean
    private JavaMailSender mailSender;  // Prevents real email initialization

    @Test
    public void contextLoads() {
        // This test now passes since mailSender is mocked
    }
}
