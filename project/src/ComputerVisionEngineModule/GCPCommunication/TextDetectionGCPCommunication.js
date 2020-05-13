/**
 * GOOGLE CLOUD PLATFORM COMMUNICATION SUBMODULE
 * 
 * This is a Node.js submodule designed and implemented in order to establish a communication
 * between the upper module and the Vision API of the Google Cloud Platform.
 * 
 * The submodule only contains two functions:
 * 	- createClient - A function to create a client object. This object establish the communication between the module and the Google Cloud Platform API.
 * 	- getTextFromImage - A function to send the request and process the response.
 * 
 * This submodule requires an API Key JSON file, placed at credentials/ folder.
 * 
 * The key of the main project is confidential and not public. To obtain a valid API Key file visit the Google Cloud Platform website.
 * 
 * @module CVEngine/GCPCommunication
 * @see module:CVEngine
 * @author Joaquim Gomez <9joaquimgomez@gmail.com>
 */


// --------------- REQUIRES ---------------
const vision = require('@google-cloud/vision');



// --------------- MODULE FUNCTIONS ---------------

/**
 * Creates a client object to establish the communication between the module and the Google Cloud Platform API.
 */
function createClient() {
	try {
		// Specifies the EU as location of the api endpoint
		const clientOptions = {keyFilename: './GCPCommunication/credentials/proyecto-pae-7440be643e92.json', apiEndpoint: 'eu-vision.googleapis.com'};

		// Creates a client
		const client = new vision.ImageAnnotatorClient(clientOptions);

		// Return the client
		return client;

	} catch (error) {
		// Show error
		console.error(error);

		// In case of error returns -1
		return -1;
	}
}

/**
 * Sends a request and process the response from the Google Cloud Platform.
 * A function to send the request and process the response.
 * @param {*} client 
 * @param {*} imagePath 
 */
async function getTextFromImage(client, imagePath) {
	// Call the solver and get the results
	const [result] = await client.documentTextDetection(imagePath);

	// Get the full text annotation
	let fullTextAnnotation = result.fullTextAnnotation;

	// Get the obtained text
	if (fullTextAnnotation != null) {
		const text = fullTextAnnotation.text;
		return text;
	} else {
		return '';
	}
}


// --------------- MODULE EXPORTS ---------------
module.exports = {createClient, getTextFromImage};