The Software Quality Submission
Please find the submission made
Timestamp   : 16/11/2020 7:00 PM
Location    : https://github.com/unsw-cse-capstone-project/capstone-project-comp9900-w17b-v5
File name   : capstone-project-comp9900-w17b-v5.zip
-----------------------------------------------------------------------------------
SetUp Instructions
-----------------------------------------------------------------------------------
Setup and Deployment backend

Note: We recommend you use our database on AWS RDS as the database is huge.
If you want to use our cloud database, please skip Step 1, 4 and 5 and select “production” environment in Step 3.

•	Step1: Configure local database (Optional)
If you are going to setup the application on your own localhost, you need to setup your own local MySQL database and replace the username, password and local database schema name in the  app/main/config.py with your own infomation:
local_db = "mysql+pymysql://username:password@127.0.0.1/local-database"

•	Step2: Install the dependency of Python
Navigate to the root directory of the backend code /app and install the python modules from requirements.txt file,
cd app
pip install -r requirements.txt

•	Step3: Set running environment
We provide three running environments: development, test and production.
Make sure “development” is selected for local setup in the file app/app.py.
app = create_app('development')

Note: If you like to use our production database running on AWS RDS, please select “production” environment.
•	Step4: Set up local database (Optional)
To create all the tables in the database, use the following command (inside app folder)
python3 app.py create_all

To delete all the tables in the database (inside app folder)
python3 app.py drop_all

•	Step5: Populate database with our movies dataset inside app folder (Optional)
Provide the database details to which you would like to insert data in the file init_data.py
Then run the following command:
python3 init_data.py

•	Step6: Start the backend application (inside app folder)
python3 app.py run

	You should be able to see the Swagger UI running at http://localhost:3001.
---------------------------------------------------------------------------------------------
Setup and Deployment Frontend

•	Step 1: Install frontend packages (inside client folder)
Navigate to the root directory of the frontend code /client and install the node modules from package.json file.
cd client
npm install

•	Step 2: Configure backend server location
Navigate to the file /client/src/config/axios.js and provide the backend server base url
baseURL: 'http://localhost:3001'

•	Step 3: Run the frontend server (inside client folder)
npm start

      You should be able to see the application running at http://localhost:3000.
--------------------------------------------------------------------------------------------------
Note: Please make sure the database MySql, backend flask and frontend node servers are up and running to use the application.

