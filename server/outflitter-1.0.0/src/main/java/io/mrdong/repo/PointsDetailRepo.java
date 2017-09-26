package io.mrdong.repo;

import io.mrdong.domain.PointsDetail;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface PointsDetailRepo extends MongoRepository<PointsDetail, ObjectId> {
    List<PointsDetail> findByUsername(@Param("username") String username);
}
