import os
import logging
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

logging.basicConfig(level=logging.DEBUG)

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
def index():
    return render_template('index.html')

@app.route('/log', methods=['POST'])
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
