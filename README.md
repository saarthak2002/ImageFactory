# Image Factory

A React Native mobile app for the Image Factory social media platform that focuses on creating and sharing AI generated art. Watch a full demonstration of the app [here](https://youtu.be/trwPyBvvdhU). Link to [backend repository](https://github.com/saarthak2002/ImageFactoryBackEnd).

<!-- ![Feed Demo](/docs/gifs/feed-demo.gif)
![Profile Demo](/docs/gifs/profile-demo.gif) -->

<kbd> <img src="./docs/gifs/feed-demo.gif" /> </kbd>
<kbd> <img src="./docs/gifs/profile-demo.gif" /> </kbd>

Each post displays the prompt used to create it, along with the aesthetic applied. This ties into Image Factory's primary goal- to inspire the user's creations based on what others have made and develop their prompt engineering skills.

## Backend

Image factory's backend is powered by a custom REST API constructed using Node.js and Express with MongoDB as the database. The repository for the backend can be viewed [here](https://github.com/saarthak2002/ImageFactoryBackEnd). The backend REST API was hosted on Heroku.

# Generate Image View

The heart of the app is the Picture Factory. Here, the user can enter a prompt to generate their image. They may also select an aesthetic preset to be applied to their image. Once the API call finishes, the newly created image is displayed to the user. Then, the user may post the image to the Image Factory network along with a caption. The post view also offers a suggested caption which is generated by AI based on the image the user has created. The post will appear on the feed of all other users who follow the poster, along with the caption, prompt, and aesthetic used, so others can be inspired to create their own art. Viewers of the post can like and comment on it as well.

<!-- ![Generate Image View Demo](/docs/gifs/generate-image-demo-1.gif)
![Generated Image from demo](/docs/screenshots/generate-image-demo-1.png) -->

<kbd> <img src="./docs/gifs/generate-image-demo-1.gif" /> </kbd>
<kbd> <img src="./docs/screenshots/generate-image-demo-1.png" /> </kbd>

# Authentication

The REST API offers custom endpoints for secure login and signup. A complete Authentication flow has been implemented with appropriate encryption and form validation.

![Login Demo](/docs/gifs/login-demo.gif)
![Sign Up Demo](/docs/gifs/signup-demo.gif)

# Feed View

The feed serves as the home page of the application. It uses the feed endpoint of the REST API to get a custom feed for each user based on the people they follow. The feed is the primary spot for interactions with posts like commenting and liking.

<!-- ![Feed View Scroll](/docs/gifs/feed-view-demo-2.gif)
![Feed Pagation Demo](/docs/gifs/feed-page.gif) -->

<kbd> <img src="./docs/gifs/feed-view-demo-2.gif" /> </kbd>
<kbd> <img src="./docs/gifs/feed-page.gif" /> </kbd>

## Performance

Image Factory uses the following optimizations to improve performance:

### CDN

Instead of storing images directly in the database, Image Factory makes use of a Content Delivery Network (CDN) to optimize performance. Images are served via the Image Factory REST API through links stored in the database from the Cloudinary API.

### Pagination

The REST API implements pagination to optimize the loading of the feed. Instead of loading all the posts when the feed view is first displayed, the app loads more posts as the user scrolls and reaches the bottom of the feed. This ensures that the feed view is responsive and snappy. If the user drags down from the top of the feed view, it triggers a refresh call to get new posts. If the user scrolls up past the bottom of the feed view, the system loads more posts from the database via the paginated REST API endpoint.

The second video above shows a demo of the feed pagination.

# Search View

The search view allows a user to find other people to follow. The user can type in a string and hit search, and all usernames similar to it are displayed along with the profile pictures. The user can then choose to view a profile, where there is a follow or unfollow button depending on if the user follows the person they are viewing or not (or a logout button if viewing their own profile). The user can also view their posts and like and comment on them from the search profile view.

<!-- ![Search View Demo](/docs/gifs/search-view-demo.gif)
![Search Image](/docs/screenshots/search-image.png) -->

<kbd> <img src="./docs/gifs/search-view-demo.gif" /> </kbd>
<kbd> <img src="./docs/screenshots/search-image.png" /> </kbd>

# Profile View

The profile view allows a logged in user to view and edit all of their posts. From the profile view, the user can also set or edit their display picture and profile bio. Clicking on a post brings up a view which has the comment and like options, as well as an additional edit button, if you are the poster.

![Profile](/docs/gifs/profile-demo-new.gif)
![Edit Profile](/docs/gifs/edit-profile-demo.gif)

# Navigation

The bottom tabs navigator uses React Native Navigation to provide animated transitions between the four main views, as well as the many nested screens within those views, while keeping track of where the route came from to go back easily.

![Navigation Tabs](/docs/screenshots/nav.png)