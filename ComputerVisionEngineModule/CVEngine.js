/**
 * COMPUTER VISION ENGINE MODULE
 * 
 * This is a Node.js module designed and implemented in order to solve the computer vision problem of the main project.
 * This problem is the information extraction from a taked image containing a poll.
 * 
 * In order to resolve the problem this module contains the following classes:
 * 	- ComputerVisionEngine - The main class and the entry point to the module.
 * 	- ComputerVisionEngineProblemSolver - Superclass for the different needed solvers.
 * 	- TextProblemSolver - Solver for the problem of a ROI containing text.
 * 	- CheckboxesProblemSolver - Solver for the problem of a ROI checkboxes.
 * 	- IconsProblemSolver - Solver for the problem of a ROI containing icons to be crossed out.
 * 
 * This module also contains the GCPCommunication submodule.
 * The submodule allows the TextProblemSolver class to solve subproblems by calling the Vision API of the Google Cloud Platform.
 * 
 * As a Node.js module, this one and GCPCommunication requires the following Node.js modules installed on the environment:
 * fs, opencv4nodejs, @google-cloud/vision.
 * 
 * @module CVEngine
 * @author Joaquim Gomez <9joaquimgomez@gmail.com>
 */

 
// --------------- REQUIRED ---------------

const fs = require('fs');
const cv = require('opencv4nodejs');
const gcpc = require('./GCPCommunication/TextDetectionGCPCommunication.js');



// --------------- CONSTANTS ---------------

const DEFAULT_TMP_IMAGES_PATH = './tmp/';	// Path for the tmp images
const MIN_CANNY_ALGORITHM = 190;			// Max threshold for the Canny's Algorithm.
const MAX_CANNY_ALGORITHM = 200;			// Min threshold for the Canny's Algorithm.
const MINIMUM_AREA_FACTOR = 1/25;			// Factor for searching response areas.



// --------------- CLASSES ---------------

/**
 * Superclass to define the subproblems solvers. It just has the constructor and an empty solve() funtion to be defined in the subclasses.
 */
class ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	problemImage;			// Subimage of the problem
	toShowProblemImage;		// Image to show


	// --------------- CLASS FUNCTIONS ---------------

	/**
	 * Precondition: The subimage (i.e. subproblem) is a valid area in gray scale color model formatted as a OpenCV Mat.
	 */
	constructor(subimage) {
		this.problemImage = subimage.copy();
		this.toShowProblemImage = subimage.copy();
	}

	/**
	 * Solving function to be defined in the subclasses.
	 */
	solve() {
		// Nothing to solve in this superclass.
	}
}


/**
 * Subclass to solve the subproblems containing text to be digitalised.
 * This class uses the submodule GCPCommunication in order to establish a communication with the Vision API of the Google Cloud Platform.
 */
class TextProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	imagePath = './';	// Field for the image path for the subclass TextProblemSolver


	// --------------- CLASS FUNCTIONS ---------------
	
	/**
	 * Generates a temporal image file (in jpeg), with random name, in the path defined in the constant DEFAULT_TMP_IMAGES_PATH.
	 * Save at the superclass the path of the generated file with the random name.
	 */
	generateTemporalImage() {
		this.imagePath = DEFAULT_TMP_IMAGES_PATH + Math.floor(Math.random() * 100000) + '.jpeg';

		cv.imwrite(this.imagePath, this.problemImage);
	}

	/**
	 * Deletes the temporal generated image using the superclass saved path.
	 */
	deleteTemporalImage() {
		try {
			fs.unlinkSync(this.imagePath);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Solves the problem creating a client communication agent and requiring the text to the Vision API.
	 * @param {*} imagePath 
	 */
	solve() {
		// Prepare image
		this.generateTemporalImage();

		// Obtain client to solve the text problem
		const client = gcpc.createClient();

		if (client != -1) {
			// Obtain the text
			let text = gcpc.getTextFromImage(client, this.imagePath).then(function(result) {
				return result;
			}, function(err) {
				console.error(err);
				return 'None';
			});
			
			setTimeout(() => {  
				this.deleteTemporalImage();
			}, 1000);

			return text;
		}

		this.deleteTemporalImage();
		return 'None';
	}
	
}


/**
 * Subclass to solve the subproblems containing checkboxes.
 */
class CheckboxesProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	
	// --------------- CLASS FUNCTIONS ---------------


	/**
	 * Returns true if rect1 is contained by rect2
	 * @param {*} rect1 
	 * @param {*} rect2 
	 */
	rectInsideRect(rect1, rect2) {
		//Rect = { x, y, width, height }
		return (rect2.x < rect1.x && rect1.x < rect2.x+rect2.width
			&& rect2.y < rect1.y && rect1.y < rect2.y+rect2.height
			&& rect2.x < rect1.x+rect1.width && rect1.x+rect1.width < rect2.x+rect2.width
			&& rect2.y < rect1.y+rect1.height && rect1.y+rect1.height < rect2.y+rect2.height)
	}

	/**
	 * Extracts the important contours, i.e. the square forms, using the aspect relation in order to distinguish 
	 * the possible squared contours from the rest.
	 * @param {*} contours 
	 */
	extractImportantContours(contours) {
		let boxesContoursProv = [];

		let maxArea = 0;
		for (let i = 0; i < contours.length; i++) {
			// Aproximation of the polygon
			let approx = contours[i].approxPolyDP(0.05*contours[i].arcLength(true), true);

			// Rect calculus
			let rect = contours[i].boundingRect();

			// Aspect relation calculus
			let ar = rect.width / rect.height;

			// Valid aspect relation range defined in [0.95, 1.05]
			if (approx.length == 4 && (ar >= 0.95 && ar <= 1.05)) {
				boxesContoursProv.push(contours[i]);
				
				if(maxArea < contours[i].area) 	maxArea = contours[i].area;
			}
		}

		// Deleting possible errors
		let boxesContours = []
		for (let i = 0; i < boxesContoursProv.length; i++) {
			let rectCurrentContour = boxesContoursProv[i].boundingRect();

			let tmp = boxesContoursProv.slice(0);
			tmp.splice(i, 1);

			// Checking if the current contour is contained by antoher
			let insert = false;
			for (let j = 0; j < tmp.length; j++) {
				insert = insert || this.rectInsideRect(rectCurrentContour, tmp[j].boundingRect())
			}

			if (insert && boxesContoursProv[i].area >= maxArea * MINIMUM_AREA_FACTOR){
				boxesContours.push(boxesContoursProv[i]);
			}
		}

		return boxesContours.reverse();
	}

	/**
	 * Generates ROIs from the superclass image using the passed contours.
	 * @param {*} contours 
	 */
	generateROIs(contours) {
		let rois = [];
		
		for (let i = 0; i < contours.length; i++) {
			rois.push(this.problemImage.getRegion(contours[i].boundingRect()));
		}

		return rois;
	}

	/**
	 * Solves the problem looking for a boxes' contours and making a sum of positive pixel 
	 * (representing the cross inside the square/box) in a binary image.
	 */
	solve() {
		// Obtain edges of boxes
		let thres = this.problemImage.threshold(160, 255, cv.THRESH_TOZERO);

		// Looking for contours (as a RETR_LIST)
		let contours = thres.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_NONE);

		// Highlighted contours extraction
		let boxesContours = this.extractImportantContours(contours);

		// Extract boxes ROIs images
		let boxesROIs = this.generateROIs(boxesContours);

		// Checked box detection
		let sum = []
		for (const roi of boxesROIs) {
			let binaryROI1 = roi.threshold(0, 255, cv.THRESH_TOZERO);
			let binaryROI2 = roi.threshold(200, 255, cv.THRESH_TOZERO);

			// Extraction of the cross
			let diff = binaryROI2.absdiff(binaryROI1);	// binaryROI2 - binaryROI1

			// Sum of positive pixel representing the cross
			sum.push(diff.countNonZero());
		}
		
		// Return of the checked box index
		return sum.indexOf(Math.max(...sum));
	}

}


/**
 * Subclass to solve the subproblems containing icons to be selected.
 */
class IconsProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	numberDetectedCirles = 0;							// Number of detected circles-
	positionsAndRadiuDetectedCircles = new Array();		// (x, y, r) of every cirle detected
	radiusExpansionFactor = 0.15;						// Factor to maka a expansion of radius of detected circles
	thres = 200;										// Threshold to make corners filter
	corners = new Array();								// Detected corners

	
	// --------------- CLASS FUNCTIONS AREA ---------------

	/**
	 * Process the OpenCV structure and constructs an array of 3-tuples with the coordinates x and y, and the redius r.
	 * @param detectedCircles 
	 */
	constructCirclesEstructure(detectedCircles) {
		// Number of detected circles
		this.numberDetectedCirles = detectedCircles.length;

		// Data extraction and formatting
		for (let i = 0; i < this.numberDetectedCirles; ++i) {
			// Save point inside the structure;
			this.positionsAndRadiuDetectedCircles.push(new Array(detectedCircles[i].x, detectedCircles[i].y, detectedCircles[i].z));
		}

		// Sort per x
		this.positionsAndRadiuDetectedCircles = this.positionsAndRadiuDetectedCircles.sort((a, b) => { 
			return a[0] - b[0]; 
		});
	}

	/**
	 * Detect the corners inside the ROI
	 */
	cornersDetection() {
		// Corners detection
		let corners = this.problemImage.cornerHarris(2, 3, 0.04);

		// Corners normalization
		let corners_norm = corners.normalize(0, 255, cv.NORM_MINMAX);

		// Scaling corners
		let corners_norm_scaled = corners_norm.convertScaleAbs();

		// Corners extraction based on a thres
		iteratingCornersX: for (let i = 0; i < corners_norm_scaled.rows; ++i) {
			iteratingCornersY: for (let j = 0; j < corners_norm_scaled.cols; ++j) {
				let value = corners_norm_scaled.at(i, j); //[i * corners_norm_scaled.cols * corners_norm_scaled.channels + j * corners_norm_scaled.channels];

				if (value >= this.thres) {
					// Corners contains a list of pairs (x, y) saving pairs of (j, i) due to the inverted orientation
					this.corners.push(new Array(j,i));
				}
			}
		}
	}

	/**
	 * Solve the problem detecting the possible corners of the cross over the icon.
	 * The obtained solution is based on the following expected ordering of the icons: Happy, Meh, Sad.
	 */
	solve() {
		// Circle detection
		//let circles = this.problemImage.houghCircles(cv.HOUGH_GRADIENT, 1.5, 255);
		let circles = this.problemImage.houghCircles(cv.HOUGH_GRADIENT, 1.5, this.problemImage.rows/8, 255)

		// Circle sorted structure construction (at this.positionsAndRadiuDetectedCircles)
		this.constructCirclesEstructure(circles);

		// Corners detection (at this.corners)
		this.cornersDetection();

		// Counting corners inside expanded circles
		let cornersPerCircle = new Array(this.numberDetectedCirles);
		cornersPerCircle.fill(0);

		// Summing all the corners inside the expanded radius of the three circles
		iteratingCorners: for (let i = 0; i < this.corners.length; ++i) {
			let xCorner = this.corners[i][0];
			let yCorner = this.corners[i][1];

			iteratingCircles: for (let j = 0; j < this.positionsAndRadiuDetectedCircles.length; ++j) {
				let xCircle = this.positionsAndRadiuDetectedCircles[j][0];
				let yCircle = this.positionsAndRadiuDetectedCircles[j][1];
				let expandedCircleRadius = this.positionsAndRadiuDetectedCircles[j][2];
				expandedCircleRadius = expandedCircleRadius + (expandedCircleRadius*0.15 | 0);

				let xCircleMinusR = xCircle - expandedCircleRadius;
				let xCirclePlusR = xCircle + expandedCircleRadius;
				let yCircleMinusR = yCircle - expandedCircleRadius;
				let yCirclusPlusR = yCircle + expandedCircleRadius;

				// xCircleMinusR < xCorner < xCirclePlusR && yCircleMinusR < yCorner < yCirclusPlusR

				if (xCircleMinusR < xCorner && xCorner < xCirclePlusR
					&& yCircleMinusR < yCorner && yCorner < yCirclusPlusR) {
						++cornersPerCircle[j];
					break iteratingCircles;
				}
			}
		}

		// The solution is the circle with the maximum count of corners inside its expanded radius
		let indexOfMaxCountPerCircle = cornersPerCircle.indexOf(Math.max(...cornersPerCircle));

		if (indexOfMaxCountPerCircle == 0) {
			return 'Happy';
		} else if (indexOfMaxCountPerCircle == 1) {
			return 'Meh';
		} else if (indexOfMaxCountPerCircle == 2) {
			return 'Sad';
		} else {
			return 'None';
		}
	}
}


/**
 * Main class and the entry point to the module. With the constructor receibes the images to be processed and with the solve() function
 * separates the original image in multiple ROIs, in order to solve each subproblem individually.
 * 
 * Precondition (for the correct functioning): The libraries opencv4nodejs, opencv4nodejs and the submodule GCPCommunication are loaded on the environment.
 * Also, the image sended to the constructor is in a valid OpenCV format (i.e. as a Mat).
 */
