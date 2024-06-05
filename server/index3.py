import firebase_admin
from firebase_admin import credentials, storage
import requests
from PIL import Image
import numpy as np
import io
from deepface import DeepFace

# Initialize Firebase
cred = credentials.Certificate("./firebase-cred.json")
firebase_admin.initialize_app(cred, {"storageBucket": "snap-sync-ba2d6.appspot.com"})


def download_image_from_firebase(path):
    print("Download Image Called : ", path)
    bucket = storage.bucket()
    blob = bucket.blob(path)
    image_bytes = blob.download_as_bytes()
    print("Image Downloaded")
    return image_bytes


def image_bytes_to_numpy(image_bytes):
    print("Image Bytes to Numpy Called :", type(image_bytes))
    image = Image.open(io.BytesIO(image_bytes))
    image_array = np.array(image)  # This will be in RGB order
    print("Image Array : ", image_array)
    return image_array


def rgb_to_bgr(image_array):
    return image_array[..., ::-1]  # Swap the R and B channels


def verify_images(image_path1, image_path2, convert_to_bgr=False):
    # Download images from Firebase Storage
    image_bytes1 = download_image_from_firebase(image_path1)
    image_bytes2 = download_image_from_firebase(image_path2)

    # Convert images to NumPy arrays
    image_array1 = image_bytes_to_numpy(image_bytes1)
    image_array2 = image_bytes_to_numpy(image_bytes2)

    # Convert to BGR if needed
    if convert_to_bgr:
        image_array1 = image_array1
        image_array2 = image_array2

    print("Image bytes 1 : ", image_bytes1)
    print("Image bytes 2 : ", image_bytes2)
    print("Image Array 1 : ", image_array1)
    print("Image Array 2 : ", image_array2)

    print("DeepFace Verify Called")
    # Verify the images using DeepFace
    result = DeepFace.verify(img1_path=image_array1, img2_path=image_array2)

    return result


# Example usage
image_path1 = "https://firebasestorage.googleapis.com/v0/b/snap-sync-ba2d6.appspot.com/o/images%2Fgokul_trio.jpg?alt=media&token=34eed20b-4597-4973-9e5d-9ea4f3d11936"
image_path2 = "https://firebasestorage.googleapis.com/v0/b/snap-sync-ba2d6.appspot.com/o/images%2Fsash_2.jpg?alt=media&token=8662f5fe-6324-4eeb-993b-1eb73d3bfdb0"
verification_result = verify_images(image_path1, image_path2)
print(verification_result)
