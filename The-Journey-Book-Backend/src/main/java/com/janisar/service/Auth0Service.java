package com.janisar.service;

import com.auth0.client.auth.AuthAPI;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.json.auth.UserInfo;
import com.auth0.net.TokenRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Auth0Service {

    @Value("${auth0.domain}")
    private String domain;

    @Value("${auth0.clientId}")
    private String clientId;

    @Value("${auth0.clientSecret}")
    private String clientSecret;

    @Value("${frontend.oauth2.success-url:https://the-journey-book.netlify.app/oauth2-success}")
    private String defaultRedirectUri;

    private AuthAPI getAuthAPI() {
        return new AuthAPI(domain, clientId, clientSecret);
    }

    public String getAuthorizationUrl(String redirectUri) {
        String actualRedirectUri = redirectUri != null ? redirectUri : defaultRedirectUri;
        return getAuthAPI().authorizeUrl(actualRedirectUri)
                .withScope("openid profile email")
                .build();
    }

    public TokenHolder exchangeCodeForTokens(String code, String redirectUri) throws Auth0Exception {
        String actualRedirectUri = redirectUri != null ? redirectUri : defaultRedirectUri;
        TokenRequest tokenRequest = getAuthAPI().exchangeCode(code, actualRedirectUri);
        return tokenRequest.execute();
    }

    public UserInfo getUserInfo(String accessToken) throws Auth0Exception {
        return getAuthAPI().userInfo(accessToken).execute();
    }
}