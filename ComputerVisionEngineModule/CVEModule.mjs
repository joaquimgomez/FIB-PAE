// --------------- IMPORTS AREA ---------------
//import Tesseract from 'tesseract.js';


// --------------- CONSTANTS AREA ---------------
const MIN_CANNY_ALGORITHM = 190;	// TODO: Doc
const MAX_CANNY_ALGORITHM = 200;	// TODO: Doc
const MINIMUM_AREA_FACTOR = 1/10;	// TODO: Doc
//const FIND_CONTOURS_RETRIEVAL_MODE = cv.RETR_EXTERNAL;				// TODO: Doc
//const FIND_CONTOURS_REPRESENTATION_MODE = cv.CHAIN_APPROX_NONE;	// TODO: Doc
// TO DO: BLUR MODE AND PARAMETERS


// --------------- CLASSES AREA ---------------


/**
 * 
 */
class ComputerVisionEngine {
	// --------------- CLASS FIELDS AREA ---------------

	image;				// Original Image
	grayScale_image;	// Gray Scale Image
	toShow_image;		// Image to show
	responsesTypes;		// Array with the types of the questions (in order)


	// --------------- CLASS FUNCTIONS AREA ---------------

	/*
		Precondition: OpenCV library is loaded and the passed image is in a correct format.
		In debug mode the image format should be the ID of the canvas.
	*/
	constructor(image) {
		try {
			this.image = cv.imread(image);
			this.grayScale_image = this.image
			this.toShow_image = this.image;

			// TODO: recibir los tipos de las preguntas

			// From RGB to Gray Scale
			cv.cvtColor(this.grayScale_image, this.grayScale_image, cv.COLOR_BGR2GRAY);

			cv.imshow('canvasOutput', this.grayScale_image);

		} catch (e) {
			console.error(e);
		}
	}

	/*
		Retuns true if it has 4 corners, i.e. it is a square or rectangle.
	*/
	has4Corners(contour) {
		let approx = new cv.Mat();
		// Get polygon
		cv.approxPolyDP(contour, approx, 0.01*cv.arcLength(contour, true), true);
		return (approx.size().height == 4);
	}

	/*
		TODO: Doc
	*/
	obtainResponseAreas() {
		// Blur image to clean noise
		let blurred_im = new cv.Mat();
		let ksize = new cv.Size(5, 5);
		//blurred_im = cv.GaussianBlur(this.grayScale_image, (5,5), 0);
		cv.GaussianBlur(this.grayScale_image, blurred_im, ksize, 0);

		// Edge detection with Canny's Algorithm
		let edges = new cv.Mat();
		cv.Canny(blurred_im, edges, MIN_CANNY_ALGORITHM, MAX_CANNY_ALGORITHM);

		// Looking for contours
		let contours = new cv.MatVector();
		let hierarchy = new cv.Mat();
		cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

		console.log(contours.size());

		//
		let potentialAreas = [];
		var maxArea = 0;
		for (let i = 0; i < contours.size(); i++) {
			let c = contours.get(i);
			if (this.has4Corners(c)) {
				potentialAreas.push(c);
				
				let currentContourArea = cv.contourArea(c);
				if (currentContourArea > maxArea) {
					maxArea = currentContourArea;
				}
			}
		}

		//
		let responseAreas = [];
		for (const pa of potentialAreas) {
			if (cv.contourArea(pa) >= maxArea * MINIMUM_AREA_FACTOR)	responseAreas.push(pa);
			//responseAreas.push(pa);
		}

		// Conours are ordered from bottom to top
		return responseAreas.reverse();
	}

	/*
	*/
	generateSubProblemImages(contours) {
		var subProblemImagesimages = [];
		for (c in contours) {
			let rect = cv.boundingRect(c);
			partialRegionOfInterest = this.grayScale_image.slice([rect.y, rect.y + rect.height]);
			regionOfInterest  = this.grayScale_image.slice([rect.x, rect.x + rect.width]);
			subProblemImagesimages.push(regionOfInterest);
		}
	}

	/*
	
	*/
	subproblemsTreatment(subproblems) {
		for (var i = 0; i < length(subproblems); i++) {
			// TODO: Definir forma de transmisión de la tipología de preguntas.
			if (responsesTypes[i] == 'text') {
				// TODO: Tratamiento de las respuestas de tipo texto
			} else if (responsesTypes[i] == 'icons_problem') {
				// TODO: Tratamiento de las respuestas de tipo texto
			}
		}
	}

	/* 
		TODO: Doc
	*/
	run(debug = true) {
		if (debug) {
			//
			let responseAreas = this.obtainResponseAreas();

			// Draw detected response areas in the canvas
			let color = new cv.Scalar(255,0,0,255);
			for (const ra of responseAreas) {
				let contourToDraw = new cv.MatVector();
				contourToDraw.push_back(ra);
				cv.drawContours(this.toShow_image, contourToDraw, 0, color, 5);
			}

			//
			//let subproblems = this.generateSubProblemImages(responseAreas);

			return this.toShow_image;

			//
			//results = this.subproblemsTreatment(subproblems);

		} else {
			console.log("Non-debug mode not available.")
		}
	}

}
