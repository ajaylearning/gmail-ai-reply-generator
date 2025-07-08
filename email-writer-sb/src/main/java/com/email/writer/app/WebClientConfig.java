package com.email.writer.app;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.TrustManagerFactory;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        try {
            // --- Step 1: Load the default JRE truststore ---
            KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            // The default password for the JRE truststore is "changeit"
            char[] password = "changeit".toCharArray();
            String javaHome = System.getProperty("java.home");
            Path trustStorePath = Paths.get(javaHome, "lib", "security", "cacerts");
            try (InputStream is = Files.newInputStream(trustStorePath)) {
                trustStore.load(is, password);
            }

            // --- Step 2: Load and add the custom certificate from the classpath (if it exists) ---
            ClassPathResource resource = new ClassPathResource("google-api.cer");
            if (resource.exists()) {
                try (InputStream customCertStream = resource.getInputStream()) {
                    CertificateFactory cf = CertificateFactory.getInstance("X.509");
                    X509Certificate customCert = (X509Certificate) cf.generateCertificate(customCertStream);
                    // Add the custom certificate to our truststore instance, using a unique alias
                    trustStore.setCertificateEntry("custom-google-api-cert", customCert);
                }
            }

            // --- Step 3: Create a TrustManager that uses our combined truststore ---
            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(trustStore);

            // --- Step 4: Create an SslContext for the WebClient ---
            SslContext sslContext = SslContextBuilder.forClient()
                    .trustManager(tmf)
                    .build();
            HttpClient httpClient = HttpClient.create().secure(t -> t.sslContext(sslContext));

            return WebClient.builder()
                    .clientConnector(new ReactorClientHttpConnector(httpClient));

        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to configure WebClient with custom SSL context. SSL connections may fail. Reason: " + e.getMessage());
            // Fallback to the default WebClient builder if our custom SSL configuration fails
            return WebClient.builder();
        }
    }
} 