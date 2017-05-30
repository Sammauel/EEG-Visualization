# EEG-Visualization-
This is the CCNY Csc Visualization final project for Professor Grossberg.

Tech Stack: D3.js, jQuery, Flask, MNE, pandas

Team Members: Sam and Ted

### Running the Visualization Locally

Activate virtualenv and run "pip install -r requirements.txt". Download raw data file from https://drive.google.com/open?id=0B1j4xFUQtHYFeUlFc0JjNk45azg to eeg/static/fif. Then run "source start.sh". Next run the command "flask run".

### Background and Motivation

An electroencephalogram (EEG) is a noninvasive test that records electrical patterns in your brain. The test is used to help diagnose conditions such as seizures, epilepsy, head injuries, dizziness, headaches, brain tumors and sleeping problems. It can also be used to confirm brain death. - Mayfield: Brain and Spine

The motivation of this project is based on curiosity of how the brain responds to certain conditions and how that is stimulated into data for research.  

### Project Objectives

The object of this project is to use EEG data provided and represent a visualization of the subject's brain wave and patterns on being able to inspect for Spindles.

### Data

The following data that this project will cover will be provided from [OpenScience Framework Nap EEG data.](https://osf.io/chav7/)


###  Data Processing

The data processing will be from 20 subjects that had two napping sessions recorded with different conditions placed for results.  This will have to be processed using Python's [MNE Library](http://martinos.org/mne/stable/index.html) for the purpose of this data set.  In conclusion,  we are looking at potentially 40 sessions of raw data and have been provided an inspection and cleaning python file with instructions to help process the data.

### Visualization

The plan to display our data will be discussed further into the semester but the general plan is to display the sleeping patterns of each test subject and compare the results of the two sessions which each subject has taken and display the whole data set to see if we can find any significance of what wave length node is active during the EEG recording.

Graphs/Charts
- Bar Graph
- Line Graph

### Must-Have Features

Apply the Spindle Detection algorithm provided by the client in order to design a dashboard that will be able to 
display all possible spindle and their locations.  This dashboard must be able to allow users to graph different channels and provide the information on the location of each channel's spindle.

### Optional Features

- Select more than 6 EEG channels
- Allow the viewer to upload their own FIF file in order to process their personal EEG data for spindle detection.
- Provide a Violin Plot of the EEG Data Set.

### Project Schedule

March 24, 2017 - Proposal due

March 26 - April 1 - Look at the data and start the processing part of the data.

April 2 - April 8 - Continue with the project and consult the domain expert on the project for further information.

April 9 - April 15 - Spring Break : Work on Resampling the data in order to adjust the size of the CSV/JSON for D3js

April 16 - April 22 - Convert the data frames of the EEG into JSON to graph in D3js 

April 23 - April 29 -  Design an overview of the data with Graphs

April 30 - May 6 - Work on the backend to implement Spindle Detection and return the data as a JSON.

May 7 - May 13 - Contact the client for annotation for spindle detection and add a zoom and slider for the Channels in the D3js.

May 14 - May 19 - Final Presentation