class ComputerVisionEngine {
	// --------------- CLASS FIELDS ---------------

	image;				// Original Image
	grayScaleImage;		// Gray Scale Image
	toShowImage;		// Image to show
	responsesTypes;		// Array with the types of the questions (in order)


	// --------------- CLASS FUNCTIONS ---------------

	/**
	 * Receives a valid Mat formatted image to be processed. Creates its versions in gray scale and a copy in order to make a possible
	 * view of the image.
	 * @param {*} image 
	 */
	constructor(image, typesQuestions) {
		// Image copies
		this.image = image;
		this.grayScaleImage = this.image.copy();
		this.toShowImage = this.image.copy();

		// Expected questions types
		this.responsesTypes = typesQuestions;

		// From RGB to Gray Scale
		this.grayScaleImage = this.grayScaleImage.bgrToGray();
	}

	/**
	 * Retuns true if the contour received as a parameter has 4 corners, i.e. it is a square or rectangle.
	 * @param {*} contour 
	 */
	has4Corners(contour) {
		// Get polygon
		let approx = contour.approxPolyDP(0.01*contour.arcLength(true), true);

		let rect = contour.boundingRect();
		let ar = rect.width / rect.height;

		return (approx.length == 4);
	}

	/**
	 * Find the response areas looking for valid contours obtained with the Canny's Algorithm and the findContours OpenCV function.
	 * Pre-perform a Gaussian blur to reduce possible noise.
	 */
	obtainResponseAreas() {
		// Blur image to clean noise
		let ksize = new cv.Size(5, 5);
		let blurred_im = this.grayScaleImage.gaussianBlur(ksize, 0);

		// Edge detection with Canny's Algorithm
		let edges = blurred_im.canny(MIN_CANNY_ALGORITHM, MAX_CANNY_ALGORITHM);

		// Looking for contours (as a RETR_EXTERNAL)
		let contours = edges.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

		// Search for a possible valid response areas (squares or rectangles)
		let potentialAreas = [];
		var maxArea = 0;
		for (let i = 0; i < contours.length; i++) {
			let c = contours[i];
			if (this.has4Corners(c)) {
				potentialAreas.push(c);

				if (c.area > maxArea) {
					maxArea = c.area;
				}
			}
		}

		// Extract the valid response areas using its geometric area.
		let responseAreas = [];
		for (const pa of potentialAreas) {
			if (pa.area >= maxArea * MINIMUM_AREA_FACTOR)	responseAreas.push(pa);
		} 

		// Conours are ordered from bottom to top
		return responseAreas.reverse();
	}

	/**
	 * Extract que ROIs for the subproblems treatment, generatin subMats of the original image Mat.
	 * @param {*} contours 
	 */
	generateSubProblemImages(contours) {
		let subProblemImages = [];

		for (const c of contours) {
			let rect = c.boundingRect()
			let regionOfInterest = this.grayScaleImage.getRegion(rect);
			subProblemImages.push(regionOfInterest);
		}

		return subProblemImages;
	}

	/**
	 * Creates a solver for each ROI (using the expected type on the are) and performs the resolution.
	 * @param {*} subproblems 
	 */
	subproblemsTreatment(subproblems) {
		let results = [];
		for (let i = 0; i < subproblems.length; i++) {
			let solver;
			if(this.responsesTypes[i] == 'text') {
				solver = new TextProblemSolver(subproblems[i]);
			} else if (this.responsesTypes[i] == 'icons-checkbox') {
				solver = new IconsProblemSolver(subproblems[i]);
			} else {
				solver = new CheckboxesProblemSolver(subproblems[i]);
			}

			let result = solver.solve();
			results.push(result);
		}

		return results;
	}

	/**
	 * Draw the detected response areas contours on the image to show.
	 * This is a testing purpose function.
	 * @param {*} contours 
	 */
	drawContours(contours) {
		let color = new cv.Vec3(255,0,0, );
		
		for (const c of contours) {
			this.toShowImage.drawContours([c.getPoints()], -1, color,  { thickness: 3 });
		}
	}

	/**
	 * Starts the resolution and returns the results.
	 */
	run() {
		// Obtain response areas
		let responseAreas = this.obtainResponseAreas();

		// Generate subproblem images (as a matrix)
		let subproblems = this.generateSubProblemImages(responseAreas);

		// Treate each subproblem image (as a matrix)
		let results = this.subproblemsTreatment(subproblems);

		return results;
	}
}


// --------------- MODULE EXPORTS ---------------
module.exports = ComputerVisionEngine;