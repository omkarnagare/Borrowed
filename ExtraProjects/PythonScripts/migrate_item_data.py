import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': 'borrowed-o20121991',
})

db = firestore.client()

users_ref = db.collection(u'users')
users = users_ref.stream()

for user in users:
    print(u'{} => {}'.format(user.id, user.to_dict()))

# items_ref = db.collection(u'items')
# items = items_ref.get('WVClwb6uxlg3WEkbvw567rTX2mr1').collection(u'items').stream()

# for item in items:
    # print(u'{} => {}'.format(item.id, item.to_dict()))