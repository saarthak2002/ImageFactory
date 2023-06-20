# Image Factory

A React Native mobile app for the Image Factory social media platform that focuses on AI generated art.

Instead of storing images directly in the database, ImageFactory makes use of a Content Delivery Network (CDN) to optimize performance. Images are served via the ImageFactory REST API by links stored in the database from the Cloudinary API.

## Backend

Image factory's backend is powered by a custom REST API constructed using Node.js and Express with MongoDB as the database. The repository for the backend can be viewed [here](https://github.com/saarthak2002/ImageFactoryBackEnd).