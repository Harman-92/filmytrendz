# COMP9900-CircEx
## FilmFinder project

## backend setup instructions
#### assume you are at the project root folder,
#### and before this you want to config your own
#### MySQL database into --> config.py local_db
### Step 1:
#### install virtual python environment
```python
sudo pip3 install virtualenv
virtualenv venv
```

### Step 2:  
#### activate virtual environment  
```python
cd ./venv/Scripts/
./activate(linux)
activate.bat(window)
```

### Step 3:  
#### install requirements 
```python
pip install app/requirements.txt
```

### Step 4:  
#### setup database  
```python
python set_up create_all
```
#### or clean all tables  
```python
python set_up drop_all
```

### Step 5:  
#### run app  
```python
python set_up run
```
