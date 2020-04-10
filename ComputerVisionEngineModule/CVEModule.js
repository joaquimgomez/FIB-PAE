// --------------- CONSTANTS AREA ---------------
const MIN_CANNY_ALGORITHM = 190;	// TODO: Doc
const MAX_CANNY_ALGORITHM = 200;	// TODO: Doc
const MINIMUM_AREA_FACTOR = 1/2;	// TODO: Doc
const FIND_CONTOURS_RETRIEVAL_MODE = cv2.RETR_EXTERNAL;		// TODO: Doc
const FIND_CONTOURS_REPRESENTATION_MODE = cv2.CHAIN_APPROX_NONE;	// TODO: Doc
// TO DO: BLUR MODE AND PARAMETERS

/*

*/
class ComputerVisionEngine {
	// --------------- CLASS FIELDS AREA ---------------

	image;				// Original Image
	grayScale_image;	// Gray Scale Image
	toShow_image;		// Image to show


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

		return (approx.size() == 4);
	}

	/*
		TODO: Doc
	*/
	obtainResponseAreas() {
		// Blur image to clean noise
		blurred_im = cv.GaussianBlur(this.grayScale_image, (5,5), 0);

		// Edge detection with Canny's Algorithm
		edges = cv.Canny(blurred, MIN_CANNY_ALGORITHM, MAX_CANNY_ALGORITHM);

		// Looking for contours
		let contours = new cv.MatVector();
    	let hierarchy = new cv.Mat();
		cv.findContours(edges, contours, hierarchy, FIND_CONTOURS_RETRIEVAL_MODE, FIND_CONTOURS_REPRESENTATION_MODE);

		//
		var potentialAreas = [];
		var maxArea = 0;
		for (c in contours) {
			if (has4Corners(c)) {
				potentialAreas.push(c);
				
				currentContourArea = cv.contourArea(c);
				if (currentContourArea > maxArea) {
					maxArea = currentContourArea;
				}
			}
		}

		//
		responseAreas = [];
		for (pa in potentialAreas) {
			if (cv.contourArea(pa) >= maxArea * MINIMUM_AREA_FACTOR)	responseAreas.push(pa);
		}

		return responseAreas;
	}

	/* 
		TODO: Doc
	*/
	run(debug = False) {
		if (debug) {
			//
			responseAreas = this.obtainResponseAreas();

			// TODO: Non-debug mode not available.

			//cv.drawContours(toShow_image, [c], 0, (0, 255, 0), 5)
		} else {
			console.log("Non-debug mode not available.")
		}
	}

}
