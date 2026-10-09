package com.piyush.cms.controller;

import com.piyush.cms.dto.ApiResponse;
import com.piyush.cms.dto.AuthRequest;
import com.piyush.cms.dto.AuthResponse;
import com.piyush.cms.model.User;
import com.piyush.cms.repository.UserRepository;
import com.piyush.cms.security.JwtTokenProvider;
import com.piyush.cms.security.LoginAttemptService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          LoginAttemptService loginAttemptService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody AuthRequest loginRequest,
                                                                      HttpServletRequest request) {
        String clientIp = getClientIP(request);
        String lockKey = loginRequest.getUsername() + ":" + clientIp;

        if (loginAttemptService.isBlocked(lockKey)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApiResponse.error("Too many failed login attempts. Account temporarily locked for 15 minutes."));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            loginAttemptService.loginSucceeded(lockKey);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .or(() -> userRepository.findByEmail(loginRequest.getUsername()))
                    .orElse(null);

            AuthResponse authResponse = new AuthResponse(
                    jwt,
                    user != null ? user.getUsername() : loginRequest.getUsername(),
                    user != null ? user.getEmail() : "",
                    user != null ? user.getRole() : "ROLE_ADMIN"
            );

            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));

        } catch (BadCredentialsException ex) {
            loginAttemptService.loginFailed(lockKey);
            int remaining = loginAttemptService.getRemainingAttempts(lockKey);
            String msg = "Invalid username or password. " + (remaining > 0 ? "(" + remaining + " attempts remaining)" : "Account locked.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(msg));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null);

        return ResponseEntity.ok(ApiResponse.success(user));
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
