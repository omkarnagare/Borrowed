package com.nagare.balkrishna.omkar.utils;

import java.io.Serializable;

public class User implements Serializable{

	public User(String name, String email, String profileImage, String pin, int signedInWith) {
		super();
		this.name = name;
		this.email = email;
		this.profileImage = profileImage;
		this.pin = pin;
		this.signedInWith = signedInWith;
	}
	public User() {
		super();
	}
	private String name;
	private String email;
	private String profileImage;
	private String pin;
	private int signedInWith;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
	public String getPin() {
		return pin;
	}
	public void setPin(String pin) {
		this.pin = pin;
	}
	public int getSignedInWith() {
		return signedInWith;
	}
	public void setSignedInWith(int signedInWith) {
		this.signedInWith = signedInWith;
	}
	@Override
	public String toString() {
		return "User [name=" + name + ", email=" + email + ", profileImage=" + profileImage + ", pin=" + pin
				+ ", signedInWith=" + signedInWith + "]";
	}

}
