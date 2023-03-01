from sqlalchemy import create_engine
from datetime import datetime, timedelta
import pandas as pd
import sys

engine = create_engine("postgresql://postgres:admin@localhost:5432/test")
conn = engine.raw_connection()

csv = sys.argv[1]
pizza_type = sys.argv[2]
pizza_sizes = ['small', 'large'] 
pizza_sizes.append('x-large') if pizza_type == 'squares' else None


for w in range(0, 4):
    d = datetime.today() - timedelta(weeks=w) - timedelta(days=2)
    dates = pd.DataFrame([ d + timedelta(days=x) for x in range (0, 7)])
    for pizza_size in pizza_sizes:
        df = pd.read_csv(csv)
        df['throw'] = df['waters'] = 0
        df = df.join(dates)
        df = df.rename({0: 'created_date'}, axis=1)
        df['store_id'] = 1
        df['pizza_type'] = pizza_type
        df['pizza_size'] = pizza_size

        print (df)

        if sys.argv[3]:
            df.to_sql('daily', engine, if_exists='append')



