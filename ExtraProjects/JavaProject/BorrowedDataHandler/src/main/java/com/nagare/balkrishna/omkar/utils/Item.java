package com.nagare.balkrishna.omkar.utils;

import java.io.Serializable;

public class Item implements Serializable{

	private String itemId;
	private String itemName;
	private String itemDescription;
	private String borrowingDate;
	private String itemImage;
	private boolean isUrgent;
	private String lendeeName;
	private String lendeeContact;
	private String lendeeEmail;
	private boolean isActive;
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getItemDescription() {
		return itemDescription;
	}
	public void setItemDescription(String itemDescription) {
		this.itemDescription = itemDescription;
	}
	public String getBorrowingDate() {
		return borrowingDate;
	}
	public void setBorrowingDate(String borrowingDate) {
		this.borrowingDate = borrowingDate;
	}
	public String getItemImage() {
		return itemImage;
	}
	public void setItemImage(String itemImage) {
		this.itemImage = itemImage;
	}
	public boolean getIsUrgent() {
		return isUrgent;
	}
	public void setIsUrgent(boolean isUrgent) {
		this.isUrgent = isUrgent;
	}
	public String getLendeeName() {
		return lendeeName;
	}
	public void setLendeeName(String lendeeName) {
		this.lendeeName = lendeeName;
	}
	public String getLendeeContact() {
		return lendeeContact;
	}
	public void setLendeeContact(String lendeeContact) {
		this.lendeeContact = lendeeContact;
	}
	public String getLendeeEmail() {
		return lendeeEmail;
	}
	public void setLendeeEmail(String lendeeEmail) {
		this.lendeeEmail = lendeeEmail;
	}
	public boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(boolean isActive) {
		this.isActive = isActive;
	}
	@Override
	public String toString() {
		return "Item [itemId=" + itemId + ", itemName=" + itemName + ", itemDescription=" + itemDescription
				+ ", borrowingDate=" + borrowingDate + ", isUrgent=" + isUrgent + ", lendeeName=" + lendeeName
				+ ", lendeeContact=" + lendeeContact + ", lendeeEmail=" + lendeeEmail + ", isActive=" + isActive + "]";
	}
	public Item(String itemId, String itemName, String itemDescription, String borrowingDate, String itemImage,
			boolean isUrgent, String lendeeName, String lendeeContact, String lendeeEmail, boolean isActive) {
		super();
		this.itemId = itemId;
		this.itemName = itemName;
		this.itemDescription = itemDescription;
		this.borrowingDate = borrowingDate;
		this.itemImage = itemImage;
		this.isUrgent = isUrgent;
		this.lendeeName = lendeeName;
		this.lendeeContact = lendeeContact;
		this.lendeeEmail = lendeeEmail;
		this.isActive = isActive;
	}
	public Item() {
		super();
	}



}
