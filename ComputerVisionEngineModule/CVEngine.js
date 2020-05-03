// --------------- REQUIRES ---------------
const fs = require('fs');
const cv = require('opencv4nodejs');
const gcpc = require('./GCPCommunication/TextDetectionGCPCommunication.js');



// --------------- CONSTANTS ---------------
const MIN_CANNY_ALGORITHM = 190;	// TODO: Doc
const MAX_CANNY_ALGORITHM = 200;	// TODO: Doc
const MINIMUM_AREA_FACTOR = 1/10;	// TODO: Doc
//const cv = require('./opencv.js');
//const FIND_CONTOURS_RETRIEVAL_MODE = cv.RETR_EXTERNAL;				// TODO: Doc
//const FIND_CONTOURS_REPRESENTATION_MODE = cv.CHAIN_APPROX_NONE;	// TODO: Doc
// TO DO: BLUR MODE AND PARAMETERS

const DEFAULT_TMP_IMAGES_PATH = './tmp/';


// --------------- CLASSES ---------------
/**
 * 
 */
class ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------
	problemImage;			// Subimage of the problem
	toShowProblemImage;		//
	imagePath;				// Field for the image path for the subclass TextProblemSolver


	// --------------- CLASS FUNCTIONS ---------------

	/**
	 * Precondition: The subimage (i.e. subproblem) is a valid area in gray scale color model.
	 */
	constructor(subimage) {
		this.problemImage = subimage.copy();
		this.toShowProblemImage = subimage.copy();
	}

	/**
	 * 
	 */
	solve() {
		// Nothing to solve in this superclass.
	}
}

/**
 * 
 */
class TextProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------


	// --------------- CLASS FUNCTIONS ---------------
	
	/**
	 * 
	 */
	generateTemporalImage() {
		this.imagePath = DEFAULT_TMP_IMAGES_PATH + Math.floor(Math.random() * 100000) + '.jpeg';

		cv.imwrite(this.imagePath, this.problemImage);
	}

	/**
	 * 
	 */
	deleteTemporalImage() {
		try {
			fs.unlinkSync(this.imagePath);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 
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

			this.deleteTemporalImage();
			return text;
		}

		this.deleteTemporalImage();
		return 'None';
	}
	
}

/**
 * 
 */
class CheckboxesProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	
	// --------------- CLASS FUNCTIONS ---------------

	/**
	 * 
	 */
	isABox(contour) {
		let approx = new cv.Mat();

		// Get polygon
		cv.approxPolyDP(contour, approx, 0.01*cv.arcLength(contour, true), true);

		return (approx.size().height == 4);
	}

	/**
	 * 
	 * @param {*} contours 
	 */
	generateROIs(contours) {
		let rois = [];
		
		for (const c of contours) {
			rois.push(this.problemImage.getRegion(c.boundingRect()));
		}

		return subProblemImages;
	}

	/**
	 * 
	 */
	solve() {
		
		// Obtain contours of boxes
		

		// Extract boxes ROIs images
		let boxesROIs = this.generateROIs(contours);

		// Checked box detection
		let sum = []
		for (const roi of boxesROIs) {
			let binaryROI1 = roi.threshold(0, 255, cv.THRESH_TOZERO);
			let binaryROI2 = roi.threshold(200, 255, cv.THRESH_TOZERO);

			let diff = binaryROI2 - binaryROI1;

			sum.push(diff.countNonZero());
		}
		
		//
		return sum.indexOf(Math.max(...sum));
	}

	generateSubProblemImages(contours) {
		let subProblemImages = [];

		for (const c of contours) {
			let rect = c.boundingRect()
			let regionOfInterest = this.grayScaleImage.getRegion(rect);
			subProblemImages.push(regionOfInterest);
		}

		return subProblemImages;
	}
}


/**
 * 
 */
class IconsProblemSolver extends ComputerVisionEngineProblemSolver {
	// --------------- CLASS FIELDS ---------------

	numberDetectedCirles = 0;							//
	positionsAndRadiuDetectedCircles = new Array();		// (x, y, r) of every cirle detected
	radiusExpansionFactor = 0.15;						//
	thres = 200;										//
	corners = new Array();

	
	// --------------- CLASS FUNCTIONS AREA ---------------

	/**
	 * 
	 * @param detectedCircles 
	 */
	constructCirclesEstructure(detectedCircles) {
		// Number of detected circles
		this.numberDetectedCirles = detectedCircles.cols;

		// Data extraction and formatting
		for (let i = 0; i < this.numberDetectedCirles; ++i) {
			let x = detectedCircles.data32F[i * 3];
			let y = detectedCircles.data32F[i * 3 + 1];
			let r = detectedCircles.data32F[i * 3 + 2];

			// Save point inside the structure;
			this.positionsAndRadiuDetectedCircles.push(new Array(x, y, r));
		}

		// Sort per x
		this.positionsAndRadiuDetectedCircles = this.positionsAndRadiuDetectedCircles.sort((a, b) => { 
			return a[0] - b[0]; 
		});
	}

