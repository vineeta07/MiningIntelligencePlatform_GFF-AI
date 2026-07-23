import requests
import time

url = "http://localhost:8000/api/v1/classify/"

# Create a valid dummy JPEG image
from PIL import Image
img = Image.new('RGB', (224, 224), color = 'red')
img.save('dummy.jpg')

files = {'file': ('dummy.jpg', open('dummy.jpg', 'rb'), 'image/jpeg')}
data = {
    'mine_name': 'mine',
    'region': 'india',
    'gps_latitude': '25',
    'gps_longitude': '88'
}

print("Sending request to FastAPI...")
start = time.time()
try:
    response = requests.post(url, files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
print(f"Time taken: {time.time() - start:.2f} seconds")
