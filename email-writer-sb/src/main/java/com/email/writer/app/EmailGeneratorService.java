package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){
        // build the prompt
        String prompt= buildPrompt(emailRequest);
        // craft a request
        Map<String , Object> requestBody= Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts",new Object[]{
                                        Map.of(
                                                "text", prompt
                                        )
                                }
                        )
                });
        // do request ans get response

        try {
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("x-goog-api-key", geminiApiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // return response
            return extractResponseContent(response);
        } catch (WebClientResponseException e) {
            // Handle API errors (e.g., 4xx, 5xx)
            throw new AIApiException("Error from AI service: " + e.getResponseBodyAsString(), e);
        } catch (WebClientRequestException e) {
            // Handle network/connectivity errors
            throw new AIApiException("Failed to connect to AI service.", e);
        }
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        }catch(Exception e){
            throw new AIApiException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(" Generate a professional email reply for the following email and do not mention the subject of the email");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\n Original Email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
