from base64 import decodebytes
from PIL import Image

def display_image(gif_arr):
    gif_arr = gif_arr.split(",")
    gif_arr = gif_arr[1]

    fh = open("image.gif", "wb")
    fh.write(decodebytes(bytes(gif_arr, 'utf-8')))
    fh.close()
    image = Image.open("image.gif")
    image.show()

