function handleClientLoad() {
    pm.drive.checkAuth();
}

pm.drive = {
//    CLIENT_ID: '185983536657.apps.googleusercontent.com',
    auth: {},
    CLIENT_ID: '185983536657-vlvrhlnr9dllmdbdgvgejdhhceousr0i.apps.googleusercontent.com',
    SCOPES: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        // Add other scopes needed by your application.
    ],

    /**
     * Called when the client library is loaded.
     */
    handleClientLoad: function() {
        console.log("Client has loaded");
        pm.drive.postFile();
    },

    /**
     * Load the Drive API client.
     * @param {Function} callback Function to call when the client is loaded.
     */
    loadClient: function(callback) {
        gapi.client.load('drive', 'v2', pm.drive.handleClientLoad);
    },

    /**
     * Check if the current user has authorized the application.
     */
    checkAuth: function(){
        gapi.auth.authorize(
            {'client_id': pm.drive.CLIENT_ID, 'scope': pm.drive.SCOPES.join(' '), 'immediate': true},
            pm.drive.handleAuthResult);
    },

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    handleAuthResult: function(authResult) {
        if (authResult) {
            pm.drive.auth = authResult;
            pm.drive.loadClient(pm.drive.handleClientLoad);
            console.log(authResult);
            // Access token has been successfully retrieved, requests can be sent to the API
        } else {
            // No access token could be retrieved, force the authorization flow.
            gapi.auth.authorize(
                {'client_id': pm.drive.CLIENT_ID, 'scope': pm.drive.SCOPES, 'immediate': false},
                pm.drive.handleAuthResult);
        }
    },

    handlePostFileResponse: function(e) {
        console.log(e);
    },

    //Testing
    postFile: function() {
        pm.collections.getCollectionData("98191a83-9138-ce3c-a27b-25ea654de724", function(name, type, filedata) {
            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";

            var metadata = {
                'title': name,
                'mimeType': "application/json"
            };

            var multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    filedata +
                    close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});

            request.execute(pm.drive.handlePostFileResponse);
        });


    },

    putFile: function(file) {

    },

    deleteFile: function(file) {

    },

    getFile: function(file) {

    }
};