from deepface import DeepFace
import os
import json

import firebase_admin
from firebase_admin import credentials, storage

import requests
from PIL import Image
import numpy as np
from io import BytesIO


def detect_face(img: str) -> dict:
    """
    Detects the face in the given image and returns the result.
    """

    cred = credentials.Certificate("./firebase-cred.json")
    firebase_admin.initialize_app(
        cred, {"storageBucket": "snap-sync-ba2d6.appspot.com"}
    )

    # print("Entered")

    def list_files_in_folder(folder_path):
        bucket = storage.bucket()
        blobs = bucket.list_blobs(prefix=folder_path)

        file_list = []
        for blob in blobs:
            file_list.append(blob.name)

        return file_list

    images = []
    db = list_files_in_folder("images/")

    # if imgpath == "" or dbpath == "":
    #     return {"error": "No Path Provided!"}

    def changeToNPArray(img):
        response = requests.get(img)
        image_data = response.content

        image = Image.open(BytesIO(image_data))
        image_array = np.array(image)

        return image_array

    for i in range(0, len(db)):

        # img2 = dbpath + "/" + stored_images[i]
        result = DeepFace.verify(
            img1_path=changeToNPArray(img),
            img2_path=changeToNPArray(db[i]),
            enforce_detection=False,
            model_name="ArcFace",
            distance_metric="euclidean_l2",
        )
        # print("Result : ", result)
        if result["verified"]:
            images.append(db[i])

    # print("$  ".join(images))
    x = {
        "status": "success",
        "input_image": img,
        "message": "Face Detected!",
        "images": images,
    }
    print(json.dumps(x))


if __name__ == "__main__":
    import sys

    path1 = str(sys.argv[1])
    # path2 = str(sys.argv[2])
    result = detect_face(path1)
    print(result)
