import Accommodation from "../models/Accommodation.js";
import Restaurant from "../models/Restaurant.js";
import Activity from "../models/Activity.js";
import Transportation from "../models/Transportation.js";

export async function findDocumentByPropertyToken(propertyToken, itemType) {
    const modelMap = {
        accommodations: Accommodation,
        restaurants: Restaurant,
        activities: Activity,
        transportations: Transportation,
    };

    console.log(itemType)
    console.log(propertyToken)
    switch(itemType) {
        case "accommodation":
            itemType = "accommodations";
            break;
        case "restaurant":
            itemType = "restaurants";
            break;
        case "activity":
            itemType = "activities"
            break;
        case "transportation":
            itemType = "transportations"
            break;
    }

    const Model = modelMap[itemType];
    if (!Model) {
        throw new Error("Invalid item type");
    }

    let query = {};

    switch (itemType) {
        case "accommodations":
            query = { "serpData.properties.property_token": propertyToken };
            break;
        case "restaurants":
        case "activities":
            query = { "serpData.local_results.place_id": propertyToken };
            break;
        case "transportations":
            // query = {
            //     $or: [
            //         { "serpData.best_flights.return_flights.bookingToken": propertyToken },
            //         { "serpData.other_flights.return_flights.bookingToken": propertyToken }
            //     ]
            // };

            query = {
                $or: [
                    {
                        "serpData.best_flights": {
                            $elemMatch: {
                                return_flights: {
                                    $elemMatch: {
                                        booking_token: propertyToken
                                    }
                                }
                            }
                        }
                    },
                    {
                        "serpData.other_flights": {
                            $elemMatch: {
                                return_flights: {
                                    $elemMatch: {
                                        booking_token: propertyToken
                                    }
                                }
                            }
                        }
                    }
                ]
            };

            break;
        default:
            throw new Error(`Unhandled item type for query construction: ${itemType}`);
    }

    const doc = await Model.findOne(query);

    if (itemType === "transportations")
        console.log("transport doc:", doc)
    if (!doc) {
        throw new Error(`No document found with property_token ${propertyToken} in ${itemType}`);
    }

    return doc;
}