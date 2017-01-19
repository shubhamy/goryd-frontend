Goryd frontend project, Copyright © Eneo Technologies Pvt. Ltd. All rights reserved.

Theme used across website:
font: Roboto
Theme color: #1F3C8E
Grey shared: #FAFAFF

Green button color: #08c64a
Red button color: #ff4040
other button color: #314554
Button style: flat so add nothing to class in md-buttons

Note: Node.js s required. So install node.js first (https://nodejs.org/en/download/).
sudo apt-get install nodejs
sudo apt-get install npm

To set up the project
1. npm install -g npm (use sudo if it says permission denied)
2. npm install -g bower (use sudo if it says permission denied)
3. npm install -g gulp (use sudo if it says permission denied)
3. cd /goryd-frontend
4. npm Install
5.  add the followings in `/etc/hosts`

		23.23.138.248	bower.herokuapp.com
		192.30.252.131	github.com


6. bower install

To run the project
1. gulp

To test the project
1. karma start

Angular docs are available at http://localhost:8005/docs/

Errors:
-----------
	1. /usr/bin/env: ‘node’: No such file or directory


		$sudo ln -s "$(which nodejs)" /usr/bin/node


Before hosting the website changes to be done:
-----------
1. home.shareNow.html
Before
  <generic-Wizard hide-sm hide-xs step-List="['basic','map','upload','price','review']" current-Step-Var="formLevel" restrict-Movemarker='true' show-Nextprev='false'></generic-Wizard>
after
	<generic-Wizard hide-sm hide-xs step-List="['basic','map','upload','price','review']" current-Step-Var="formLevel" restrict-Movemarker='false' show-Nextprev='false'></generic-Wizard>


2. fb.js
Before
	appId: '851007408336465', // TEST
	// appId: '850926975011175', //GORYD
after
	// appId: '851007408336465', // TEST
	appId: '850926975011175', //GORYD

3. Uglify goryd.js and css files

Color Theme:
Header background:linear-gradient(to bottom left, #314554, #0433BC)
Search bar List Page, loading, login, register header, modal list, top left menu: #4378F8
Floating B,: #7E9EE1
Footer, login body,  buttons: #314554
text-login form: #c5c5c5
map markers: #4378F8
share home text: #424242
