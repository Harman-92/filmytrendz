# COMP9900-CircEx
## FilmFinder project

## backend setup instructions
### Step 1: config local database
If you are going to setup the application on your own localhost, you need to setup your
own local MySQL database and replace the username, password and local database in the 
app/main/config.py with your own username, password and local database:
```python
local_db = "mysql+pymysql://username:password@127.0.0.1/local-database"
```
### Step 2:  install dependency of Python 
```python
pip install app/requirements.txt
```

### Step 3:  set running environment
We provide three running environments: development, test and production the default environment is development, 
if you want to try other environments you can modify it in the app/setup/app.py:
```python
app = create_app('development')
```
### Step 4:  set database
To create all the tables in the database
```python
python3 app.py create_all
```
To delete all the tables in the database
```python
python3 app.py drop_all
```
### Step 5:  run the backend application
```python
python3 app.py run
```
### Step 6:  initialize database
```python
python3 init_data.py
```