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
                const entries = await plotlineHelper.getAllSavedMovies();
                responseBody = entries;
                break;
            }

            case "/getAllShows": {
                const entries = await plotlineHelper.getAllSavedShows();
                responseBody = entries;
                break;
            }

            case "/searchByName": {
                if (!input?.searchQuery) {
                    responseMessage = "Must provide input string";
                    statusCode = 400;
                    break;
                }
                const queryString = input.searchQuery;

                const entries = await plotlineHelper.queryByName(queryString);
                responseBody = entries;
                break;
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
