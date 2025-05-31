import Accommodation from "../models/Accommodation.js";
import Transportation from "../models/Transportation.js";
import Restaurant from "../models/Restaurant.js";
import Activity from "../models/Activity.js";

const findQueryParams = async (model, queryParams) =>  {
    let mongoQuery = {};

    switch (model) {
        case Accommodation:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
                'queryParams.check_in_date': queryParams.check_in_date,
                'queryParams.check_out_date': queryParams.check_out_date,
                'queryParams.adults': queryParams.adults
            };
            break;
        case Transportation:
            mongoQuery = {
                'queryParams.departure_id': queryParams.departure_id,
                'queryParams.arrival_id': queryParams.arrival_id,
                'queryParams.outbound_date': queryParams.outbound_date,
                'queryParams.return_date': queryParams.return_date
            };
            break;
        case Restaurant:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
                // ...(queryParams.place_id
                //     ? { 'queryParams.place_id': queryParams.place_id }
                //     : { 'queryParams.data': queryParams.data })
            };
            break;
        case Activity:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
            };
            break;
        default:
            throw new Error('Invalid type for MongoDB search');
    }

    try {
        // Query the database using the constructed query
        const data = await model.find(mongoQuery);

        // If data is found, return the serpData
        if (data && data.length > 0) {
            console.log("DATA", data[0].serpData);
            console.log("Data length", data.length);
            return data[0].serpData;
        } else {
            // throw new Error("No data found for the provided query parameters.");
            return null;
        }
    } catch (err) {
        console.error('MongoDB query error:', err);
        throw err;
    }
}

export default findQueryParams;