# FIB-PAE Project 2019-2020 Q2

## Authors
The authors of this project are:

* Aarón Garcia
* Pau Altet
* Joaquim Gómez
* Sandra Flores

## What is this project?

This project was developed inside the context of PAE, a subject from FIB (Facultat d'Informàtica de Barcelona) of UPC (Universitat Politècnica de Catalunya). This subject consists in collaborations between companies and the faculty, where companies propose challenges.

Specifically, in this repository you can find our project. It consists on questionnaires environment web based app. More precisely this project have been developed with the intention to be used in Africa, with women that are using menstrual cups.

With this project we offer:

* A poll creation/edition module
* Module to answer polls
* Basic statistics and data exploration module

## How to execute it?

Before the execution of the app you should have installed all the Node.js modules. To do this you must have installed Node.js and then you can do:

`npm install`

It is possible that your environment needs a special treatment of the Computer Vision module. You can see the information about this at the end of this README.

After that, in order to execute the project you must open two terminals, one for the backend server and another for the application itself. Firstly, you need to make:

`node ./project/src/server.js`

And secondly, you need to make:

`npm run dev`


## Development considerations

This project is just a prototype. For this reason we cannot guarantee a perfect functioning in all the possible situations.

For the front-end part it uses Vue.js, as well as, HTML5, CSS3 and JavaScript.

For the back-end it uses a Node.js based server, with a MySQL Database.

Given that we cannot ensure a online database forever, if you want to execute this project in a self environment, you should configure a proper database context.

Moreover, in order to use the Computer Vision Module, a correct configuration is mandatory. 
This one consist in a proper installation of OpenCV 4 library and the opencv4nodejs module (as you can see [here](https://www.npmjs.com/package/opencv4nodejs)), in addition to a Google Cloud Platform (Vision API) credential.

At `/docs/Questionnaire/Example.pdf` you can see an example of poll on paper, which can be digitalised with this project.



