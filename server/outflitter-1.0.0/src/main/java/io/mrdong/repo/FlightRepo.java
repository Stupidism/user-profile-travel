package io.mrdong.repo;

import io.mrdong.domain.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface FlightRepo extends MongoRepository<Flight, String> {
    List<Flight> findByUsername(@Param("username") String username);
}