	/**
	 * 
	 */
	cornersDetection() {
		// Corners detection
		let corners = this.problemImage.cornerHarris(2, 3, 0.04);
		//let corners = new cv.Mat();
		//cv.cornerHarris(this.problemImage, corners, 2, 3, 0.04);

		// Corners normalization
		let corners_norm = corners.normalize(0, 255, cv.NORM_MINMAX);
		//let corners_norm = new cv.Mat();
		//cv.normalize(corners, corners_norm, 0, 255, cv.NORM_MINMAX);

		// Scaling corners
		let corners_norm_scaled = corners_norm.convertScaleAbs();
		//let corners_norm_scaled = new cv.Mat();
		//cv.convertScaleAbs(corners_norm, corners_norm_scaled);

		// Corners extraction based on a thres
		iteratingCornersX: for (let i = 0; i < corners_norm_scaled.rows; ++i) {
			iteratingCornersY: for (let j = 0; j < corners_norm_scaled.cols; ++j) {
				let value = corners_norm_scaled.at(i, j);//[i * corners_norm_scaled.cols * corners_norm_scaled.channels + j * corners_norm_scaled.channels];

				if (value >= this.thres) {
					// Corners contains a list of pairs (x,y)
					this.corners.push(new Array(j,i));
				}
			}
		}
	}

	/**
	 * 
	 */
	solve() {
		// Circle detection
		let circles = this.problemImage.houghCircles(cv.HOUGH_GRADIENT, 1.5, 200);
		//let circles = new cv.Mat();
		//cv.HoughCircles(this.problemImage, circles, cv.HOUGH_GRADIENT, 1.5, 200);//, minRadius=0, maxRadius=0);

		// Circle estructure construction sorted (at this.positionsAndRadiuDetectedCircles)
		this.constructCirclesEstructure(circles);

		// Corners detection (at this.corners)
		this.cornersDetection();

		// Counting corners inside expanded circles
		let cornersPerCircle = new Array(this.numberDetectedCirles);
		cornersPerCircle.fill(0);

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

				if (xCorner >= xCircleMinusR && xCorner <= xCirclePlusR &&
					yCorner >= yCircleMinusR && yCorner <= yCirclusPlusR) {
					++cornersPerCircle[j];
					break iteratingCircles;
				}
			}
		}

		// Solution generation and return
		// Solution based on the following ordering: Happy, Meh, Sad
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
 * 
 */
class ComputerVisionEngine {
	// --------------- CLASS FIELDS ---------------

	image;				// Original Image
	grayScaleImage;	// Gray Scale Image
	toShowImage;		// Image to show
	responsesTypes;		// Array with the types of the questions (in order)


	// --------------- CLASS FUNCTIONS ---------------

	/**
	 * Precondition: OpenCV library is loaded and the passed image is in a correct format.
	 * In debug mode the image format should be the ID of the canvas.
	 * @param {*} image 
	 */
	constructor(image) {
		this.image = image;
		this.grayScaleImage = this.image.copy();
		this.toShowImage = this.image.copy();

		// TODO: recibir los tipos de las preguntas

		// From RGB to Gray Scale
		this.grayScaleImage = this.grayScaleImage.bgrToGray();
	}

	/**
	 * Retuns true if it has 4 corners, i.e. it is a square or rectangle.
	 * @param {*} contour 
	 */
	has4Corners(contour) {
		// Get polygon
		let approx = contour.approxPolyDP(0.01*contour.arcLength(true), true);
		return (approx.length == 4);
	}

	/*
		TODO: Doc
	*/
	obtainResponseAreas() {
		// Blur image to clean noise
		let ksize = new cv.Size(5, 5);
		let blurred_im = this.grayScaleImage.gaussianBlur(ksize, 0);

		// Edge detection with Canny's Algorithm
		let edges = blurred_im.canny(MIN_CANNY_ALGORITHM, MAX_CANNY_ALGORITHM);

		// Looking for contours
		let contours = edges.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

		//
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

		let responseAreas = [];
		for (const pa of potentialAreas) {
			if (pa.area >= maxArea * MINIMUM_AREA_FACTOR)	responseAreas.push(pa);
		} 

		// Conours are ordered from bottom to top
		return responseAreas.reverse();
	}

	/**
	 * 
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
	 * 
	 * @param {*} subproblems 
	 */
	subproblemsTreatment(subproblems) {
		for (var i = 0; i < subproblems.length; i++) {
			// TODO: Definir forma de transmisión de la tipología de preguntas.
			//if (responsesTypes[i] == 'text') {
				let textProblemSolver = new TextProblemSolver(subproblems[i]);
				let text = textProblemSolver.solve();
				return text;
			//} else if (responsesTypes[i] == 'icons_problem') {*/
			//	let iconsProblemSolver = new IconsProblemSolver(subproblems[i]);
			//	let response = iconsProblemSolver.solve();
			//	console.log(response);
			//}
		}
	}

	/**
	 * 
	 * @param {*} contours 
	 */
	drawContours(contours) {
		let color = new cv.Scalar(255,0,0,255);
		for (const c of contours) {
			this.toShowImage.drawContours(c, 0, color, 5)
		}
	}

	/**
	 * 
	 */
	run() {
		// Obtain response areas
		let responseAreas = this.obtainResponseAreas();

		// Generate subproblem images (as a matrix)
		let subproblems = this.generateSubProblemImages(responseAreas);

		// Treate each subproblem image (as a matrix)
		let results = this.subproblemsTreatment([subproblems[2]]);
		cv.imwrite("./subproblem.png", subproblems[2]);
		
		//return results;
		//return this.toShowImage;
	}
}

module.exports = ComputerVisionEngine;