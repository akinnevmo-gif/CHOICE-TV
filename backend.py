from flask import Flask, request, jsonify
from google.cloud import firestore
from google.cloud import storage

app = Flask(__name__)

db = firestore.Client()
storage_client = storage.Client()
BUCKET_NAME = "choice-tv-6fb5a.appspot.com"

@app.route('/api/uploads', methods=['GET'])
def get_uploads():
    user = request.args.get('user')
    type_ = request.args.get('type')
    query_ref = db.collection('user_uploads')
    if user:
        query_ref = query_ref.where('uploader', '==', user)
    if type_:
        query_ref = query_ref.where('type', '==', type_)
    results = [doc.to_dict() for doc in query_ref.stream()]
    return jsonify(results)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    type_ = request.form['type']
    title = request.form['title']
    desc = request.form.get('desc', '')
    uploader = request.form['uploader']
    filename = f"{type_}/{file.filename}"
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    url = blob.public_url
    db.collection('user_uploads').add({
        'type': type_,
        'title': title,
        'desc': desc,
        'url': url,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'uploader': uploader
    })
    return jsonify({'success': True, 'url': url})

if __name__ == '__main__':
    app.run(debug=True)
