package io.mrdong.repo;

import io.mrdong.domain.WechatQRCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface wechatQRCodeRepo extends MongoRepository<WechatQRCode, String> {
}
