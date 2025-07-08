package com.email.writer;

import com.email.writer.app.EmailGeneratorController;
import com.email.writer.app.EmailGeneratorService;
import com.email.writer.app.EmailRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebFluxTest(EmailGeneratorController.class)
public class EmailGeneratorControllerTests {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private EmailGeneratorService emailGeneratorService;

    @Test
    public void testGenerateEmail() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("Test email content");
        request.setTone("Professional");

        when(emailGeneratorService.generateEmailReply(any(EmailRequest.class)))
                .thenReturn("Generated test reply");

        webTestClient.post().uri("/api/email/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("Generated test reply");
    }
} 