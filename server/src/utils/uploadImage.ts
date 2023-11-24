import { v2 as cloudinary } from "cloudinary";

const uploadImage = (image: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, {
      folder: path,
    }),
      function (error: any, result: any) {
        if (result && result.secure_url) {
          return resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
        return reject("error");
      };
  });
};

export default uploadImage;
