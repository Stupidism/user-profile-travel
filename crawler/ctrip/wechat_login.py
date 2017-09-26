from selenium import webdriver
from pymongo import MongoClient

def get_wechat_qrcode_img_url():
    browser = webdriver.Chrome()
    browser.get('https://accounts.ctrip.com/member/login.aspx')
    wechat = browser.find_element_by_id("wechat")
    wechat.click()
    handles = browser.window_handles
    browser.switch_to.window(handles[1])
    wechat_img_url = browser.find_element_by_css_selector('body > div > div > div.waiting.panelContent > div.wrp_code > img').get_attribute('src')

    mongo_client = MongoClient()
    db = mongo_client.get_database('outflitter')
    coll = db.get_collection('wechatQRCode')
    coll.insert_one({'imgUrl': wechat_img_url})
    browser.switch_to.window(handles[0])
    return browser

if __name__ == '__main__':
    get_wechat_qrcode_img_url()