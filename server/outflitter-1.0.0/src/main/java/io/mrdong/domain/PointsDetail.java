package io.mrdong.domain;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class PointsDetail {
    @Id
    private ObjectId _id;
    private String date;

    public ObjectId get_id() {
        return _id;
    }

    public void set_id(ObjectId _id) {
        this._id = _id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(String expireDate) {
        this.expireDate = expireDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Long getBalance() {
        return balance;
    }

    public void setBalance(Long balance) {
        this.balance = balance;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBasicMileage() {
        return basicMileage;
    }

    public void setBasicMileage(String basicMileage) {
        this.basicMileage = basicMileage;
    }

    public String getMileage() {
        return mileage;
    }

    public void setMileage(String mileage) {
        this.mileage = mileage;
    }

    private String expireDate;
    private String source;
    private Long balance;
    private String username;
    private String basicMileage;
    private String mileage;

}
