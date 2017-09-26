package io.mrdong.repo;

import io.mrdong.domain.Login;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LoginRepo extends MongoRepository<Login, String> {
}
