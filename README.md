# COMP9900-CircEx
## FilmFinder project
### Access FilmFinder application on line: https://filmytrendz.netlify.app/
### You can find Swagger UI at: https://ec2-18-188-47-194.us-east-2.compute.amazonaws.com:3001

### Setup FilmFinder application on your local host following below instructions
## backend setup instructions
### Step 1: Config local database
If you are going to setup the application on your own localhost, you need to setup your
own local MySQL database and replace the username, password and local database in the 
app/main/config.py with your own username, password and local database:
```python
local_db = "mysql+pymysql://username:password@127.0.0.1/local-database"
```
### Step 2:  Install dependency of Python 
Navigate to backend root directory /app
```python
pip install app/requirements.txt
```

### Step 3:  Set running environment
We provide three running environments: development, test and production the default environment is development, 
if you want to try other environments you can modify it in the app/setup/app.py:
```python
app = create_app('development')
```
### Step 4:  Set database
To create all the tables in the database
```python
python3 app.py create_all
```
To delete all the tables in the database
```python
python3 app.py drop_all
```
### Step 5:  Populate database
```python
python3 init_data.py
```
### Step 6:  Run the backend application
```python
python3 app.py run
```
The server should be running on http://localhost:3001


## frontend setup instructions

### Step 1: Install frontend packages
Navigate to the root directory of the frontend code /client and install the node modules from package.json file.
cd client
```python
npm install
```

### Step 2: Configure backend server location
Navigate to the file /client/src/config/axios.js and provide the backend server base url
```python
baseURL: 'http://localhost:3001' 
```

### Step 3: Run the frontend server
```python
npm start 
```
You should be able to see the application running at http://localhost:3000
