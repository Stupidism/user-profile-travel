#Requirements

    1. mongodb
    2. python3 (tested under 3.5.1 and 3.6)
    3. pip
    4. chrome, chrome web driver

    To install the python dependencies, you can:

    ```
    $ pip install -r requirements.txt
    ```
#Quick Start

```
$ python3 crawler.py
```

#Quick Run (Testing purpose)

```
from crawler import process
from login import login

orders = login('username', 'password')
process(orders)

```