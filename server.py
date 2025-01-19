from flask import Flask,jsonify,render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
import country_converter as coco

def create_connection(db_file):
  conn=None
  try:
    conn=sqlite3.connect(db_file)
  except Exception as e:
    print(e)
  return conn

df2=pd.read_csv('menu.csv')
connection=create_connection('demo.db')
df2.to_sql('menu_data',connection,if_exists='replace')
connection.close()

db_url='sqlite:///demo.db'
engine=create_engine(db_url,echo=True)
df=pd.read_sql("select * from menu_data",engine)


df3=pd.read_csv('McDonalds.csv')
connection2=create_connection('demo2.db')
df3.to_sql('loc_data',connection2,if_exists='replace')
connection2.close()

db_url2='sqlite:///demo2.db'
engine2=create_engine(db_url2,echo=True)
df_locations=pd.read_sql("select * from loc_data",engine2)


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
#barchart category with nurients
@app.route("/get-databarchart/<HealthCategory>")
def get_databarchart(HealthCategory):
    categories = df['Category'].value_counts().index
    # column_name = {
    #   1: 'Carbohydrates',
    #   2: 'Sugars',
    #   3: 'Protein',
    #   4: 'Calories',
    #   5: 'Total Fat'
    # }.get(HealthCategory)

    values = df.groupby('Category')[HealthCategory].mean().values
    data = [{"categories": categories[i], "values": int(values[i])} for i in range(len(categories))]
    
    return jsonify(data)



#Horizontal barchart

@app.route('/get-datahorizontalchart1/<HealthCategory>')
def get_datahorizontalchart1(HealthCategory):
  categories=df.groupby('Category')[HealthCategory].mean().dropna().nlargest(5).index
  values=df.groupby('Category')[HealthCategory].mean().dropna().nlargest(5).values
  data=[]
  for i in range(len(categories)):
       data.append({"categories":categories[i], "values":int(values[i])})
  return jsonify(data)

# Map for barnches
@app.route('/get-datamapchart1')
def get_datamapchart1():
  name=df_locations['country'].value_counts().index
  value=df_locations['country'].value_counts().values
  country_code = coco.convert(names=name, to='ISO2')

  data=[]
  for i in range(len(name)):
       data.append({"id":country_code[i],"name":name[i],"value":int(value[i])})
  return jsonify(data)

if __name__=='__main__':
  app.run(debug=True,port=90000)