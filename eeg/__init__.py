from .eeg import app
from .spindle import spindle_api

app.register_blueprint(spindle_api)