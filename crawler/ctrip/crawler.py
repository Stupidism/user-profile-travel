from login import login
from pymongo import MongoClient
from pymongo import ASCENDING
from pymongo.errors import WriteError
from getpass import getpass
from wechat_login import get_wechat_qrcode_img_url
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def process(flights, points_details, trains):
    print("Got {0} flights, {1} points details, {2} trains.".format(len(flights), len(points_details), len(trains)))
    client = MongoClient()
    db = client.get_database('outflitter')
    coll = db.get_collection('flight')
    for flight in flights:
        try:
            coll.find_one_and_replace({'_id': flight['_id']}, flight, upsert=True)
        except WriteError as err:
            print("Order not inserted due to error: {0}".format(err))
    coll = db.get_collection('pointsDetail')
    coll.ensure_index([("username", ASCENDING),
                       ("date", ASCENDING),
                       ("expireDate", ASCENDING),
                       ("source", ASCENDING)],
                      unique=True)
    for points_detail in points_details:
        try:
            coll.insert_one(points_detail)
        except WriteError as err:
            print("Points detail not inserted due to error: {0}".format(err))
    coll = db.get_collection('train')
    for train in trains:
        try:
            coll.find_one_and_replace({'_id': train['_id']}, train, upsert=True)
        except WriteError as err:
            print("Train not inserted due to error: {0}".format(err))
    print('done')

def ctrip():
    #username = input("Please enter your Ctrip username:")
    #password = getpass("Please enter your Ctrip password:")
    client = MongoClient()
    db = client.get_database('outflitter')
    browser = get_wechat_qrcode_img_url()
    try:
        WebDriverWait(browser, 60).until(
            EC.presence_of_element_located((By.ID, 'sideNav'))
        )
    except Exception:
        browser.quit()
        raise Exception()

    db.drop_collection('wechatQRCode')
    orders, points_details, trains = login(browser)
    process(orders, points_details, trains)

if (__name__ == '__main__'):
    ctrip()