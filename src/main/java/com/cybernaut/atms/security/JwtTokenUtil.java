package com.cybernaut.atms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {
   private String secret = "your_secret_key"; // Use a secure key

   public String generateToken(String username) {
       Map<String, Object> claims = new HashMap<>();
       return Jwts.builder()
               .setClaims(claims)
               .setSubject(username)
               .setIssuedAt(new Date(System.currentTimeMillis()))
               .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
               .signWith(SignatureAlgorithm.HS256, secret)
               .compact();
   }

   public Boolean validateToken(String token, String username) {
       final String extractedUsername = getUsernameFromToken(token);
       return (extractedUsername.equals(username) && !isTokenExpired(token));
   }

   public String getUsernameFromToken(String token) {
       return getClaimsFromToken(token).getSubject();
   }

   private Claims getClaimsFromToken(String token) {
       return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
   }

   private Boolean isTokenExpired(String token) {
       final Date expiration = getClaimsFromToken(token).getExpiration();
       return expiration.before(new Date());
   }
}
