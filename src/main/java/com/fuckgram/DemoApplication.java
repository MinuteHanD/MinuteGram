package com.fuckgram;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration
@ComponentScan(basePackages = "com.fuckgram")
public class DemoApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().directory("../").load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		String dbUrl = dotenv.get("DB_URL", System.getenv("DB_URL"));
		String dbUsername = dotenv.get("DB_USERNAME", System.getenv("DB_USERNAME"));
		String dbPassword = dotenv.get("DB_PASSWORD", System.getenv("DB_PASSWORD"));
		String jwtSecret = dotenv.get("JWT_SECRET", System.getenv("JWT_SECRET"));
		String serverPort = dotenv.get("SERVER_PORT", System.getenv("SERVER_PORT"));
		String jwtExpiration = dotenv.get("JWT_EXPIRATION", System.getenv("JWT_EXPIRATION"));

// Set system properties
		System.setProperty("spring.datasource.url", dbUrl);
		System.setProperty("spring.datasource.username", dbUsername);
		System.setProperty("spring.datasource.password", dbPassword);
		System.setProperty("jwt.secret", jwtSecret);
		System.setProperty("server.port", serverPort);
		System.setProperty("jwt.expiration", jwtExpiration);
		SpringApplication.run(DemoApplication.class, args);

	}

}
