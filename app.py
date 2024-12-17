import os
import logging
from functools import wraps
from flask import Flask, render_template, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import geoip2.database
from geoip2.errors import AddressNotFoundError

logging.basicConfig(level=logging.DEBUG)

# List of embargoed countries (US sanctions list)
EMBARGOED_COUNTRIES = {
    'CU': 'Cuba',
    'IR': 'Iran',
    'KP': 'North Korea',
    'SY': 'Syria',
    'UA-43': 'Crimea region',
}

def check_embargo(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Get client IP
            ip_address = request.remote_addr
            
            # Use GeoIP2 database to get country
            with geoip2.database.Reader('/usr/share/GeoIP/GeoLite2-Country.mmdb') as reader:
                response = reader.country(ip_address)
                if response.country.iso_code in EMBARGOED_COUNTRIES:
                    app.logger.warning(f"Blocked request from embargoed country: {response.country.name}")
                    abort(403, f"Access denied from {response.country.name}")
        except (AddressNotFoundError, FileNotFoundError) as e:
            app.logger.error(f"GeoIP lookup error: {str(e)}")
            # Allow request to proceed if we can't determine the country
            pass
        return f(*args, **kwargs)
    return decorated_function

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "cyberpunk-password-gen-key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

db.init_app(app)

@app.route('/')
@check_embargo
def index():
    return render_template('index.html')

@app.route('/log', methods=['POST'])
@check_embargo
def log_generation():
    from models import GenerationLog
    
    data = request.get_json()
    log = GenerationLog(
        word_count=data.get('wordCount'),
        min_length=data.get('minLength'),
        max_length=data.get('maxLength'),
        delimiter=data.get('delimiter'),
        count_generated=data.get('countGenerated')
    )
    db.session.add(log)
    db.session.commit()
    return jsonify({"status": "success"})

with app.app_context():
    import models
    db.create_all()
