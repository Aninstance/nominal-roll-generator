# Nominal Roll Generator

The server component of a web based app designed to store personnel records and generate nominal rolls in PDF format for historical military units.

A working demo of the api is available here: https://api.sasoriginals.com/api

Designed to serve data via a RESTful API.

The Nominal Roll Generator provides following features:

- Add records to a military personnel record database.
- Search the military personnel record database.
- Add units to a military unit database (regiment, brigade, squadron, etc).
- Search the military unit database for soldiers allocated to specified unit(s).
- Generate Nominal Rolls (all personnell) and/or Rolls of Honour (only casualties) for any selected unit within a specified time period.

A previous version that combined the backend with an NodeJS Express frontend is available in the 'old-express' branch.

This server component is designed to be deployed either on Docker infrastructure (using docker-compose), or on a Linux OS. Either way the user is required to configure a mongoDB instance, using access credentials as may be defined in index.js.

## Contact

Developed by: Dan Bright, productions@aninstance.com
