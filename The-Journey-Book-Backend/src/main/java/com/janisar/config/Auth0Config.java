package com.janisar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
public class Auth0Config {

    @Value("${AUTH0_DOMAIN:dev-4x4wk6evx87nelgb.us.auth0.com}")
    private String domain;

    @Value("${AUTH0_CLIENT_ID:JOIxFAHVEkwHeKrCNMY3LTeyg62v1CNI}")
    private String clientId;

    @Value("${AUTH0_CLIENT_SECRET:Z6sZ8514y3kPh2_R0O_t7Awn87lZGCC-JVGctJryoxsdYk7UaKMLkV933IBXGje3}")
    private String clientSecret;

    @Value("${AUTH0_AUDIENCE:https://dev-4x4wk6evx87nelgb.us.auth0.com/api/v2/}")
    private String audience;

    public String getDomain() {
        return domain;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getAudience() {
        return audience;
    }
}