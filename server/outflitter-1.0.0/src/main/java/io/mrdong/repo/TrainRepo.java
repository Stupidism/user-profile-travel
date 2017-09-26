package io.mrdong.repo;

import io.mrdong.domain.Train;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface TrainRepo extends MongoRepository<Train, String> {
    List<Train> findByUsername(@Param("username") String username);
}
