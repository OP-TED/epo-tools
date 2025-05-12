from IPython.display import Image
import requests

def render_plantuml(plantuml_code):
    # Encode the diagram
    def deflate_and_encode(plantuml_text):
        import zlib
        import base64
        def encode6bit(b):
            if b < 10: return chr(48 + b)
            b -= 10
            if b < 26: return chr(65 + b)
            b -= 26
            if b < 26: return chr(97 + b)
            b -= 26
            if b == 0: return '-'
            if b == 1: return '_'
            return '?'

        def append3bytes(b1, b2, b3):
            c1 = b1 >> 2
            c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
            c3 = ((b2 & 0xF) << 2) | (b3 >> 6)
            c4 = b3 & 0x3F
            return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4)

        data = zlib.compress(plantuml_text.encode('utf-8'))[2:-4]
        res = ''
        i = 0
        while i + 3 <= len(data):
            res += append3bytes(data[i], data[i+1], data[i+2])
            i += 3
        if i + 1 == len(data):
            res += append3bytes(data[i], 0, 0)
        elif i + 2 == len(data):
            res += append3bytes(data[i], data[i+1], 0)
        return res

    encoded = deflate_and_encode(plantuml_code)
    url = f"http://www.plantuml.com/plantuml/png/{encoded}"
    return Image(url=url)
