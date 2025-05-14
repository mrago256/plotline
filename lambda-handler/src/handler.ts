import { APIGatewayEvent, Context } from 'aws-lambda';
import { plotlineHelper } from './helper/plotlineHelper';

export const handler = async (event: APIGatewayEvent, context: Context) => {
    const endpoint = event.path;
    const input = event.body ? JSON.parse(event.body) : null;

    let responseMessage = "Operation Successful";
    let statusCode = 200;
    let responseBody = null;

    try {
        switch(endpoint) {
            case "/getAllMovies": {
                responseBody = await plotlineHelper.getAllSavedMovies();
                break;
            }

            case "/getAllShows": {
                responseBody = await plotlineHelper.getAllSavedShows();
                break;
            }

            case "/searchByName": {
                const requiredFields = ["searchQuery"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const queryString = input.searchQuery;

                responseBody = await plotlineHelper.queryByName(queryString);
                break;
            }

            case "/addMovie": {
                const requiredFields = ["tmdbId"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }
                
                const tmdbId = input.tmdbId;

                await plotlineHelper.addMovieToList(tmdbId);
            }

            case "/addShow": {
                const requiredFields = ["tmdbId"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;

                await plotlineHelper.addShowToList(tmdbId);
            }

            case "/setMovieWatchStatus": {
                const requiredFields = ["tmdbId", "watched"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;
                const watched = input.watched;

                await plotlineHelper.setMovieWatchStatus(tmdbId, watched);
            }

            case "/setShowWatchStatus": {
                const requiredFields = ["tmdbId", "watched"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;
                const watched = input.watched;

                await plotlineHelper.setShowWatchStatus(tmdbId, watched);
            }

            case "/setMovieRating": {
                const requiredFields = ["tmdbId", "rating"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;
                const rating = input.rating;

                await plotlineHelper.setMoviePersonalRating(tmdbId, rating);
            }

            case "/setShowRating": {
                const requiredFields = ["tmdbId", "rating"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;
                const rating = input.rating;

                await plotlineHelper.setShowPersonalRating(tmdbId, rating);
            }

            case "/removeMovie": {
                const requiredFields = ["tmdbId"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;

                await plotlineHelper.removeMovieFromList(tmdbId);
            }

            case "/removeShow": {
                const requiredFields = ["tmdbId"];
                const validationResponse = plotlineHelper.validateInput(input, requiredFields);

                if (validationResponse) {
                    responseMessage = validationResponse;
                    statusCode = 400;
                    break;
                }

                const tmdbId = input.tmdbId;

                await plotlineHelper.removeShowFromList(tmdbId);
            }

            default: {
                statusCode = 404;
                responseMessage = `Unknown operation: '${endpoint}'`;
                break;
            }
        }
    } catch(error) {
        console.error("Error processing request:", error);
        statusCode = 500;
        responseMessage = "Internal server error";
    }

    return {
        statusCode,
        body: JSON.stringify({
            message: responseMessage,
            data: responseBody
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
};
