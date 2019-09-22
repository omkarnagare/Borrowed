package com.nagare.balkrishna.omkar;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.nagare.balkrishna.omkar.utils.Item;
import com.nagare.balkrishna.omkar.utils.User;

public class BorrowedDataHandler {

	public static void main(String[] args) throws IOException, InterruptedException, ExecutionException {
//		BorrowedDataHandler.readCollection("users", User.class);
//		BorrowedDataHandler.getAllItemsForUser("WVClwb6uxlg3WEkbvw567rTX2mr1");
		
//		List<String> userIdsWhoHasItems = BorrowedDataHandler.readAllDocumentIds("items");
//		for(String userId: userIdsWhoHasItems) {
//			System.out.println("userId: " + userId);
//		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		BorrowedDataHandler.updateItemsForUser("WVClwb6uxlg3WEkbvw567rTX2mr1", data);
		
	}

	public static Firestore setUpDB() throws IOException {
		// to run this --> environment variable for GOOGLE_APPLICATION_CREDENTIALS has to be set with json
		// Use the application default credentials
		GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
		FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(credentials)
				.setDatabaseUrl("https://borrowed-o20121991.firebaseio.com")
				.setProjectId("borrowed-o20121991")
				.build();
		FirebaseApp.initializeApp(options);

		return FirestoreClient.getFirestore();
	}

	@SuppressWarnings("unchecked")
	public static void readCollection(String collectionName, Class classType) throws IOException, InterruptedException, ExecutionException {

		Firestore db = BorrowedDataHandler.setUpDB();
		// asynchronously retrieve all users
		ApiFuture<QuerySnapshot> query = db.collection("users").get();
		// ...
		// query.get() blocks on response
		QuerySnapshot querySnapshot = query.get();
		List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
		for (QueryDocumentSnapshot document : documents) {
			System.out.println("Id: " + document.getId());
			System.out.println("document: " + document.toObject(classType).toString());
		}
	}
	
	@SuppressWarnings("unchecked")
	public static List<String> readAllDocumentIds(String collectionName) throws IOException, InterruptedException, ExecutionException {

		List<String> ids = new ArrayList<String>();
		Firestore db = BorrowedDataHandler.setUpDB();
		// asynchronously retrieve all users
		ApiFuture<QuerySnapshot> query = db.collection("users").get();
		// ...
		// query.get() blocks on response
		QuerySnapshot querySnapshot = query.get();
		List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
		for (QueryDocumentSnapshot document : documents) {
			ids.add(document.getId());
		}
		return ids;
	}

	@SuppressWarnings("deprecation")
	public static void getAllItemsForUser(String userId) throws IOException, InterruptedException, ExecutionException {
		Firestore db = BorrowedDataHandler.setUpDB();

		ApiFuture<QuerySnapshot> query =
				db.collection("items").document(userId).collection("items").get();

		QuerySnapshot querySnapshot = query.get();
		List<QueryDocumentSnapshot> items = querySnapshot.getDocuments();
		for (QueryDocumentSnapshot item : items) {
			System.out.println("Id: " + item.getId());
			System.out.println("document: " + item.toObject(Item.class).toString());
		}
	}
	
	@SuppressWarnings("deprecation")
	public static void updateItemsForUser(String userId, Map<String, Object> data) throws IOException, InterruptedException, ExecutionException {
		Firestore db = BorrowedDataHandler.setUpDB();

		ApiFuture<QuerySnapshot> query =
				db.collection("items").document(userId).collection("items").get();

		QuerySnapshot querySnapshot = query.get();
		List<QueryDocumentSnapshot> items = querySnapshot.getDocuments();
		for (QueryDocumentSnapshot item : items) {
			String itemId = item.getId();
			Item itemObject = item.toObject(Item.class);
			
			data.put("date", itemObject.getBorrowingDate());
			
			
			DocumentReference itemRef = db.collection("items").document(userId).collection("items").document(itemId);
			ApiFuture<WriteResult> result = itemRef.update(data);
			System.out.println("item data updated at: "+ result.get().getUpdateTime());
		}
	}

}
