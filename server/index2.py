from deepface import DeepFace
import os
import json

import firebase_admin
from firebase_admin import credentials, storage
import numpy as np

import cv2
import urllib.request as urllib


cred = credentials.Certificate("./firebase-cred.json")
firebase_admin.initialize_app(
    cred,
    {"storageBucket": "snap-sync-ba2d6.appspot.com"},
)

bucket = storage.bucket()


def url_to_arr(path):
    imag = bucket.get_blob(path)
    arr = np.frombuffer(imag.download_as_string(), np.uint8)
    imageReadable = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    return imageReadable


def detect_face(img: str, dbpath: str) -> dict:
    """
    Detects the face in the given image and returns the result.
    """

    def list_files_in_folder(folder_path):
        blobs = bucket.list_blobs(prefix=folder_path)

        file_list = []
        for blob in blobs:
            file_list.append(blob.name)

        return file_list

    db = list_files_in_folder(dbpath)
    # print(db)

    nparr = []

    for str in db:
        if str == dbpath:
            continue
        imageArr = url_to_arr(str)
        nparr.append(imageArr)

    # print("Np arrays\n", nparr)

    inputImg = url_to_arr(img)
    # print("Input Image : ")

    images = []
    not_imgs = []
    for i in range(0, len(db) - 1):

        img1 = inputImg
        img2 = nparr[i]
        result = DeepFace.verify(
            img1_path=img1,
            img2_path=img2,
            enforce_detection=False,
            model_name="ArcFace",
            distance_metric="euclidean_l2",
            detector_backend="retinaface",
        )

        if result["verified"]:
            images.append(db[i + 1])
        else:
            not_imgs.append(db[i + 1])

    x = {
        "status": "success",
        "input_image": img,
        "message": "Face Detected!",
        "images_found": len(images),
        "images": images,
        "images_not_found": len(not_imgs),
        "images_not_found": not_imgs,
    }
    results_images = {
        "images_found": len(images),
        "images": images,
    }
    # print(json.dumps(x))
    return "$".join(images)


if __name__ == "__main__":
    import sys

    path1 = str(sys.argv[1])
    path2 = str(sys.argv[2])
    result = detect_face(path1, path2)
    print(result)
