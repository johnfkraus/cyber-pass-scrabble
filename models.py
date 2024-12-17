from datetime import datetime
from app import db

class GenerationLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    word_count = db.Column(db.Integer, nullable=False)
    min_length = db.Column(db.Integer, nullable=False)
    max_length = db.Column(db.Integer, nullable=False)
    delimiter = db.Column(db.String(10), nullable=False)
    count_generated = db.Column(db.Integer, nullable=False)
