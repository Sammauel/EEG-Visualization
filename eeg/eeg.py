# all the imports
import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, send_from_directory

import numpy as np
import mne
# %matplotlib inline
import matplotlib.pyplot as plt
import scipy 
from scipy.stats import hmean,trim_mean
import pandas as pd

app = Flask(__name__, static_folder='static') # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'eeg.db'),
    SECRET_KEY='c2NQEROndfk23KlO3',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('EEG_SETTINGS', silent=True)

def connect_db():
  """Connects to the specific database."""
  rv = sqlite3.connect(app.config['DATABASE'])
  rv.row_factory = sqlite3.Row
  return rv

def init_db():
  db = get_db()
  with app.open_resource('schema.sql', mode='r') as f:
    db.cursor().executescript(f.read())
  db.commit()

@app.cli.command('initdb')
def initdb_command():
  """Initializes the database."""
  init_db()
  print('Initialized the database.')

def get_db():
  """Opens a new database connection if there is none yet for the
  current application context.
  """
  if not hasattr(g, 'sqlite_db'):
    g.sqlite_db = connect_db()
  return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
  """Closes the database again at the end of the request."""
  if hasattr(g, 'sqlite_db'):
    g.sqlite_db.close()


@app.route('/')
def index():
  """Render the index page"""
  return render_template('index.html')

@app.route('/csv/<filename>')
def send_csv(filename):
  """Serve csv file to client from server"""
  return send_from_directory(app.static_folder + '/csv', filename)
  # return app.send_static_file('/static/csv/test.csv')

@app.route('/testmne')
def test_mne():
  raw = mne.io.read_raw_fif(app.root_path + "/static/fif/suj29_l5nap_day1_raw.fif")
  return raw.ch_names[0]