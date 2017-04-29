from setuptools import setup

setup(
    name='eeg',
    packages=['eeg'],
    include_package_data=True,
    install_requires=[
        'flask',
    ],
)