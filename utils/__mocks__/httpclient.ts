const get = async (endpointNameOrUrl:string,options: any = undefined) => {
    //check what url is and return data as per its request

    let response:any ="";

    if (endpointNameOrUrl.includes("test"))
    {
        response = { data: [
            {
                "id": 1,
                "test": "testMessage",
            }]};
    }
    return response;
};

const post = async (endpointNameOrUrl:string, dataJson = {},options: any = undefined) => {

    //check what url is and return data as per its request

    let response:any ="";

    if (endpointNameOrUrl.includes("test"))
    {
        response = { data: [
            {
                "id": 1,
                "test": "testMessage",
            }]};
    }
    else if (endpointNameOrUrl.includes("getCategoriesByCriteria"))
    {
        response = { data: [
            {
                "id": 6,
                "parentId": null,
                "categoryName": "Airport",
                "categoryType": 1,
                "icon": "✈",
                "categoryCriteria": "pois:{icon='✈' }"
            }]};
    }  
    else if (endpointNameOrUrl.includes("searchPois"))
    {
        response = { data:{"total": 1,
        "result": [
            {
			    "id": 34,
                "title": "Alhamra Art Center",
                "subTitle": "Mall Road, Lahore",
                "lat": "31.5584199",
                "lon": "74.3289012",
                "heightOffSet": "0",
                "indoor": false,
                "indoorId": "EIM-908710f5-3ed3-408d-a92b-c7749d9f1ae1",
                "floorId": 0,
                "tag": "gallery",
                "userData": "{\"permissions\":[\"ALL_LANDMARK\"]}",
                "highlight": "",
                "highlightColor": "[23,60,76,125]",
                "customView": "",
                "customViewHeight": "900",
                "icon": "🏟"
            }]}};
    }  

    return response;

}

const put = async (endpointNameOrUrl:string, dataJson = {},options: any = undefined) => {
    let response:any ="";

    if (endpointNameOrUrl.includes("test"))
    {
        response = { data: [
            {
                "id": 1,
                "test": "testMessage",
            }]};
    }
    return response;
}

const patch = async (endpointNameOrUrl:string, dataJson = {},options: any = undefined) => {


    let response:any ="";

    if (endpointNameOrUrl.includes("test"))
    {
        response = { data: [
            {
                "id": 1,
                "test": "testMessage",
            }]};
    }
    return response;
}

// const delete = async (endpointNameOrUrl:String, dataJson = {}) => {

//     try {
//         const response = await axios.delete(endpointNameOrUrl, dataJson,options);
//         Logger.info(`HttpClient-delete() - Success Response received from: ${endpointNameOrUrl} endpoint`);
//         Logger.debug(response.data);
//     } catch (error) {
//         Logger.error(error.response);
//         Logger.info(`HttpClient-delete() - Failed Response received from: ${endpointNameOrUrl} endpoint. Error: ${error.code} - ${error.message}`);
//         throw error;
//     }
// }

export {
    get,
    post,
    put,
    patch
}
