package io.mrdong.domain;

import org.springframework.data.annotation.Id;

public class WechatQRCode {
    @Id
    private String _id;
    private String imgUrl;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
}
