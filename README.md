# amazon-price-tracker
This repo contains code of a simple amazon-price-tracker extension and server. Users can add products to track relative to their price . When price of a tracked item goes below the threshold value set by user a notification is sent to user.

### Installation :
<!-- 
#### When using the already deployed server.

* Simply load the extension directory using chrome developer tools, rest has been taken care of.


#### Else if you wanna run the server locally :  -->

* Download the package and run the following command in server directory to install all the dependencies:
<pre>npm install</pre>
* Create a .env file in server directory to store environment variables. 
* Setup variables `PORT` = 8080 , `dbURI` : url to connect to your mongodb atlas database, `jwtSecret` : some string to encode with jwt.
* In extension/popup.js, extension/background.js and extension/content.js files change the baseURL to `http://localhost:8080/`.  
* Now run the following command in server directory to start node-server:
<pre>nodemon app</pre>
* Load the extension directory using chrome developer tools.




