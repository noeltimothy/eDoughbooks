from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

#from extensions import db
#from models.daily.daily import Daily
from sqlalchemy import create_engine
#from sqlalchemy.orm import Session
#import simplejson
from datetime import datetime, timedelta
import pandas as pd


#def extensions(app):
#    db.init_app(app)
#    return None

app = Flask(__name__, static_folder="./static/public/dist", template_folder="./static/public")
CORS(app)

app.config.from_object('config.settings')
app.config.from_pyfile('settings.py', silent=True)
#db.init_app(app)

engine = create_engine("postgresql://postgres:admin@localhost:5432/test")

today_square_keys = {
    'fixed': ['need', 'deferred_for_today', 'next_morning', 'waters'], 
    'editable': [ 'have', 'burned', 'deferred' ],
    'inset': [ 'make' ]
}

yest_square_keys = {
    'fixed': ['need', 'have', 'burned', 'deferred_for_today', 'deferred', 'next_morning', 'sold', 'waters'],
    'inset': [ 'make' ],
}

today_round_keys = {
    'fixed': ['need', 'sold', 'waters'], 
    'editable': [ 'have', 'burned' ],
    'inset': [ 'make' ]
}

yest_round_keys = {
    'fixed': ['need', 'have', 'throw', 'sold', 'waters'], 
}

square_headers = {
    'have': 'Have',
    'make': 'MAKE',
    'next_morning': 'Next Morning',
    'waters': 'Waters',
    'burned': 'Burned',
    'sold': 'Sold',
    'deferred': 'Deferred for Tomorrow',
    'deferred_for_today': 'Deferred for Today',
    'need': 'Need',
}

round_headers = {
    'have': 'Have - Rounds per tray',
    'make': 'MAKE',
    'waters': 'Waters',
    'burned': 'Throw',
    'sold': 'Sold',
    'need': 'Need',
}

sq_sizes = { 'small': 31, 'large': 18, 'x-large': 12 }

def compute_need_squares(pizza_size):
    today = datetime.today()
    dates = [ (today - timedelta(weeks=x)).date() for x in range(1, 5) ]
    df = pd.read_sql(f"select *, date(created_date) as d from daily where date(created_date) >= '{dates[3]}'", engine)
    df = df[(df.pizza_type == 'squares') & (df.pizza_size == pizza_size)]
    df = df[df.d.isin(dates)]
    return df.sold.mean()
    
def compute_need_rounds(pizza_size):
    today = datetime.today()
    last_week = today - timedelta(weeks=1)
    dates = [ (last_week + timedelta(days=x)).date() for x in range(0, 4) ]
    df = pd.read_sql(f"select *, date(created_date) as d from daily where date(created_date) >= '{dates[0]}'", engine)
    df = df[(df.pizza_type == 'rounds') & (df.pizza_size == pizza_size)]
    df = df[df.d.isin(dates)]
    return (df.sold.sum() / 11).astype(int)

def get_nm(engine, size):
    if size == 'squares':
        today = datetime.now().strftime('%A')
        df = pd.read_sql(f"select * from nm where pizza_size = '{size}'", engine)
        return  int(df[df.day == today].nm.values[0])
    else:
        return 0

def fetch_daily(engine, ptype, size, date):
    df = pd.read_sql(f"select * from daily where date(created_date) = '{date.date()}'", engine)
    print (df)

    df = df[(df.pizza_type == ptype) & (df.pizza_size == size)]
    print (f'.. in fetch daily.. {size}, {date}')
    print (df)
    return df

@app.route('/today', methods=['GET'])
def today():
    pizza_type = request.args.get('pizza_type')
    pizza_size = request.args.get('pizza_size')
    today = datetime.today()
    yesterday = today - timedelta(days=1)

    todays_df = fetch_daily(engine, pizza_type, pizza_size, today) 
    yest_df = fetch_daily (engine, pizza_type, pizza_size, yesterday)

    if len(todays_df) == 0:
        need = compute_need_squares(pizza_size) if pizza_type == 'squares' else compute_need_rounds(pizza_size)
        print (f'new day: adding a new value with computed need value {need}')
        new_entry = { 
                'store_id':1,
                'pizza_type':pizza_type,
                'pizza_size':pizza_size,
                'need': need,
                'have': 0,
                'burned': 0,
                'deferred': 0,
                'next_morning': get_nm(engine, pizza_size),
                'make': need,
                'waters': float((need / sq_sizes[pizza_size])).round(2) if pizza_type == 'squares' else 0,
                'created_date': datetime.today()
        }
        print ('...............adding new entry .................')
        df = pd.DataFrame([new_entry])
        print (df)

        df.to_sql('daily', engine, if_exists='append')
        
        # Do not store deferred for today in the DB as we get it from yesterdays value
        new_entry['deferred_for_today'] = yest_df.deferred.values[0] if len(yest_df) else 0
        return jsonify({ 
            'data': [ new_entry ], 
            'keys': today_square_keys if pizza_type == 'squares' else today_round_keys, 
            'headers': square_headers if pizza_type == 'squares' else round_headers
        })
    else:
        todays_df['deferred_for_today'] = yest_df.deferred.values[0] if len(yest_df) else 0
        todays_df = todays_df.fillna(0)
        return jsonify({ 
            'data': todays_df.to_dict('records'),
            'keys': today_square_keys if pizza_type == 'squares' else today_round_keys, 
            'headers': square_headers if pizza_type == 'squares' else round_headers
        })


@app.route('/yesterday', methods=['GET'])
def yesterday():
    pizza_type = request.args.get('pizza_type')
    pizza_size = request.args.get('pizza_size')
    _df = fetch_daily (engine, pizza_type, pizza_size, datetime.now() - timedelta(days=2))

    return jsonify({ 
        'data': _df.to_dict('records'),
        'keys': yest_square_keys if pizza_type == 'squares' else yest_round_keys, 
        'headers': square_headers if pizza_type == 'squares' else round_headers
    })


if __name__ == '__main__':
    app.run(debug=True)
