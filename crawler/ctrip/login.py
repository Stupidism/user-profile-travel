from selenium import webdriver
from code_util import display_image
from cities import cities
import re
import sys

def login(browser):
    ### flights
    flight_order_list_url = 'http://my.ctrip.com/Home/Order/FlightOrderList.aspx'
    browser.get(flight_order_list_url)
    browser.implicitly_wait(10)
    flight_orders = []
    while True:
        flight_order_lis = browser.find_elements_by_css_selector('#orderList > li')
        for flight_order_li in flight_order_lis:
            flight_order = parse_flight_order(flight_order_li)
            flight_orders.append(flight_order)
        try:
            next_page_btn = browser.find_element_by_css_selector('#pagination > li:nth-child(3) > a')
            if 'disabled' in next_page_btn.get_attribute('class'):
                break
            next_page_btn.click()
            browser.implicitly_wait(10)
        except Exception:
            break
    ###

    ### points
    mine_mileage_url = 'https://sinfo.ctrip.com/MyInfo/AccountCenter/MineMileage.aspx'
    browser.get(mine_mileage_url)
    points_details = []
    while True:
        points_trs = browser.find_elements_by_css_selector('#tbodyPoints > tr')
        for points_tr in points_trs:
            points_detail = parse_point_detail(points_tr)
            points_details.append(points_detail)
        try:
            next_page_btn = browser.find_element_by_css_selector('#pageList > a.btn_next.disabled')
            if 'disabled' in next_page_btn.get_attribute('class'):
                break
            next_page_btn.click()
            browser.implicitly_wait(10)
        except Exception:
            break
    ###

    ### trains
    trains_url = 'http://my.ctrip.com/Home/Order/RailwayOrderList.aspx'
    browser.get(trains_url)
    trains = []
    while True:
        train_lis = browser.find_elements_by_css_selector('#orderList > li')
        for train_li in train_lis:
            train = parse_train(train_li)
            trains.append(train)
        try:
            next_page_btn = browser.find_element_by_css_selector('#pagination > li:nth-child(3) > a')
            if 'disabled' in next_page_btn.get_attribute('class'):
                break
            next_page_btn.click()
            browser.implicitly_wait(10)
        except Exception:
            break
    ###

    browser.close()
    return flight_orders, points_details, trains

def parse_train(train_li):
    order_id = train_li.find_element_by_css_selector('h3 > span:nth-child(2) > a').text
    # TODO: add timezone?
    booking_date = train_li.find_element_by_css_selector('h3 > span.ilb.mr10.bookingDate').get_attribute('bd')
    train_info = train_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(1)')
    order_name = train_info.text
    departure_station = order_name.split("→")[0]
    arrival_station_and_train_number = order_name.split("→")[1].strip()
    r = re.compile("([^a-zA-Z]+)([a-zA-Z0-9]+)")
    m = r.match(arrival_station_and_train_number)
    if m:
        arrival_station = m.group(1)
        train_number = m.group(2)
    else:
        arrival_station = None
        train_number = None
    arrival_city = get_city_from_station(arrival_station)
    departure_city = get_city_from_station(departure_station)

    # TODO: PROBLEM multiple passengers?
    passengers = train_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(2) > div > div').text
    departure_date_time = train_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(3)').text
    base_price = train_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(4) > span').text
    order_status = train_li.find_element_by_css_selector(
        'table > tbody > tr > td:nth-child(6) > p:nth-child(2)').text
    # TODO: change this, 'FlightDomestic' || 'FlightInternational'
    type = 'Train'
    train = {'_id': order_id, 'orderId': order_id, 'bookingDate': booking_date, 'orderName': order_name, 'arrivalStation': arrival_station,
                    'departureCity': departure_city, 'arrivalCity': arrival_city, 'departureStation': departure_station,
                    'passengers': passengers, 'departAt': departure_date_time, 'basePrice': base_price, 'trainNumber': train_number,
                    'orderStatus': order_status, 'platform': '携程', 'type': type}
    return train

def get_city_from_station(station):
    for city in cities:
        if city in station:
            return city
    return None


def parse_point_detail(points_tr):
    date = points_tr.find_element_by_css_selector('td:nth-child(1)').text
    source = points_tr.find_element_by_css_selector('td:nth-child(2)').text
    basic_mileage = points_tr.find_element_by_css_selector('td:nth-child(3)').text.strip()
    mileage = points_tr.find_element_by_css_selector('td:nth-child(4)').text.strip()
    balance = points_tr.find_element_by_css_selector('td:nth-child(5)').text.strip()
    expire_date = points_tr.find_element_by_css_selector('td:nth-child(6)').text.strip()
    points_detail = {"date": date, "source": source, "basicMileage": basic_mileage, "mileage": mileage,
                     "balance": balance, "expireDate": expire_date}
    return points_detail


def parse_flight_order(flight_order_li):
    order_id = flight_order_li.find_element_by_css_selector('h3 > span:nth-child(2) > a').text
    # TODO: add timezone?
    booking_date = flight_order_li.find_element_by_css_selector('h3 > span.ilb.mr10.bookingDate').get_attribute('bd')
    flight_trip_info_td = flight_order_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(1)')
    order_name = flight_trip_info_td.text
    departure_city = order_name.split("-")[0]
    arrival_city = order_name.split("-")[-1].split('(')[0].strip()
    trip_type = order_name.split("-")[-1].split('(')[1].split(')')[0]
    # TODO: PROBLEM multiple passengers?
    passengers = flight_order_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(2) > div > div').text
    departure_date_time = flight_order_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(3)').text
    base_price = flight_order_li.find_element_by_css_selector('table > tbody > tr > td:nth-child(4) > span').text
    order_status = flight_order_li.find_element_by_css_selector(
        'table > tbody > tr > td:nth-child(6) > p:nth-child(2)').text
    # TODO: change this, 'FlightDomestic' || 'FlightInternational'
    if departure_city in cities and arrival_city in cities:
        type = 'FlightDomestic'
    else:
        type = 'FlightInternational'
    flight_order = {'_id': order_id, 'orderId': order_id, 'bookingDate': booking_date, 'orderName': order_name,
                    'departureCity': departure_city, 'arrivalCity': arrival_city, 'tripType': trip_type,
                    'passengers': passengers, 'departAt': departure_date_time, 'basePrice': base_price,
                    'orderStatus': order_status, 'platform': '携程', 'type': type}
    return flight_order

def login_with_username_and_password(username, password):
    browser = webdriver.Chrome()
    browser.get('https://accounts.ctrip.com/member/login.aspx')
    username_text = browser.find_element_by_id('txtUserName')
    username_text.send_keys(username)
    password_text = browser.find_element_by_id('txtPwd')
    password_text.send_keys(password)
    browser.implicitly_wait(2)
    code_text = browser.find_element_by_id('txtCode')
    code_block = browser.find_element_by_id('divVerifyCode')
    code_block_style = code_block.get_attribute('style')
    if ("display: none;" != code_block_style):
        code_image_data_uri = browser.find_element_by_css_selector('#imgCode').get_attribute('src')
        display_image(code_image_data_uri)
        code = input("Please enter the captcha:")
        code_text.send_keys(code)
    # TODO: repeat entering password and code until it is correct
    submit_btn = browser.find_element_by_id('btnSubmit')
    submit_btn.click()
    browser.implicitly_wait(10)
    return browser


if (__name__ == "__main__"):
    username = input('username:')
    password = input('password:')
    browser = login_with_username_and_password(username, password)
    print(login(browser))
