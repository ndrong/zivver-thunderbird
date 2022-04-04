# Zivver for Thunderbird
## Introduction
This extension automatically detects Zivver messages and decrypts them on-the-fly using the Zivver API. Messages are decrypted only when actively displayed by the user and are never stored locally.

## Installation
1. Download the latest version of the extension from the [Releases page](https://github.com/NDrong/zivver-thunderbird/releases/latest).
2. Install the extension in Thunderbird (Tools > Add-ons and Themes > ⚙️ Settings > Install Add-on From File... > Select the downloaded .zip file and press 'Add' when prompted).
3. Click on the extension (under 'Manage Your Extensions') and go to the Preferences tab to add the required credentials.
4. In the 'Refresh token' field, enter your refresh token. This token can be found by logging into https://app.zivver.com while opening the Developer Tools (Ctrl + Shift + I) and looking for a request to https://app.zivver.com/api/authentication/login (see the screenshots below for an example request). The form data in this request should include a parameter called "request_token", containing a value starting with "Z1.1.2.". Copy the value (making sure to remove the quotes at the beginning and end) and paste it into the 'Refresh token' field.
5. In the 'Email address' field, simply enter the email address used to authenticate at https://app.ziver.com. Make sure to press 'Save' before exiting the Preferences tab.
6. To check whether the extension is configured properly, open a Zivver notification message in your Thunderbird inbox. If everything is working correctly, the message should be decrypted and shown in the message pane.


![Example request view 1](https://user-images.githubusercontent.com/22079593/161519542-013972e9-7c39-4474-97be-2e7c433c9717.png)
![Example request view 2](https://user-images.githubusercontent.com/22079593/161519555-f9d11faa-d44e-446e-9cbb-e45e5efe8609.png)  
_Screenshots showing where to find the refresh token using the Developer Tools on Firefox._

## Building from source
1. Clone the repo: `git@github.com:NDrong/zivver-thunderbird.git`
2. Change your current working directory to the cloned repo: `cd zivver-thunderbird`
3. Install dependencies: `npm install`
4. Build the extension: `npm run build`
5. The compiled extension can be found under `web-ext-artifacts/`

## Contributing
Contributions are welcome! Please feel free to open a pull request or issue if you have any suggestions or improvements.  
Since this is my very first Thunderbird extension, I'm aware that code quality may not be optimal (feel free to improve on that as well). 

Some ideas for future improvements:
- [ ] Add the ability to reply to messages via Zivver
- [ ] Improve the stylesheets (perhaps also making it possible to distinguish between own messages and messages from others?)
- [ ] Improve code quality (and add tests)
- [ ] ???

## License
This project is distributed under the [MIT License](LICENSE).

## Notice
This project is not affiliated with or endorsed by Zivver B.V.
