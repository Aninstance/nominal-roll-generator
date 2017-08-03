======================
Nominal Roll Generator
======================

A web based app designed to store personnel records and generate nominal rolls in PDF format for historical military units.

======================
Demo
======================

The server component of a web based app designed to store personnel records and generate nominal rolls in PDF format for historical military units.

Designed to serve data via a RESTful API. A frontend written in Angular will soon be commited to a seperate repository.

A previous version that combined the backend with an NodeJS Express frontend is available in the 'old-express' branch.

Features from the 'old-express' branch are currently being refactored and added to master.

This server component is designed to be deployed either on Docker infrastructure (using docker-compose), or on a Linux OS. Either way the user is required to configure a mongoDB instance, using access credentials as may be defined in index.js.

======================
Contact
======================

Developed by: Dan Bright, productions@aninstance.com
