

import boto3
import os
import uuid
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import logging
from functools import wraps

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif', '.pdf', '.txt', '.doc', '.docx']
app.config['S3_BUCKET'] = os.getenv('S3_BUCKET', 'security-uploads-bucket')
app.config['S3_REGION'] = os.getenv('S3_REGION', 'us-east-1')
app.config['AWS_ACCESS_KEY_ID'] = os.getenv('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.getenv('AWS_SECRET_ACCESS_KEY')

s3_client = boto3.client(
    's3',
    aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY'],
    region_name=app.config['S3_REGION']
)

uploaded_files = []

def allowed_file(filename):
    
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in [ext[1:] for ext in app.config['UPLOAD_EXTENSIONS']]

def generate_presigned_url(bucket_name, object_key, expiration=3600):
    
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=expiration
        )
        return url
    except Exception as e:
        logger.error(f"Error generating presigned URL: {e}")
        return None

def api_key_required(f):
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != os.getenv('API_KEY', 'your-secret-api-key'):
            return jsonify({'error': 'Invalid or missing API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/health', methods=['GET'])
def health_check():
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'AWS S3 Upload Service',
        'version': '1.0.0'
    })

@app.route('/api/upload', methods=['POST'])
@api_key_required
def upload_file():
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        

        original_filename = secure_filename(file.filename)
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        

        try:
            s3_client.upload_fileobj(
                file,
                app.config['S3_BUCKET'],
                unique_filename,
                ExtraArgs={
                    'ContentType': file.content_type or 'application/octet-stream',
                    'Metadata': {
                        'original-filename': original_filename,
                        'upload-time': datetime.now().isoformat()
                    }
                }
            )
            

            file_url = generate_presigned_url(app.config['S3_BUCKET'], unique_filename)
            

            file_info = {
                'id': len(uploaded_files) + 1,
                'original_filename': original_filename,
                's3_key': unique_filename,
                'bucket': app.config['S3_BUCKET'],
                'size': file.content_length,
                'content_type': file.content_type,
                'upload_time': datetime.now().isoformat(),
                'url': file_url
            }
            
            uploaded_files.append(file_info)
            
            logger.info(f"File uploaded successfully: {original_filename}")
            
            return jsonify({
                'message': 'File uploaded successfully',
                'file': file_info
            }), 201
            
        except Exception as e:
            logger.error(f"S3 upload error: {e}")
            return jsonify({'error': 'Failed to upload file to S3'}), 500
            
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/files', methods=['GET'])
@api_key_required
def list_files():
    
    try:

        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        

        start = (page - 1) * per_page
        end = start + per_page
        paginated_files = uploaded_files[start:end]
        
        return jsonify({
            'files': paginated_files,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': len(uploaded_files),
                'pages': (len(uploaded_files) + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        logger.error(f"List files error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/files/<int:file_id>', methods=['GET'])
@api_key_required
def get_file(file_id):
    
    try:
        file_info = next((f for f in uploaded_files if f['id'] == file_id), None)
        
        if not file_info:
            return jsonify({'error': 'File not found'}), 404
        

        file_url = generate_presigned_url(file_info['bucket'], file_info['s3_key'])
        file_info['url'] = file_url
        
        return jsonify({'file': file_info})
        
    except Exception as e:
        logger.error(f"Get file error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
@api_key_required
def delete_file(file_id):
    
    try:
        file_info = next((f for f in uploaded_files if f['id'] == file_id), None)
        
        if not file_info:
            return jsonify({'error': 'File not found'}), 404
        

        s3_client.delete_object(
            Bucket=file_info['bucket'],
            Key=file_info['s3_key']
        )
        

        uploaded_files.remove(file_info)
        
        logger.info(f"File deleted successfully: {file_info['original_filename']}")
        
        return jsonify({'message': 'File deleted successfully'})
        
    except Exception as e:
        logger.error(f"Delete file error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/stats', methods=['GET'])
@api_key_required
def get_stats():
    
    try:
        total_files = len(uploaded_files)
        total_size = sum(f['size'] for f in uploaded_files)
        

        file_types = {}
        for file_info in uploaded_files:
            ext = os.path.splitext(file_info['original_filename'])[1].lower()
            file_types[ext] = file_types.get(ext, 0) + 1
        
        return jsonify({
            'total_files': total_files,
            'total_size': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'file_types': file_types,
            'last_upload': uploaded_files[-1]['upload_time'] if uploaded_files else None
        })
        
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(413)
def too_large(e):
    
    return jsonify({'error': 'File too large'}), 413

@app.errorhandler(404)
def not_found(e):
    
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    
    logger.error(f"Internal server error: {e}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':

    required_vars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing environment variables: {missing_vars}")
        exit(1)
    

    try:
        s3_client.head_bucket(Bucket=app.config['S3_BUCKET'])
        logger.info(f"Successfully connected to S3 bucket: {app.config['S3_BUCKET']}")
    except Exception as e:
        logger.error(f"Failed to connect to S3 bucket: {e}")
        exit(1)
    
    app.run(host='0.0.0.0', port=5000, debug=False)
