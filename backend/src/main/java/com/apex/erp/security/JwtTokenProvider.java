package com.apex.erp.security;

import com.apex.erp.config.AppProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final AppProperties appProperties;

    // ── Build signing key from config secret ──────────────────
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(
                appProperties.getJwt().getSecret().getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ── Generate access token ─────────────────────────────────
    public String generateAccessToken(CustomUserDetails userDetails) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime()
            + appProperties.getJwt().getAccessTokenExpiryMs());

        return Jwts.builder()
            .subject(String.valueOf(userDetails.getId()))
            .claim("email", userDetails.getEmail())
            .claim("role",  userDetails.getRole().name())
            .issuedAt(now)
            .expiration(expiry)
            .signWith(getSigningKey())
            .compact();
    }

    // ── Generate refresh token (UUID stored in DB) ────────────
    public String generateRefreshToken() {
        return java.util.UUID.randomUUID().toString();
    }

    // ── Extract user ID from token ────────────────────────────
    public Long getUserIdFromToken(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    // ── Extract email from token ──────────────────────────────
    public String getEmailFromToken(String token) {
        return parseClaims(token).get("email", String.class);
    }

    // ── Extract role from token ───────────────────────────────
    public String getRoleFromToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // ── Validate token ────────────────────────────────────────
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT malformed: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("JWT signature invalid: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims empty: {}", e.getMessage());
        }
        return false;
    }

    // ── Internal: parse and return claims ────────────────────
    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}