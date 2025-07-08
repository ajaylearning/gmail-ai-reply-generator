package com.email.writer;

import com.email.writer.app.EmailGeneratorService;
import com.email.writer.app.EmailRequest;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;


@SpringBootTest
public class EmailGeneratorServiceTests {

    @Autowired
    private EmailGeneratorService emailGeneratorService;

    @RegisterExtension
    static WireMockExtension wireMockServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("gemini.api.url", wireMockServer::baseUrl);
        registry.add("gemini.api.key", () -> "test-api-key");
    }

    @BeforeEach
    void setUp() {
        wireMockServer.resetAll();
    }

    @Test
    void whenGenerateEmailReply_withValidRequest_returnsSuccessfully() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("This is a test email.");
        request.setTone("Professional");

        String mockApiResponse = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "This is a professional reply."
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        wireMockServer.stubFor(post(urlEqualTo("/"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(mockApiResponse)
                )
        );

        String reply = emailGeneratorService.generateEmailReply(request);

        assertThat(reply).isEqualTo("This is a professional reply.");
    }

    @Test
    void whenGenerateEmailReply_withApiError_throwsException() {
        EmailRequest request = new EmailRequest();
        request.setEmailContent("This email will cause an error.");
        request.setTone("Casual");

        wireMockServer.stubFor(post(urlEqualTo("/"))
                .willReturn(aResponse()
                        .withStatus(500)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"error\": \"Internal Server Error\"}")
                )
        );

        assertThrows(WebClientResponseException.InternalServerError.class, () -> {
            emailGeneratorService.generateEmailReply(request);
        });
    }
} 