package io.mrdong.resource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserResource {
    @GetMapping("/current")
    public Principal getCurrent(Principal principal) {
        return principal;
    }
}
