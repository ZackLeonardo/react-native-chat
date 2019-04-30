# Base on Rocket.Chat(server) and Rocket.Chat React Native(app), but what is different:

## 1. using pure Expo.

## 2. add outside tabbar and can be used as a chat module with other modules liking what many apps need.

**Supported Server Versions:** 0.66.0+

## Demo

<img src="https://github.com/ZackLeonardo/react-native-chat/blob/master/demo/demo.gif" width="200" />

## Reporting an Issue

[Github Issues](https://github.com/ZackLeonardo/react-native-chat/issues) are used to track todos, bugs, feature requests, and more.

## Installing dependencies

Follow the [React Native Getting Started Guide](https://facebook.github.io/react-native/docs/getting-started.html) for detailed instructions on setting up your local machine for development.

## How to run app

- Clone repository and install dependencies:

  ```bash
  $ git clone https://github.com/ZackLeonardo/react-native-chat.git
  $ cd react-native-chat
  $ yarn install
  ```

- Run application
  ```bash
  $ expo start
  ```

### Running Rocket.Chat server

Follow the [Rocket.Chat Guide](https://github.com/RocketChat/Rocket.Chat)

tested server info:
![server info](https://github.com/ZackLeonardo/react-native-chat/blob/master/demo/server%20info.png)

## Current priorities

## Features

| Feature                                                       | Status |
| ------------------------------------------------------------- | ------ |
| Jitsi Integration                                             | ❌     |
| Federation (Directory)                                        | ❌     |
| Threads                                                       | ❌     |
| Record Audio                                                  | ✅     |
| Record Video                                                  | ❌     |
| Commands                                                      | ❌     |
| Draft message per room                                        | ❌     |
| Share Extension                                               | ❌     |
| Notifications Preferences                                     | ✅     |
| Edited status                                                 | ✅     |
| Upload video                                                  | ❌     |
| Grouped messages                                              | ✅     |
| Mark room as read                                             | ❌     |
| Mark room as unread                                           | ❌     |
| Tablet Support                                                | ❌     |
| Read receipt                                                  | ❌     |
| Broadbast Channel                                             | ✅     |
| Authentication via SAML                                       | ❌     |
| Authentication via CAS                                        | ❌     |
| Custom Fields on Signup                                       | ❌     |
| Report message                                                | ❌     |
| Theming                                                       | ❌     |
| Settings -> Review the App                                    | ❌     |
| Settings -> Default Browser                                   | ❌     |
| Admin panel                                                   | ❌     |
| Reply message from notification                               | ❌     |
| Unread counter banner on message list                         | ✅     |
| E2E                                                           | ❌     |
| Join a Protected Room                                         | ❌     |
| Optional Analytics                                            | ❌     |
| Settings -> About us                                          | ❌     |
| Settings -> Contact us                                        | ❌     |
| Settings -> Update App Icon                                   | ❌     |
| Settings -> Share                                             | ❌     |
| Accessibility (Medium)                                        | ❌     |
| Accessibility (Advanced)                                      | ❌     |
| Authentication via Meteor                                     | ❌     |
| Authentication via Wordpress                                  | ❌     |
| Authentication via Custom OAuth                               | ❌     |
| Add user to the room                                          | ✅     |
| Send message                                                  | ✅     |
| Authentication via Email                                      | ✅     |
| Authentication via Username                                   | ✅     |
| Authentication via LDAP                                       | ✅     |
| Message format: Markdown                                      | ✅     |
| Message format: System messages (Welcome, Message removed...) | ✅     |
| Message format: links                                         | ✅     |
| Message format: images                                        | ✅     |
| Message format: replies                                       | ✅     |
| Message format: alias with custom message (title & text)      | ✅     |
| Messages list: day separation                                 | ✅     |
| Messages list: load more on scroll                            | ✅     |
| Messages list: receive new messages via subscription          | ✅     |
| Subscriptions list                                            | ✅     |
| Segmented subscriptions list: Favorites                       | ✅     |
| Segmented subscriptions list: Unreads                         | ✅     |
| Segmented subscriptions list: DMs                             | ✅     |
| Segmented subscriptions list: Channels                        | ✅     |
| Subscriptions list: update user status via subscription       | ✅     |
| Numbers os messages unread in the Subscriptions list          | ✅     |
| Status change                                                 | ✅     |
| Upload image                                                  | ✅     |
| Take picture & upload it                                      | ✅     |
| 2FA                                                           | ✅     |
| Signup                                                        | ✅     |
| Autocomplete with usernames                                   | ✅     |
| Autocomplete with @all & @here                                | ✅     |
| Autocomplete room/channel name                                | ✅     |
| Upload audio                                                  | ✅     |
| Forgot your password                                          | ✅     |
| Login screen: terms of service                                | ✅     |
| Login screen: privacy policy                                  | ✅     |
| Authentication via Google                                     | ✅     |
| Authentication via Facebook                                   | ✅     |
| Authentication via Twitter                                    | ✅     |
| Authentication via GitHub                                     | ✅     |
| Authentication via GitLab                                     | ✅     |
| Authentication via LinkedIn                                   | ✅     |
| Create channel                                                | ✅     |
| Search Local                                                  | ✅     |
| Search in the API                                             | ✅     |
| Settings -> License                                           | ✅     |
| Settings -> App version                                       | ✅     |
| Autocomplete emoji                                            | ✅     |
| Upload file (documents, PDFs, spreadsheets, zip files, etc)   | ✅     |
| Copy message                                                  | ✅     |
| Pin message                                                   | ✅     |
| Unpin message                                                 | ✅     |
| Channel Info screen -> Members                                | ✅     |
| Channel Info screen -> Pinned                                 | ✅     |
| Channel Info screen -> Starred                                | ✅     |
| Channel Info screen -> Uploads                                | ✅     |
| Star message                                                  | ✅     |
| Unstar message                                                | ✅     |
| Channel Info screen -> Topic                                  | ✅     |
| Channel Info screen -> Description                            | ✅     |
| Star a channel                                                | ✅     |
| Message format: videos                                        | ✅     |
| Message format: audios                                        | ✅     |
| Edit message                                                  | ✅     |
| Delete a message                                              | ✅     |
| Reply message                                                 | ✅     |
| Quote message                                                 | ✅     |
| Muted state                                                   | ✅     |
| Offline reading                                               | ✅     |
| Offline writing                                               | ✅     |
| Edit profile                                                  | ✅     |
| Reactions                                                     | ✅     |
| Custom emojis                                                 | ✅     |
| Accessibility (Basic)                                         | ✅     |
| Tap notification, go to the channel                           | ✅     |
| Deep links: Authentication                                    | ✅     |
| Deep links: Rooms                                             | ✅     |
| Full name setting                                             | ✅     |
| Read only rooms                                               | ✅     |
| Typing status                                                 | ✅     |
| Create channel/group                                          | ✅     |
| Disable registration setting                                  | ✅     |
| Unread red line indicator on message list                     | ✅     |
| Search Messages in Channel                                    | ✅     |
| Mentions List                                                 | ✅     |
| Attachment List                                               | ✅     |
| Join a Room                                                   | ✅     |
