/**
 * 
 */
function createClient() {
  try {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Specifies the EU as location of the api endpoint
    const clientOptions = {apiEndpoint: 'eu-vision.googleapis.com'};

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
 * 
 * @param {*} client 
 * @param {*} imagePath 
 */
function getTextFromImage(client, imagePath) {
  async function solve(client, imagePath) {
    // Call the solver and get the results
    const [result] = await client.documentTextDetection(imagePath);

    // Get the full text annotation
    const fullTextAnnotation = result.fullTextAnnotation;

    // Get the obtained text
    const text = fullTextAnnotation.text; //${fullTextAnnotation.text}

    return text;
  }

  try {
    // Resolve the image and return the text
    return solve(client, imagePath);

  } catch (error) {
    // Show error
    console.error(error);

    // In case of error returns -1
    return -1;
  }
}
