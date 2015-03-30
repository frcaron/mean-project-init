// Inject models
var UserModel = require(global.__model + '/UserModel');

// Inject services
var responseService = require(global.__service + '/ResponseService');

module.exports = {

	// Create one user
	create    : function (req, res) {

		var user = new UserModel();

		user.name     = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		if (req.body.admin) { // TODO remove permission
			user.admin    = req.body.admin;
		}

		var promise = user.saveAsync();

		promise
			.then(function () {
				
				responseService.success(res, 'Add success', user._id);

			}, function (err) {

				if (err.code == 11000) {
					throw new Error('User exist');
				} else if (err) {
					throw err;
				}
			})

			.catch(function (err) {
				responseService.fail(res, 'Add failed', err.message);
			});

	},

	// Update one user
	update    : function (req, res) {

		var promise = UserModel.findByIdAsync(req.decoded.id);

		promise
			.then(function (user) {

				if (!user) {
					throw new Error('User not found');
				}

				if (req.body.name) {
					user.name = req.body.name;
				}
				if (req.body.password) {
					user.password = req.body.password;
				}

				return user.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Update success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Update failed', err.message);
			});
	},

	// Remove one user
	remove    : function (req, res, id) {

		var promise =  UserModel.removeAsync({
					_id : id
				});
		
		promise
			.then(function () {
				responseService.success(res, 'Remove success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Remove failed', err.message);
			});
	},

	// Get all users
	all       : function (req, res) {

		var promise = UserModel.findAsync();

		promise
			.then(function (users) {
				responseService.success(res, 'Find success', users);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Get one user by id
	getById   : function (req, res) {

		var promise = UserModel.findByIdAsync(req.decoded.id);

		promise
			.then(function (user) {
				responseService.success(res, 'Find success', user);
			})

			.catch(function (err) {
				responseService.fail(res, 'Find failed', err.message);
			});
	},

	// Set permission
	giveAdmin : function (req, res) {

		var promise = UserModel.findByIdAsync(req.params.user_id);

		promise
			.then(function (user) {

				user.admin = true;
				return user.saveAsync();
			})

			.then(function () {
				responseService.success(res, 'Give permission success');
			})

			.catch(function (err) {
				responseService.fail(res, 'Give permission failed', err.message);
			});
	}
};