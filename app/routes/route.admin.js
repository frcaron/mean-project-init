// Inject application
var jwt = require('jsonwebtoken');
var tokenConfig = require(global.__config + '/token');

// Inject service
var responseService = require(global.__service + '/ResponseService');

module.exports = function (router) {

	// =========================================================================================
	// Param validation
	// =========================================================================================

	// Validate param user_id
	router.param('user_id', function (req, res, next, user_id) {
		if (!user_id) {
			return responseService.fail(res, 'Request validation failed', 'Param "user_id" missing');
		}
		next();
	});

	// =========================================================================================
	// Public
	// =========================================================================================

	require('./admin/unlog/user')(router);

	// =========================================================================================
	// Middleware
	// =========================================================================================

	// Token verification
	router.use(function (req, res, next) {

		var token = req.body.token || req.param('token') || req.headers[ 'x-access-token' ];

		if (token) {
			jwt.verify(token, tokenConfig.secret, function (err, decoded) {
				if (err) {
					return responseService.fail(res, 'Session error', 'Session expired', 403);
				}

				// Admin access
				if (!decoded.admin) {
					return responseService.fail(res, 'Session error', 'Permission refused', 403);
				}

				// Follow token
				req.decoded = decoded;

				next();
			});
		} else {
			return responseService.fail(res, 'Session error', 'No session', 403);
		}
	});

	// =========================================================================================
	// Private
	// =========================================================================================

	require('./admin/log/user')(router);
};