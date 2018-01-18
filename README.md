# Ramblings Blog App

[Ramblings](https://ramblings.herokuapp.com) is a blogging website I created for my wife. It is designed to display a more compact list of blog posts, while having a more open view of each one readily available. Any user can log in, comment on posts, reply to comments, and subscribe for email notifications of new posts. The operator has admin access and is able to create, edit, and delete new blog posts, as well as being able to do the same for any comments and replies. 

## Development
### Prerequisites
#### MongoDB
Ramblings uses MongoDB as its database. That being said, it uses a local Mongo shell for development. Be sure to download Mongo and run the local database before running your application.
#### Cloudinary
Ramblings uses Multer and Cloudinary to upload image files for blog posts. You will need to visit [cloudinary.com](cloudinary.com) and set up an account for image uploading the work properly.

### Setup
After cloning this repo, you will need to do the following to have it ready to run in your own environment:

Run `npm install` to install the dependencies from the package.json file into a node_modules folder. 

#### dev.js
Next, you will need to open the `config` folder and create the `dev.js` file. Within this file, you should have the following code:

```
module.exports = {
  adminCode: 'some_admin_code',
  databaseURL: 'mongodb://localhost/ramblings',
  emailPassword: 'some_password',
  cookieKey: 'some_cookie_key',
  cloudinaryKey: 'your_cloudinary_key',
  cloudinarySecret: 'your_cloudinary_secret'
};
```
-`adminCode` is a password you set that allows a user to register his or her account as an admin.
-`databaseURL` is your MongoDB shell. You can keep it as is, or change 'ramblings' to something else.
-`emailPassword` is for nodemailer. This should be the password to the admin email account. If you do not want nodemailer to send emails within development, make sure the password is incorrect (such as 'fakePassword').
-`cookieKey` is the secret key for cookie-session. Make sure this is something that would be hard to guess. (Keyboard mashing works just fine for this).
-`cloudinaryKey` and `cloudinarySecret` are two keys found within your Cloudinary account.

#### Cloudinary
Next, open up the `routes` folder and open `blog.js`. Under `// CLOUDINARY CONFIG`, change the `cloud_name` value from `drkgrntt` to whatever your cloud name is, found in your Cloudinary account.

#### Nodemailer
Next, within the same `blog.js` file, near the top, near `// NODEMAILER CONFIG`, change the `user` to the administrator's gmail account that corresponds with `emailPassword` that was configured in `dev.js` previously. Then, within the `// CREATE ROUTE`, find `mailOptions` (line 107) and change the `from` also the the administrator's email.

Next, within the `routes` folder and open `comments.js`. Near the top of both files, you will find a section labeled with the comment `// NODEMAILER CONFIG`. Once again, you will see `ramblingsblogger@gmail.com` in the same sort of config. Change both of those to the adminstrator's email. Additionally, change `cmaxey02@gmail.com` to the admin's perferred email. This is to notify of comments. It may be the same as the `from` email. 

### Fire it Up
Once everything is configured for development, you can run your application by entering `node app.js` in the command prompt. `Server is Running!` should print into your command prompt, and then you can view it on port 8080.

## Production
### Prerequisites
#### MLab
Because Ramblings uses MongoDB, it uses MLab in production. Create an account at [mlab.com](mlab.com) and create a database (there is a free option) for your application.
#### Heroku
Ramblings is deployed using Heroku. Be sure to set all of your config variables under settings. The most notable change from your `dev.js` configuration is your `DATABASEURL`, which will no longer be the local Mongo shell, but will be your MLab URL. It should look similar to this:
`mongodb://username:password@ds123456.mlab.com:78910/ramblings`
