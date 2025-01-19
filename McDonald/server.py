from flask import Flask,jsonify,render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine

# def create_connection(db_file):
#   conn=None
#   try:
#     conn=sqlite3.connect(db_file)
#   except Exception as e:
#     print(e)
#   return conn

# df=pd.read_csv('menu.csv')
# connection=create_connection('demo.db')
# df.to_sql('menu_data',connection,if_exists='replace')
# connection.close()

# db_url='sqlite:///demo.db'
# engine=create_engine(db_url,echo=True)
# df2=pd.read_sql("select * from menu_data",engine)
# print(df2)
df=pd.read_csv('menu.csv')
app=Flask(__name__)
@app.route('/')
def index():
  return render_template('index.html')
#pie chart code
@app.route('/get-datapiechart')
def get_datachart():
  categories=df['Category'].value_counts().index
  values=df['Category'].value_counts().values
  data=[]
  for i in range(len(categories)):
       data.append({"categories":categories[i], "values":int(values[i])})
  return jsonify(data)



if __name__=='__main__':
  app.run(debug=True)