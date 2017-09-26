from crawler import *
from pymongo import MongoClient
from traceback import print_exc
import time

def main():
    mongo_client = MongoClient()
    db = mongo_client.get_database('outflitter')
    coll = db.get_collection('login')
    print('Started daemon.')
    print('Waiting for login...')
    while True:
        login = coll.find_one()
        if not login == None:
            print('Got login.')
            db.drop_collection('flight')
            db.drop_collection('pointsDetail')
            db.drop_collection('train')
            db.drop_collection('wechatQRCode')
            try:
                ctrip()
            except Exception as err:
                print('failed due to {0}'.format(err))
                print_exc()
            coll.find_one_and_delete({'_id': login['_id']})
            print('Done. login deleted')
        time.sleep(1)

if __name__ == '__main__':
    main()